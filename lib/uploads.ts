import type { UploadedAsset } from "@/lib/types";

export const MAX_UPLOAD_SIZE_BYTES = 1_000_000;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
]);

const allowedExtensions = new Set(["pdf", "docx", "xlsx", "pptx", "txt", "csv", "png", "jpg", "jpeg"]);

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function validateUploadFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mimeValid = !file.type || allowedMimeTypes.has(file.type);
  const extensionValid = allowedExtensions.has(extension);

  if (!mimeValid && !extensionValid) {
    return {
      valid: false,
      error: "Unsupported file type. Use PDF, DOCX, XLSX, PPTX, TXT, CSV, PNG, or JPG.",
    };
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${formatFileSize(MAX_UPLOAD_SIZE_BYTES)}.`,
    };
  }

  return { valid: true };
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read file contents."));
      }
    };

    reader.onerror = () => reject(new Error("Unable to read file contents."));
    reader.readAsDataURL(file);
  });
}

export async function buildUploadedAsset(file: File): Promise<UploadedAsset> {
  const dataUrl = await readFileAsDataUrl(file);

  return {
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    dataUrl,
  };
}
