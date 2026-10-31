import type { ClaimView, CommentView, Post, Report, User } from '../../domain/types';
import { ApiError } from '../errors';
import { checkTransition } from '../../domain/post-status';
import { DEMO_PASSWORD, SEED_IDENTIFIERS, createInitialState, type MockState } from './seed';
import { loadState, saveState } from './store';
import type {
  Api,
  AuthApi,
  ClaimsApi,
  CommentsApi,
  CreatePostInput,
  DemoControls,
  PostView,
  PostsApi,
  ReportsApi,
} from '../ports';

export interface MockApiDeps {
  latencyMs?: number;
}

export type MockAdapter = Api & DemoControls;

const toPublicUser = (user: User) => ({
  id: user.id,
  displayName: user.displayName,
  role: user.role,
});

const publicUserOr = (state: MockState, id: string) => {
  const user = findUser(state, id);
  return user ? toPublicUser(user) : { id, displayName: 'Autor' };
};

const findUser = (state: MockState, id: string): User | undefined =>
  state.users.find((user) => user.id === id);

const toPostView = (state: MockState, post: Post): PostView => ({
  ...post,
  author: publicUserOr(state, post.authorId),
});

const toCommentView = (
  state: MockState,
  comment: { authorId: string; postId: string; id: string; text: string; createdAt: string },
) => ({
  ...comment,
  author: findUser(state, comment.authorId)
    ? toPublicUser(findUser(state, comment.authorId)!)
    : { id: comment.authorId, displayName: 'Autor' },
});

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
const isHiddenVisibleTo = (post: Post, viewer: User): boolean =>
  !post.hidden || viewer.role === 'MODERATOR' || post.authorId === viewer.id;

export function createMockApi(deps: MockApiDeps = {}): MockAdapter {
  const latencyMs = deps.latencyMs ?? 300;
  const latency = (): Promise<void> =>
    new Promise((resolve) => window.setTimeout(resolve, latencyMs));
  let state: MockState = loadState();

  const persist = (): void => saveState(state);
  const currentUser = (): User | null =>
    state.users.find((user) => user.id === state.sessionUserId) ?? null;

  const auth: AuthApi = {
    async login(input) {
      await latency();
      const identifier =
        input.method === 'INSTITUTIONAL_EMAIL'
          ? input.identifier.trim().toLowerCase()
          : input.identifier.trim();
      const userId = SEED_IDENTIFIERS[identifier];
      const user = userId ? findUser(state, userId) : undefined;
      if (!user) {
        throw new ApiError('NOT_FOUND', 'Usuário não encontrado.');
      }
      if (input.password !== DEMO_PASSWORD) {
        throw new ApiError('VALIDATION', 'Senha inválida.');
      }
      state.sessionUserId = user.id;
      persist();
      return toPublicUser(user);
    },
    async register(input) {
      await latency();
      const displayName = input.displayName.trim();
      if (displayName.length < 3) {
        throw new ApiError('VALIDATION', 'Nome deve ter no mínimo 3 caracteres.', {
          displayName: 'Nome deve ter no mínimo 3 caracteres.',
        });
      }
      const user: User = { id: `u-${Date.now()}`, displayName, role: 'USER' };
      state.users.push(user);
      state.sessionUserId = user.id;
      persist();
      return toPublicUser(user);
    },
    async me() {
      await latency();
      const user = currentUser();
      return user ? toPublicUser(user) : null;
    },
    async logout() {
      state.sessionUserId = null;
      persist();
    },
  };

  const validateCreate = (input: CreatePostInput): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};
    const now = Date.now();
    if (input.title.length < 3 || input.title.length > 80) {
      fieldErrors.title = 'Título deve ter de 3 a 80 caracteres.';
    }
    if (input.description.length < 10 || input.description.length > 1000) {
      fieldErrors.description = 'Descrição deve ter de 10 a 1000 caracteres.';
    }
    if (Number.isNaN(Date.parse(input.approxDate)) || Date.parse(input.approxDate) > now) {
      fieldErrors.approxDate = 'Data aproximada não pode ser futura.';
    }
    if (input.kind === 'FOUND') {
      if (!input.custody) {
        fieldErrors.custody = 'A guarda é obrigatória em publicações FOUND.';
      }
    } else if (input.custody) {
      fieldErrors.custody = 'A guarda não é permitida em publicações LOST.';
    }
    if (input.photos && input.photos.length > 3) {
      fieldErrors.photos = 'É permitido até 3 fotos.';
    }
    return fieldErrors;
  };

  const postsApi: PostsApi = {
    async list(params) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      let items = state.posts.filter((post) => isHiddenVisibleTo(post, viewer));
      if (params.kind) {
        items = items.filter((post) => post.kind === params.kind);
      }
      if (params.status) {
        items = items.filter((post) => post.status === params.status);
      }
      if (params.locationId) {
        items = items.filter((post) => post.locationId === params.locationId);
      }
      if (params.mine) {
        items = items.filter((post) => post.authorId === viewer.id);
      }
      if (params.q) {
        const query = normalize(params.q);
        items = items.filter(
          (post) =>
            normalize(post.title).includes(query) || normalize(post.description).includes(query),
        );
      }
      const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const scoped = params.cursor
        ? sorted.filter((post) => post.createdAt < params.cursor!)
        : sorted;
      const pageItems = scoped.slice(0, 10);
      const last = pageItems.length > 0 ? pageItems[pageItems.length - 1] : undefined;
      return {
        items: pageItems.map((post) => toPostView(state, post)),
        nextCursor: last ? last.createdAt : null,
      };
    },
    async get(id) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === id);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (post.hidden && post.authorId !== viewer.id && viewer.role !== 'MODERATOR') {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      return toPostView(state, post);
    },
    async create(input) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const fieldErrors = validateCreate(input);
      if (Object.keys(fieldErrors).length > 0) {
        throw new ApiError('VALIDATION', 'Dados inválidos.', fieldErrors);
      }
      const now = new Date().toISOString();
      const post: Post = {
        id: `p-${Date.now()}`,
        kind: input.kind,
        status: 'OPEN',
        title: input.title,
        description: input.description,
        photoUrls: [],
        locationId: input.locationId,
        approxDate: input.approxDate,
        custody: input.custody,
        authorId: viewer.id,
        hidden: false,
        createdAt: now,
        updatedAt: now,
      };
      state.posts.push(post);
      persist();
      return toPostView(state, post);
    },
    async update(id, input) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === id);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (post.authorId !== viewer.id) {
        throw new ApiError('FORBIDDEN', 'Apenas o autor pode alterar a publicação.');
      }
      if (post.status === 'RESOLVED') {
        throw new ApiError('INVALID_TRANSITION', 'Não é possível editar publicação resolvida.');
      }
      if (input.title !== undefined) post.title = input.title;
      if (input.description !== undefined) post.description = input.description;
      if (input.locationId !== undefined) post.locationId = input.locationId;
      if (input.approxDate !== undefined) post.approxDate = input.approxDate;
      if (input.custody !== undefined) post.custody = input.custody;
      post.updatedAt = new Date().toISOString();
      persist();
      return toPostView(state, post);
    },
    async remove(id) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === id);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (post.authorId !== viewer.id) {
        throw new ApiError('FORBIDDEN', 'Apenas o autor pode excluir a publicação.');
      }
      state.posts = state.posts.filter((item) => item.id !== id);
      state.comments = state.comments.filter((item) => item.postId !== id);
      state.claims = state.claims.filter((item) => item.postId !== id);
      state.reports = state.reports.filter((item) => item.postId !== id);
      persist();
    },
    async transition(id, to, resolution) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === id);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      const check = checkTransition(post, to, viewer, resolution);
      if (!check.ok) {
        throw new ApiError(check.code, 'Transição inválida.', undefined);
      }
      post.status = to;
      post.resolution = to === 'RESOLVED' ? resolution : undefined;
      post.updatedAt = new Date().toISOString();
      persist();
      return toPostView(state, post);
    },
    async locations() {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      return [...state.locations];
    },
  };

  const commentsApi: CommentsApi = {
    async list(postId) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      if (!state.posts.some((post) => post.id === postId)) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      return state.comments
        .filter((comment) => comment.postId === postId)
        .map((comment) => toCommentView(state, comment));
    },
    async add(postId, text) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === postId);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (post.status === 'RESOLVED' || post.hidden) {
        throw new ApiError(
          'FORBIDDEN',
          'Não é possível comentar em publicações resolvidas ou ocultas.',
        );
      }
      if (text.length < 1 || text.length > 500) {
        throw new ApiError('VALIDATION', 'Comentário deve ter de 1 a 500 caracteres.', {
          text: 'Comentário deve ter de 1 a 500 caracteres.',
        });
      }
      const comment: CommentView = {
        id: `c-${Date.now()}`,
        postId,
        authorId: viewer.id,
        text,
        createdAt: new Date().toISOString(),
        author: toPublicUser(viewer),
      };
      state.comments.push(comment);
      persist();
      return comment;
    },
    async remove(commentId) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const comment = state.comments.find((item) => item.id === commentId);
      if (!comment) {
        throw new ApiError('NOT_FOUND', 'Comentário não encontrado.');
      }
      const isAuthor = comment.authorId === viewer.id;
      const isModerator = viewer.role === 'MODERATOR';
      if (!isAuthor && !isModerator) {
        throw new ApiError('FORBIDDEN', 'Apenas o autor do comentário pode removê-lo.');
      }
      state.comments = state.comments.filter((item) => item.id !== commentId);
      persist();
    },
  };

  const claimsApi: ClaimsApi = {
    async request(postId, message) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === postId);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (post.kind !== 'FOUND' || post.status !== 'OPEN') {
        throw new ApiError(
          'VALIDATION',
          'Reivindicação permitida apenas para FOUND com status OPEN.',
        );
      }
      if (post.authorId === viewer.id) {
        throw new ApiError('FORBIDDEN', 'O autor não reivindica a própria publicação.');
      }
      const existing = state.claims.find(
        (claim) =>
          claim.postId === postId && claim.claimantId === viewer.id && claim.status === 'PENDING',
      );
      if (existing) {
        throw new ApiError(
          'VALIDATION',
          'Já existe uma reivindicação pendente para esta publicação.',
        );
      }
      if (message.length < 10 || message.length > 500) {
        throw new ApiError(
          'VALIDATION',
          'Mensagem de reivindicação deve ter de 10 a 500 caracteres.',
          {
            message: 'Mensagem de reivindicação deve ter de 10 a 500 caracteres.',
          },
        );
      }
      const claim: ClaimView = {
        id: `cl-${Date.now()}`,
        postId,
        claimantId: viewer.id,
        message,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        claimant: toPublicUser(viewer),
      };
      state.claims.push(claim);
      persist();
      return claim;
    },
    async listForPost(postId) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === postId);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (post.authorId === viewer.id) {
        return state.claims
          .filter((claim) => claim.postId === postId)
          .map((claim) => ({
            ...claim,
            claimant: publicUserOr(state, claim.claimantId),
          }));
      }
      if (viewer.role === 'MODERATOR') {
        return [];
      }
      return state.claims
        .filter((claim) => claim.postId === postId && claim.claimantId === viewer.id)
        .map((claim) => ({
          ...claim,
          claimant: publicUserOr(state, claim.claimantId),
        }));
    },
    async decide(claimId, decision) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const claim = state.claims.find((item) => item.id === claimId);
      if (!claim) {
        throw new ApiError('NOT_FOUND', 'Reivindicação não encontrada.');
      }
      const post = state.posts.find((item) => item.id === claim.postId);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (decision === 'ACCEPT') {
        const check = checkTransition(post, 'IN_PROGRESS', viewer);
        if (!check.ok) {
          throw new ApiError(check.code, 'Transição inválida.', undefined);
        }
        claim.status = 'ACCEPTED';
        post.status = 'IN_PROGRESS';
      } else {
        claim.status = 'REJECTED';
      }
      persist();
      const claimant = findUser(state, claim.claimantId);
      const claimView: ClaimView = {
        ...claim,
        claimant: claimant ? toPublicUser(claimant) : publicUserOr(state, claim.claimantId),
      };
      return claimView;
    },
    async withdraw(claimId) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const claim = state.claims.find((item) => item.id === claimId);
      if (!claim) {
        throw new ApiError('NOT_FOUND', 'Reivindicação não encontrada.');
      }
      if (claim.claimantId !== viewer.id) {
        throw new ApiError('FORBIDDEN', 'Apenas o solicitante pode retirar a reivindicação.');
      }
      claim.status = 'WITHDRAWN';
      persist();
    },
  };

  const reportsApi: ReportsApi = {
    async create(postId, reason) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      const post = state.posts.find((item) => item.id === postId);
      if (!post) {
        throw new ApiError('NOT_FOUND', 'Publicação não encontrada.');
      }
      if (reason.length < 5 || reason.length > 300) {
        throw new ApiError('VALIDATION', 'Motivo de denúncia deve ter de 5 a 300 caracteres.', {
          reason: 'Motivo de denúncia deve ter de 5 a 300 caracteres.',
        });
      }
      const existing = state.reports.find(
        (report) =>
          report.postId === postId && report.reporterId === viewer.id && report.status === 'OPEN',
      );
      if (existing) {
        throw new ApiError('VALIDATION', 'Uma denúncia por usuário por publicação.');
      }
      const report: Report = {
        id: `r-${Date.now()}`,
        postId,
        reporterId: viewer.id,
        reason,
        status: 'OPEN',
      };
      state.reports.push(report);
      persist();
      return report;
    },
    async listOpen() {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      if (viewer.role !== 'MODERATOR') {
        throw new ApiError('FORBIDDEN', 'Apenas o moderador pode listar denúncias.');
      }
      return state.reports.filter((report) => report.status === 'OPEN');
    },
    async resolve(reportId, action) {
      await latency();
      const viewer = currentUser();
      if (!viewer) {
        throw new ApiError('UNAUTHENTICATED', 'Sessão necessária.');
      }
      if (viewer.role !== 'MODERATOR') {
        throw new ApiError('FORBIDDEN', 'Apenas o moderador pode tratar denúncias.');
      }
      const report = state.reports.find((item) => item.id === reportId);
      if (!report) {
        throw new ApiError('NOT_FOUND', 'Denúncia não encontrada.');
      }
      if (action === 'DISMISS') {
        report.status = 'DISMISSED';
      } else {
        report.status = 'CONTENT_HIDDEN';
        const post = state.posts.find((item) => item.id === report.postId);
        if (post) {
          post.hidden = true;
        }
      }
      persist();
      return report;
    },
  };

  const api: Api = {
    auth,
    posts: postsApi,
    comments: commentsApi,
    claims: claimsApi,
    reports: reportsApi,
  };

  const demoControls: DemoControls = {
    listUsers: () => state.users,
    switchUser: (userId) => {
      const user = findUser(state, userId);
      if (!user) {
        throw new ApiError('NOT_FOUND', 'Usuário não encontrado.');
      }
      state.sessionUserId = user.id;
      persist();
    },
    reset: () => {
      state = createInitialState();
      persist();
    },
  };

  const adapter: MockAdapter = {
    ...api,
    ...demoControls,
  };

  return adapter;
}
