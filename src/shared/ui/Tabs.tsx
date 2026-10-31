/**
 * Accessible Tabs component
 * EDITE AQUI: ajuste variantes, orientação
 */
import { type ReactNode } from 'react';
import { cx } from '../utils';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'line' | 'enclosed' | 'soft';
}

export function Tabs({ tabs, activeTab, onChange, className, variant = 'line' }: TabsProps) {
  return (
    <div className={cx(className)} role="tablist" aria-orientation="horizontal">
      <div
        className={cx(
          'flex gap-1',
          variant === 'line' && 'border-b border-slate-200',
          variant === 'enclosed' && 'rounded-lg bg-slate-100 p-1',
          variant === 'soft' && 'rounded-lg bg-slate-100 p-1',
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={cx(
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset',
              activeTab === tab.id
                ? variant === 'line'
                  ? 'text-brand-600 border-b-2 border-brand-600 -mb-px'
                  : 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
              tab.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={`panel-${tab.id}`}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="mt-4"
        >
          {activeTab === tab.id && tab.children}
        </div>
      ))}
    </div>
  );
}