import * as THREE from "three";

type TextureEntry = {
  texture: THREE.Texture;
  references: number;
  lastUsed: number;
};

export type TextureLease = {
  texture: THREE.Texture;
  release: () => void;
};

const maxCachedTextures = 2;
const loadedTextures = new Map<string, TextureEntry>();
const pendingTextures = new Map<string, Promise<THREE.Texture>>();
let usageCounter = 0;

function touch(entry: TextureEntry) {
  entry.lastUsed = ++usageCounter;
}

function trimCache() {
  while (loadedTextures.size > maxCachedTextures) {
    const candidate = [...loadedTextures.entries()]
      .filter(([, entry]) => entry.references === 0)
      .sort(([, first], [, second]) => first.lastUsed - second.lastUsed)[0];

    if (!candidate) return;

    const [path, entry] = candidate;
    entry.texture.dispose();
    loadedTextures.delete(path);
  }
}

function createTexture(
  path: string,
  gl: THREE.WebGLRenderer,
  anisotropy: number | "max"
) {
  const loader = new THREE.TextureLoader();

  return new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      path,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping = THREE.UVMapping;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const maxAnisotropy = gl.capabilities.getMaxAnisotropy?.() ?? 1;
        const requestedAnisotropy =
          anisotropy === "max"
            ? maxAnisotropy
            : Math.min(maxAnisotropy, anisotropy);
        texture.anisotropy = Math.max(1, requestedAnisotropy);
        texture.needsUpdate = true;

        resolve(texture);
      },
      undefined,
      reject
    );
  });
}

function getTexturePromise(
  path: string,
  gl: THREE.WebGLRenderer,
  anisotropy: number | "max"
) {
  const cached = loadedTextures.get(path);
  if (cached) {
    touch(cached);
    return Promise.resolve(cached.texture);
  }

  const pending = pendingTextures.get(path);
  if (pending) return pending;

  const promise = createTexture(path, gl, anisotropy).then((texture) => {
    loadedTextures.set(path, {
      texture,
      references: 0,
      lastUsed: ++usageCounter,
    });
    pendingTextures.delete(path);
    return texture;
  });

  pendingTextures.set(path, promise);
  promise.catch(() => pendingTextures.delete(path));
  return promise;
}

export function acquireTimelineTexture(
  path: string,
  gl: THREE.WebGLRenderer,
  anisotropy: number | "max"
): Promise<TextureLease> {
  return getTexturePromise(path, gl, anisotropy).then((texture) => {
    const entry = loadedTextures.get(path);
    if (!entry || entry.texture !== texture) {
      throw new Error(`Timeline texture cache entry missing for ${path}`);
    }

    entry.references += 1;
    touch(entry);
    trimCache();

    let released = false;
    return {
      texture,
      release: () => {
        if (released) return;
        released = true;
        const current = loadedTextures.get(path);
        if (!current || current.texture !== texture) return;
        current.references = Math.max(0, current.references - 1);
        touch(current);
        trimCache();
      },
    };
  });
}

export function prefetchTimelineTexture(
  path: string,
  gl: THREE.WebGLRenderer,
  anisotropy: number | "max"
) {
  return getTexturePromise(path, gl, anisotropy).then(() => {
    trimCache();
  });
}

export function disposeUnusedTimelineTextures() {
  for (const [path, entry] of loadedTextures) {
    if (entry.references > 0) continue;
    entry.texture.dispose();
    loadedTextures.delete(path);
  }
}