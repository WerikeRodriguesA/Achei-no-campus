/**
 * Avatar component with initials fallback
 * EDITE AQUI: ajuste tamanhos, cores de fundo
 */
import { cx } from '../utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string; // para gerar iniciais
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const bgColors = [
  'bg-brand-100 text-brand-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
  'bg-red-100 text-red-700',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getBgColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index]!;
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const initials = name ? getInitials(name) : '?';
  const bgColor = name ? getBgColor(name) : 'bg-slate-100 text-slate-700';
  const fallbackAlt = alt ?? name ?? 'Avatar';

  if (src) {
    return (
      <img
        src={src}
        alt={fallbackAlt}
        className={cx('rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cx(
        'inline-flex items-center justify-center rounded-full font-medium select-none',
        sizeClasses[size],
        bgColor,
        className,
      )}
      aria-label={name ?? 'Avatar'}
    >
      {initials}
    </div>
  );
}

/**
 * AvatarGroup - grupo de avatares sobrepostos
 */
export interface AvatarGroupProps {
  avatars: Array<{ src?: string; name: string; alt?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cx('flex -space-x-2', className)} aria-label={`${avatars.length} pessoas`}>
      {visible.map((avatar, index) => (
        <Avatar
          key={avatar.name}
          src={avatar.src}
          alt={avatar.alt}
          name={avatar.name}
          size={size}
          className={cx('ring-2 ring-white', { 'z-index': max - index > 0 })}
        />
      ))}
      {remaining > 0 && (
        <div
          className={cx(
            'inline-flex items-center justify-center rounded-full font-medium select-none ring-2 ring-white',
            sizeClasses[size],
            'bg-slate-100 text-slate-700',
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}