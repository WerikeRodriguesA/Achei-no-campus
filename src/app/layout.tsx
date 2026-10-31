import { Outlet } from 'react-router';
import { DemoSwitcher } from '../shared/DemoSwitcher';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-slate-900">Achei no Campus</h1>
          <DemoSwitcher />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
        Protótipo com dados simulados.
      </footer>
    </div>
  );
}
