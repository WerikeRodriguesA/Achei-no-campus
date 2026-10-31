/**
 * Centralized navigation configuration
 * Single source of truth for routes and navigation items
 */

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ size?: number }>;
  roles?: Array<'USER' | 'MODERATOR'>;
  requiresAuth?: boolean;
}

export const navItems: NavItem[] = [
  { label: 'Feed', path: '/', requiresAuth: true },
  { label: 'Nova publicação', path: '/posts/new', requiresAuth: true },
  { label: 'Minhas publicações', path: '/me', requiresAuth: true },
  { label: 'Minhas reivindicações', path: '/claims', requiresAuth: true },
  { label: 'Minhas denúncias', path: '/reports', requiresAuth: true },
];

export const moderationNavItems: NavItem[] = [
  { label: 'Moderação', path: '/moderation', roles: ['MODERATOR'], requiresAuth: true },
];

export const authNavItems: NavItem[] = [
  { label: 'Entrar', path: '/login', requiresAuth: false },
  { label: 'Cadastrar', path: '/cadastro', requiresAuth: false },
];

export const routes = {
  home: '/',
  login: '/login',
  register: '/cadastro',
  feed: '/',
  createPost: '/posts/new',
  postDetail: (id: string) => `/posts/${id}`,
  postEdit: (id: string) => `/posts/${id}/edit`,
  myPosts: '/me',
  claims: '/claims',
  reports: '/reports',
  moderation: '/moderation',
  styleguide: '/_styleguide',
} as const;

export type Routes = typeof routes;