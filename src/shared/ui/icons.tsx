/**
 * Ícones SVG inline (U4) — sem biblioteca externa
 * EDITE AQUI: adicione/remova ícones conforme necessário
 */
import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Helper para criar ícones - exportado para uso em outros arquivos (ex: FullState)
 */
export function createIcon(content: string) {
  return function Icon({ size = 20, className = '', ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
        aria-hidden="true"
      >
        {content}
      </svg>
    );
  };
}

export const SearchIcon = createIcon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>');
export const PlusIcon = createIcon('<path d="M12 5v14M5 12h14"/>');
export const UserIcon = createIcon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>');
export const FlagIcon = createIcon('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V4"/>');
export const CheckIcon = createIcon('<polyline points="20 6 9 17 4 12"/>');
export const XIcon = createIcon('<path d="M18 6 6 18M6 6l12 12"/>');
export const ClockIcon = createIcon('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>');
export const MapPinIcon = createIcon('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>');
export const TrashIcon = createIcon('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>');
export const EditIcon = createIcon('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>');
export const ArrowRightIcon = createIcon('<path d="M5 12h14M12 5l7 7-7 7"/>');
export const ImageIcon = createIcon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>');
export const ShieldIcon = createIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>');
export const ChevronDownIcon = createIcon('<polyline points="6 9 12 15 18 9"/>');
export const ChevronLeftIcon = createIcon('<polyline points="15 18 9 12 15 6"/>');
export const ChevronRightIcon = createIcon('<polyline points="9 18 15 12 9 6"/>');
export const MenuIcon = createIcon('<path d="M3 12h18M3 6h18M3 18h18"/>');
export const XCircleIcon = createIcon('<circle cx="12" cy="12" r="10"/><path d="M15 9 9 15M9 9l6 6"/>');
export const CheckCircleIcon = createIcon('<circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/>');
export const EyeIcon = createIcon('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>');
export const EyeOffIcon = createIcon('<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M23 23l-1.5-1.5"/><path d="M17 17l-5-5"/>');
export const BellIcon = createIcon('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>');
export const AlertCircleIcon = createIcon('<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>');
export const MessageSquareIcon = createIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>');
export const FileTextIcon = createIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8M16 17H8M10 9H8"/>');
export const LoaderIcon = createIcon('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>');
export const HomeIcon = createIcon('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>');
export const UserPlusIcon = createIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11v6a2 2 0 0 1-2 2h-6"/><path d="M22 11h-6"/>');
export const SettingsIcon = createIcon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>');
export const LogOutIcon = createIcon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><path d="M21 12H9"/>');
export const FlaskConicalIcon = createIcon('<path d="M10 2v7.31"/><path d="M14 2v7.31"/><path d="M8.5 2h7"/><path d="M7 9.31a5 5 0 0 1 10 0"/><path d="M8.5 9.31H7"/><path d="M17 9.31h1.5"/>');
export const RefreshCwIcon = createIcon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M21 12a9 9 0 1 1-9 9c2.52 0 4.93-1 6.74-2.74L21 8"/>');
export const InboxIcon = createIcon('<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>');
export const LockIcon = createIcon('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>');