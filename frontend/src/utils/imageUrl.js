import { API_IMAGE_BASE_URL } from '../config/api';

/**
 * Get the full image URL from a relative path
 * @param {string} imagePath - Relative image path (e.g., '/uploads/image.jpg')
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, prepend the API base URL
  return `${API_IMAGE_BASE_URL}${imagePath}`;
};

