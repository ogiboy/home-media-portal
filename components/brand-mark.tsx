import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  title?: string;
};

export default function BrandMark({ className, title }: BrandMarkProps) {
  const labelled = Boolean(title);

  return (
    <svg
      viewBox="0 0 64 64"
      role={labelled ? 'img' : 'presentation'}
      aria-hidden={labelled ? undefined : true}
      className={cn('h-8 w-8 text-primary', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.9"
      />
      <circle
        cx="32"
        cy="32"
        r="13"
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M18 36c6.5 6.5 21 7 28-3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="40" cy="22" r="4" fill="var(--accent)" />
      <circle cx="26" cy="42" r="3" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
