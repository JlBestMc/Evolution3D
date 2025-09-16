// Global ambient types for Sketchfab Viewer API used in the app
declare global {
  interface SketchfabAPI {
    start(): void;
    addEventListener(event: "viewerready", cb: () => void): void;
    addEventListener(
      event: "annotationSelect",
      cb: (index: number) => void
    ): void;
    createAnnotationFromScenePosition(
      position: [number, number, number],
      title: string,
      description: string,
      cb: (err: unknown, index: number) => void
    ): void;
  }

  interface SketchfabClient {
    init(
      uid: string,
      options: {
        success: (api: SketchfabAPI) => void;
        error: (e?: unknown) => void;
      }
    ): void;
  }

  interface Window {
    // Sketchfab constructor available after loading their script
    Sketchfab?: new (iframe: HTMLIFrameElement) => SketchfabClient;
  }
}

export {};
