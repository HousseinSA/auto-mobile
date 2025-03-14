import sharp from "sharp";

export const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export async function compressImage(
  buffer: Buffer,
  options = {
    quality: 60,
    maxWidth: 1200,
    maxHeight: 1200,
  }
): Promise<Buffer> {
  return sharp(buffer)
    .jpeg({ quality: options.quality, progressive: true })
    .resize(options.maxWidth, options.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();
}

export function isImage(fileName: string): boolean {
  return /\.(jpg|jpeg|png|webp)$/i.test(fileName);
}
