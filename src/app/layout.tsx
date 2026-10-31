import { Outlet, useLocation, NavLink } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { PrototypeBanner, Avatar } from '../shared/ui';
import { DemoSwitcher } from '../shared/DemoSwitcher';
import { LogOutIcon, UserIcon, HomeIcon, FileTextIcon, UserPlusIcon, ShieldIcon, MenuIcon, XIcon } from '../shared/ui/icons';
import { useState } from 'react';

export default function AppLayout() {
  const location = useLocation();
  const { data: currentUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.auth.me(),
    staleTime: 1000 * 60 * 5,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Feed', icon: <HomeIcon size={20} /> },
    { path: '/posts/new', label: 'Nova publicação', icon: <FileTextIcon size={20} /> },
    { path: '/me', label: 'Minhas publicações', icon: <UserPlusIcon size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PrototypeBanner />

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 hover:opacity-80">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <HomeIcon size={20} />
            </span>
            <span className="hidden sm:block">Achei no Campus</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right side: DemoSwitcher + User menu */}
          <div className="flex items-center gap-3">
            <DemoSwitcher />

            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="true"
                >
                  <Avatar name={currentUser.displayName} size="sm" />
                  <span className="hidden sm:block">{currentUser.displayName}</span>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 uppercase">
                    {currentUser.role === 'MODERATOR' ? 'Moderador' : 'Usuário'}
                  </span>
                </button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <div className="px-3 py-2 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900">{currentUser.displayName}</p>
                      <p className="text-xs text-slate-500">{currentUser.id}</p>
                    </div>
                    <NavLink
                      to="/me"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon size={18} />
                      Minhas publicações
                    </NavLink>
                    {currentUser.role === 'MODERATOR' && (
                      <NavLink
                        to="/moderation"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShieldIcon size={18} />
                        Moderação
                      </NavLink>
                    )}
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-slate-100"
                      onClick={() => {
                        api.auth.logout();
                        setMobileMenuOpen(false);
                        window.location.href = '/login';
                      }}
                    >
                      <LogOutIcon size={18} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="hidden sm:flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                <UserIcon size={18} />
                Entrar
              </NavLink>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 border-t border-slate-200 pt-4">
            <nav className="space-y-1" aria-label="Navegação mobile">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              {currentUser && (
                <>
                  <hr className="my-2 border-slate-200" />
                  <NavLink
                    to="/me"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserIcon size={20} />
                    Minhas publicações
                  </NavLink>
                  {currentUser.role === 'MODERATOR' && (
                    <NavLink
                      to="/moderation"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShieldIcon size={20} />
                      Moderação
                    </NavLink>
                  )}
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-slate-100"
                    onClick={() => {
                      api.auth.logout();
                      setMobileMenuOpen(false);
                      window.location.href = '/login';
                    }}
                  >
                    <LogOutIcon size={20} />
                    Sair
                  </button>
                </>
              )}
              {!currentUser && (
                <NavLink
                  to="/login"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon size={20} />
                  Entrar
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
        Protótipo v0.1 — dados simulados
      </footer>
    </div>
  );
}