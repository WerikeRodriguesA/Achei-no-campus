export type UserRole = 'USER' | 'MODERATOR';

export type PostKind = 'LOST' | 'FOUND';

export type PostStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export type Resolution = 'RETURNED' | 'FOUND_BY_OWNER' | 'GAVE_UP' | 'OTHER';

export type CustodyLocation = 'GUARITA' | 'DISCIPLINA';

export type ClaimStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export type ReportStatus = 'OPEN' | 'DISMISSED' | 'CONTENT_HIDDEN';

export interface User {
  id: string;
  displayName: string;
  role: UserRole;
}

export type PublicUser = Pick<User, 'id' | 'displayName'>;

export interface Post {
  id: string;
  kind: PostKind;
  status: PostStatus;
  resolution?: Resolution;
  title: string;
  description: string;
  photoUrls: string[];
  locationId: string;
  approxDate: string; // ISO
  custody?: CustodyLocation; // só FOUND
  authorId: string;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  postId: string;
  claimantId: string;
  message: string;
  status: ClaimStatus;
  createdAt: string;
}

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  status: ReportStatus;
}

export interface Location {
  id: string;
  name: string;
}

// visões com autor embutido (evita N+1; o backend real fará o mesmo) — P17
export type PostView = Post & { author: PublicUser };
export type CommentView = Comment & { author: PublicUser };
export type ClaimView = ClaimRequest & { claimant: PublicUser };
