// Cloudinary URL transformation helpers

/**
 * Transform a Cloudinary URL to include optimization parameters
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    blur?: boolean;
  } = {}
): string {
  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  const { width, height, quality = 80, blur = false } = options;

  // Build transformation string
  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push("c_fill"); // Crop to fill
  transforms.push(`q_${quality}`);
  transforms.push("f_auto"); // Auto format (webp, avif, etc.)

  if (blur) {
    transforms.push("e_blur:1000");
    transforms.push("q_10");
  }

  const transformString = transforms.join(",");

  // Insert transformation into URL
  // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/[transforms]/folder/file
  return url.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Get a tiny blur placeholder URL
 */
export function getBlurPlaceholder(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 10,
    height: 10,
    quality: 10,
    blur: true,
  });
}

/**
 * Get optimized URL for card thumbnails
 */
export function getCardImageUrl(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 400,
    height: 300,
    quality: 75,
  });
}

/**
 * Get optimized URL for detail page images
 */
export function getDetailImageUrl(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 800,
    height: 800,
    quality: 85,
  });
}
