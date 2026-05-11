const CL_CLOUD  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CL_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

/** Canvas-compress to JPEG 0.75, max 1200px — identical to the original HTML */
export function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
        else if (h > MAX)     { w = Math.round((w * MAX) / h); h = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => resolve(new File([blob!], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })),
          "image/jpeg", 0.75
        );
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadPhoto(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const compressed = await compressImage(file);
  const fd = new FormData();
  fd.append("file", compressed);
  fd.append("upload_preset", CL_PRESET);
  fd.append("folder", "muchi-koi");
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CL_CLOUD}/image/upload`, { method: "POST", body: fd });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  onProgress?.(100);
  return data.secure_url as string;
}

export async function uploadPhotos(files: File[], onProgress?: (pct: number) => void): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    urls.push(await uploadPhoto(files[i]));
    onProgress?.(Math.round(((i + 1) / files.length) * 100));
  }
  return urls;
}
