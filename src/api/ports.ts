import type {
  ClaimView,
  CommentView,
  CustodyLocation,
  Location,
  PostKind,
  PostStatus,
  PostView,
  Resolution,
  User,
} from '../domain/types';

export type { Location, PostView, CommentView, ClaimView } from '../domain/types';

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ListPostsParams {
  kind?: PostKind;
  status?: PostStatus;
  locationId?: string;
  q?: string;
  mine?: boolean;
  cursor?: string;
}

export interface CreatePostInput {
  kind: PostKind;
  title: string;
  description: string;
  locationId: string;
  approxDate: string;
  custody?: CustodyLocation;
  photos?: File[];
}

export type UpdatePostInput = Partial<Omit<CreatePostInput, 'kind' | 'photos'>>;

export interface PostsApi {
  list(p: ListPostsParams): Promise<Page<PostView>>;
  get(id: string): Promise<PostView>;
  create(i: CreatePostInput): Promise<PostView>;
  update(id: string, i: UpdatePostInput): Promise<PostView>;
  remove(id: string): Promise<void>;
  transition(id: string, to: PostStatus, resolution?: Resolution): Promise<PostView>;
  locations(): Promise<Location[]>;
}

export interface CommentsApi {
  list(postId: string): Promise<CommentView[]>;
  add(postId: string, text: string): Promise<CommentView>;
  remove(commentId: string): Promise<void>;
}

export interface ClaimsApi {
  request(postId: string, message: string): Promise<ClaimView>;
  listForPost(postId: string): Promise<ClaimView[]>; // só o que o usuário pode ver (P6)
  decide(claimId: string, decision: 'ACCEPT' | 'REJECT'): Promise<ClaimView>;
  withdraw(claimId: string): Promise<void>;
}

export interface ReportsApi {
  create(postId: string, reason: string): Promise<import('../domain/types').Report>;
  listOpen(): Promise<import('../domain/types').Report[]>;
  resolve(
    reportId: string,
    action: 'DISMISS' | 'HIDE_CONTENT',
  ): Promise<import('../domain/types').Report>;
}

export type LoginMethod = 'INSTITUTIONAL_EMAIL' | 'MATRICULA';

export interface LoginInput {
  method: LoginMethod;
  identifier: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  displayName: string;
}

export interface AuthApi {
  login(i: LoginInput): Promise<User>;
  register(i: RegisterInput): Promise<User>;
  me(): Promise<User | null>;
  logout(): Promise<void>;
}

export interface Api {
  auth: AuthApi;
  posts: PostsApi;
  comments: CommentsApi;
  claims: ClaimsApi;
  reports: ReportsApi;
}

// só no modo mock; exposto por api/index.ts como `demo` (null no modo http)
export interface DemoControls {
  listUsers(): User[];
  switchUser(userId: string): void;
  reset(): void;
}
