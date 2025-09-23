import { useCallback, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  value?: string;
  onUploaded: (url: string) => void;
  bucket?: string;
  accept?: string;
  disabled?: boolean;
};

export default function UploadModelField({
  value,
  onUploaded,
  bucket = import.meta.env.VITE_SUPABASE_MODELS_BUCKET || "models",
  accept = ".glb,.gltf,.zip,.usdz,.obj",
  disabled,
}: Props) {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSelect = useCallback(
    async (file: File) => {
      if (!file) return;
      setUploading(true);
      setProgress(0);

      const path = `${Date.now()}_${file.name}`;
      const tick = setInterval(() => setProgress((p) => Math.min(95, p + 5)), 120);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      clearInterval(tick);
      if (error) {
        setUploading(false);
        setProgress(0);
        console.error(error);
        alert("Upload failed");
        return;
      }

      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
      setProgress(100);
      setUploading(false);
      if (pub?.publicUrl) onUploaded(pub.publicUrl);
    },
    [bucket, onUploaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) onSelect(file);
    },
    [disabled, onSelect]
  );

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors p-4 ${
          disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-sm text-white/90 font-medium">Upload 3D model</p>
        <p className="text-xs text-white/60">Accepted: {accept} — Bucket: {bucket}</p>

        {uploading && (
          <div className="mt-3 h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${progress}%` }} />
          </div>
        )}

        {!uploading && value && (
          <div className="mt-3 text-xs text-emerald-300 break-all">Uploaded URL: {value}</div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
        }}
      />
    </div>
  );
}
