/**
 * Convert compatibility score (0-100) to star rating (1-5)
 */
export function scoreToStars(score: number): number {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

/**
 * Render star display component
 */
export function StarRating({ score }: { score: number }) {
  const stars = scoreToStars(score);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= stars ? 'text-yellow-400' : 'text-brand-200'}>
          ⭐
        </span>
      ))}
      <span className="ml-2 text-xs font-semibold text-brand-600">{stars}.0</span>
    </div>
  );
}
