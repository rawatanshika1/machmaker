type BadgeProps = {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'muted';
};

const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-100 text-slate-800',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  muted: 'bg-slate-50 text-slate-600',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}>{label}</span>;
}
