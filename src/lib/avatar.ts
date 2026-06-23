/**
 * Generate avatar URLs using DiceBear API
 */

export function getAvatarUrl(firstName: string, gender: 'Male' | 'Female' | 'Other' = 'Male'): string {
  const seed = encodeURIComponent(firstName.toLowerCase());
  const isMale = gender === 'Male';
  const maleParam = isMale ? 'male' : '';
  
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}${maleParam ? `&style=${maleParam}` : ''}`;
}

/**
 * Alternative simpler approach - just use seed variations
 */
export function getAvatarUrlSimple(firstName: string, gender?: string): string {
  const seed = encodeURIComponent(firstName.toLowerCase());
  const isMale = gender === 'Male';
  
  // DiceBear avataaars style with seed
  // For male, we can add parameters to vary the style
  const params = new URLSearchParams();
  params.append('seed', seed);
  if (isMale) {
    params.append('style', 'male');
  }
  
  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
}
