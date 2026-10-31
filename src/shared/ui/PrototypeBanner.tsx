/**
 * PrototypeBanner - faixa fixa indicando que é protótipo com dados simulados
 * EDITE AQUI: ajuste texto, cor, posição
 */
import { cx } from '../utils';
import { FlaskConicalIcon } from './icons';

export function PrototypeBanner() {
  return (
    <div
      className={cx(
        'fixed top-0 left-0 right-0 z-40',
        'bg-amber-50 border-b border-amber-200',
        'px-4 py-2',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto max-w-5xl flex items-center justify-center gap-2">
        <FlaskConicalIcon size={16} className="text-amber-600 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium text-amber-800">
          PROTÓTIPO: dados simulados — não representa dados reais
        </span>
      </div>
    </div>
  );
}