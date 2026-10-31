import type { ClaimRequest, Comment, Location, Post, Report, User } from '../../domain/types';

export const DEMO_PASSWORD = 'demo123';

export const SEED_USERS: User[] = [
  { id: 'u-marina', displayName: 'Marina', role: 'USER' },
  { id: 'u-rafael', displayName: 'Rafael', role: 'USER' },
  { id: 'u-moderacao', displayName: 'Equipe de Moderação', role: 'MODERATOR' },
];

export const SEED_LOCATIONS: Location[] = [
  { id: 'loc-bloco-a', name: 'Bloco A' },
  { id: 'loc-bloco-b', name: 'Bloco B' },
  { id: 'loc-biblioteca', name: 'Biblioteca' },
  { id: 'loc-cantina', name: 'Cantina' },
  { id: 'loc-quadra', name: 'Quadra' },
  { id: 'loc-patio', name: 'Pátio' },
  { id: 'loc-lab-info', name: 'Laboratório de Informática' },
  // TODO(#3): Substituir pela lista real de locais do Campus Corrente do IFPI
  // Issue: https://github.com/.../issues/3
];

const svgPhoto = (label: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e0f2f7"/><circle cx="200" cy="110" r="45" fill="#0e7490"/><text x="200" y="235" font-size="20" text-anchor="middle" fill="#155e75" font-family="sans-serif">${label}</text></svg>`,
  )}`;

export const SEED_POSTS: Post[] = [
  {
    id: 'p-found-1',
    kind: 'FOUND',
    status: 'OPEN',
    title: 'Fone de ouvido preto',
    description: 'Encontrei um fone de ouvido preto na área do Bloco A.',
    photoUrls: [svgPhoto('Fone de ouvido')],
    locationId: 'loc-bloco-a',
    approxDate: '2026-10-28T12:00:00.000Z',
    custody: 'GUARITA',
    authorId: 'u-rafael',
    hidden: false,
    createdAt: '2026-10-28T14:30:00.000Z',
    updatedAt: '2026-10-28T14:30:00.000Z',
  },
  {
    id: 'p-lost-1',
    kind: 'LOST',
    status: 'OPEN',
    title: 'Mochila azul com notebook',
    description: 'Perdi minha mochila azul com o notebook dentro.',
    photoUrls: [],
    locationId: 'loc-bloco-b',
    approxDate: '2026-10-27T09:00:00.000Z',
    authorId: 'u-marina',
    hidden: false,
    createdAt: '2026-10-27T10:00:00.000Z',
    updatedAt: '2026-10-27T10:00:00.000Z',
  },
  {
    id: 'p-found-2',
    kind: 'FOUND',
    status: 'RESOLVED',
    resolution: 'RETURNED',
    title: 'Carteira marrom',
    description: 'Encontrei uma carteira marrom na cantina.',
    photoUrls: [],
    locationId: 'loc-cantina',
    approxDate: '2026-10-25T08:00:00.000Z',
    custody: 'DISCIPLINA',
    authorId: 'u-rafael',
    hidden: false,
    createdAt: '2026-10-25T11:00:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z',
  },
  {
    id: 'p-lost-2',
    kind: 'LOST',
    status: 'IN_PROGRESS',
    title: 'Carteira marrom',
    description: 'Perdi minha carteira marrom com documentos.',
    photoUrls: [],
    locationId: 'loc-bloco-b',
    approxDate: '2026-10-24T16:00:00.000Z',
    authorId: 'u-marina',
    hidden: false,
    createdAt: '2026-10-24T18:00:00.000Z',
    updatedAt: '2026-10-24T18:00:00.000Z',
  },
  {
    id: 'p-found-3',
    kind: 'FOUND',
    status: 'OPEN',
    title: 'Relógio dourado',
    description: 'Encontrei um relógio dourado no laboratório de informática.',
    photoUrls: [],
    locationId: 'loc-lab-info',
    approxDate: '2026-10-23T15:00:00.000Z',
    custody: 'DISCIPLINA',
    authorId: 'u-marina',
    hidden: false,
    createdAt: '2026-10-23T17:00:00.000Z',
    updatedAt: '2026-10-23T17:00:00.000Z',
  },
  {
    id: 'p-lost-3',
    kind: 'LOST',
    status: 'RESOLVED',
    resolution: 'FOUND_BY_OWNER',
    title: 'Bolsa de couro',
    description: 'Perdi minha bolsa de couro com documentos.',
    photoUrls: [],
    locationId: 'loc-quadra',
    approxDate: '2026-10-20T08:30:00.000Z',
    authorId: 'u-rafael',
    hidden: false,
    createdAt: '2026-10-20T12:00:00.000Z',
    updatedAt: '2026-10-21T10:00:00.000Z',
  },
  {
    id: 'p-found-4',
    kind: 'FOUND',
    status: 'OPEN',
    title: 'Tablet com capa preta',
    description: 'Encontrei um tablet com capa preta na biblioteca.',
    photoUrls: [svgPhoto('Tablet')],
    locationId: 'loc-biblioteca',
    approxDate: '2026-10-22T14:00:00.000Z',
    custody: 'GUARITA',
    authorId: 'u-marina',
    hidden: true,
    createdAt: '2026-10-22T16:00:00.000Z',
    updatedAt: '2026-10-22T16:00:00.000Z',
  },
  {
    id: 'p-found-5',
    kind: 'FOUND',
    status: 'OPEN',
    title: 'Garrafa de água',
    description: 'Encontrei uma garrafa de água no pátio.',
    photoUrls: [],
    locationId: 'loc-patio',
    approxDate: '2026-10-29T08:00:00.000Z',
    custody: 'GUARITA',
    authorId: 'u-rafael',
    hidden: false,
    createdAt: '2026-10-29T09:00:00.000Z',
    updatedAt: '2026-10-29T09:00:00.000Z',
  },
  {
    id: 'p-lost-4',
    kind: 'LOST',
    status: 'OPEN',
    title: 'Livro de física',
    description: 'Perdi meu livro de física da coleção do professor.',
    photoUrls: [],
    locationId: 'loc-bloco-a',
    approxDate: '2026-10-26T07:30:00.000Z',
    authorId: 'u-rafael',
    hidden: false,
    createdAt: '2026-10-26T08:00:00.000Z',
    updatedAt: '2026-10-26T08:00:00.000Z',
  },
  {
    id: 'p-found-6',
    kind: 'FOUND',
    status: 'RESOLVED',
    resolution: 'RETURNED',
    title: 'Caderno de anotações',
    description: 'Encontrei um caderno de anotações na cantina.',
    photoUrls: [],
    locationId: 'loc-cantina',
    approxDate: '2026-10-18T09:00:00.000Z',
    custody: 'DISCIPLINA',
    authorId: 'u-marina',
    hidden: false,
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-19T10:00:00.000Z',
  },
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'p-lost-1',
    authorId: 'u-rafael',
    text: 'Vi uma mochila azul perto da quadra hoje.',
    createdAt: '2026-10-27T12:00:00.000Z',
  },
];

export const SEED_CLAIMS: ClaimRequest[] = [
  {
    id: 'cl-1',
    postId: 'p-found-5',
    claimantId: 'u-marina',
    message: 'Encontrei a garrafa e ela está comigo agora.',
    status: 'PENDING',
    createdAt: '2026-10-29T10:00:00.000Z',
  },
];

export const SEED_REPORTS: Report[] = [
  {
    id: 'r-1',
    postId: 'p-found-4',
    reporterId: 'u-rafael',
    reason: 'Conteúdo duplicado de outro post.',
    status: 'OPEN',
  },
];

export interface MockState {
  users: User[];
  locations: Location[];
  posts: Post[];
  comments: Comment[];
  claims: ClaimRequest[];
  reports: Report[];
  sessionUserId: string | null;
}

export function createInitialState(): MockState {
  return {
    users: SEED_USERS,
    locations: SEED_LOCATIONS,
    posts: SEED_POSTS,
    comments: SEED_COMMENTS,
    claims: SEED_CLAIMS,
    reports: SEED_REPORTS,
    sessionUserId: null,
  };
}

// identificador (e-mail institucional ou matrícula) -> id do usuário do seed
export const SEED_IDENTIFIERS: Record<string, string> = {
  'marina@campus.edu.br': 'u-marina',
  '2026001': 'u-marina',
  'rafael@campus.edu.br': 'u-rafael',
  '2026002': 'u-rafael',
  'moderacao@campus.edu.br': 'u-moderacao',
  '2026003': 'u-moderacao',
};
