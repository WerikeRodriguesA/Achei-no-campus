/**
 * Utilitários compartilhados
 * EDITE AQUI: adicione utilitários conforme necessário
 */

/**
 * Compose class names (sem dependência externa)
 * Uso: cx('base', condition && 'conditional', { 'variant': true })
 */
export function cx(...args: (string | Record<string, boolean> | undefined | null | false)[]): string {
  return args
    .flatMap((arg) => {
      if (!arg) return [];
      if (typeof arg === 'string') return arg.split(' ').filter(Boolean);
      return Object.entries(arg)
        .filter(([, v]) => v)
        .map(([k]) => k);
    })
    .join(' ');
}

/**
 * Formata data relativa em pt-BR (ex: "há 2 horas", "ontem", "03/10/2026")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours} h`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;

  return formatDate(dateString);
}

/**
 * Formata data completa em pt-BR (ex: "03/10/2026 às 14:30")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formata apenas a data (ex: "03/10/2026")
 */
export function formatDateOnly(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}