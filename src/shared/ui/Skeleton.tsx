/**
 * Skeleton loading components
 * EDITE AQUI: ajuste animações, variantes
 */
import { cx } from '../utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  const baseStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'circular') {
    return (
      <div
        className={cx('rounded-full bg-slate-200 animate-pulse', className)}
        style={baseStyle}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={cx('rounded-lg bg-slate-200 animate-pulse', className)}
        style={baseStyle}
        aria-hidden="true"
      />
    );
  }

  // text variant - multiple lines
  return (
    <div className={cx('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cx('rounded h-4 bg-slate-200 animate-pulse', i === lines - 1 && 'w-3/4')}
          style={{ width: i === lines - 1 ? undefined : width }}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - card skeleton para listas
 */
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </div>
      </div>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="60%" />
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" width={80} height={20} />
        <Skeleton variant="rectangular" width={80} height={20} />
      </div>
    </div>
  );
}

/**
 * SkeletonFeedItem - skeleton para item do feed
 */
export function SkeletonFeedItem() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 animate-pulse space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" width={70} height={20} />
        <Skeleton variant="rectangular" width={90} height={20} />
      </div>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" lines={2} />
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    </div>
  );
}

/**
 * SkeletonDetail - skeleton para página de detalhe
 */
export function SkeletonDetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton variant="text" width="30%" />
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" width={70} height={20} />
        <Skeleton variant="rectangular" width={100} height={20} />
      </div>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="rectangular" width="100%" height={200} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="text" lines={2} />
      </div>
      <Skeleton variant="text" lines={3} width="100%" />
    </div>
  );
}