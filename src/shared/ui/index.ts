/**
 * Shared UI components - public exports
 * EDITE AQUI: adicione/remova exports conforme necessário
 */

// Base components
export { Button, IconButton } from './Button';
export { Input } from './Input';
export { Textarea } from './Textarea';
export { Select } from './Select';
export { RadioGroup } from './RadioGroup';
export { FormField } from './FormField';

// Badge components
export { Badge, KindBadge, StatusBadge, ClaimStatusBadge, ReportStatusBadge } from './Badge';

// Layout components
export { Card, CardHeader, CardContent, CardFooter } from './Card';
export { Avatar, AvatarGroup } from './Avatar';
export { Tabs } from './Tabs';

// Dialog components
export { Dialog, DialogFooter } from './Dialog';
export { ConfirmDialog } from './ConfirmDialog';

// Toast system
export { ToastProvider, useToast, useToastHelpers } from './Toast';

// State components
export { Skeleton, SkeletonCard, SkeletonFeedItem, SkeletonDetail } from './Skeleton';
export { Spinner, InlineSpinner } from './Spinner';
export { EmptyState, EmptyFeed, EmptyComments, EmptyClaims, EmptyMyPosts, EmptyReports } from './EmptyState';
export { ErrorState, InlineErrorState, ErrorBoundaryFallback } from './ErrorState';

// Header components
export { PageHeader, SectionHeader } from './PageHeader';
export { PrototypeBanner } from './PrototypeBanner';

// Icons
export * from './icons';

// Utils
export { cx, formatRelativeDate, formatDate, formatDateOnly } from '../utils';

// FullState (existing)
export { FullState } from './FullState';
export type { FullStateVariant } from './FullState';