type BadgeProps = {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'muted';
};

const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-brand-100 text-brand-800 border border-brand-200',
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  muted: 'bg-brand-50 text-brand-700 border border-brand-100',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}>{label}</span>;
}
