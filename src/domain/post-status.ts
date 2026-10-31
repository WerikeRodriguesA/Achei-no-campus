import type { Post, PostStatus, Resolution, User } from './types';

export type TransitionCheck =
  { ok: true } | { ok: false; code: 'FORBIDDEN' | 'INVALID_TRANSITION' | 'VALIDATION' };

/**
 * Regras de transição de estado do protótipo (P5, §8).
 *
 * - OPEN -> IN_PROGRESS: ação do autor, ao aceitar uma reivindicação.
 * - IN_PROGRESS -> OPEN: ação do autor, quando a reivindicação não se confirma.
 * - OPEN | IN_PROGRESS -> RESOLVED: ação do autor, com desfecho obrigatório (Resolution).
 * - RESOLVED -> OPEN: ação do moderador, caso excepcional.
 *
 * No sistema real o servidor é quem decide; a UI apenas reflete o resultado.
 */
export function checkTransition(
  post: Post,
  to: PostStatus,
  actor: User,
  resolution?: Resolution,
): TransitionCheck {
  if (to === 'RESOLVED') {
    if (!resolution) {
      return { ok: false, code: 'VALIDATION' };
    }
  }

  if (post.status === 'OPEN') {
    if (to === 'IN_PROGRESS') {
      if (actor.id !== post.authorId) {
        return { ok: false, code: 'FORBIDDEN' };
      }
      return { ok: true };
    }
    if (to === 'RESOLVED') {
      if (actor.id !== post.authorId) {
        return { ok: false, code: 'FORBIDDEN' };
      }
      if (!resolution) {
        return { ok: false, code: 'VALIDATION' };
      }
      return { ok: true };
    }
  }

  if (post.status === 'IN_PROGRESS') {
    if (to === 'OPEN') {
      if (actor.id !== post.authorId) {
        return { ok: false, code: 'FORBIDDEN' };
      }
      return { ok: true };
    }
    if (to === 'RESOLVED') {
      if (actor.id !== post.authorId) {
        return { ok: false, code: 'FORBIDDEN' };
      }
      if (!resolution) {
        return { ok: false, code: 'VALIDATION' };
      }
      return { ok: true };
    }
  }

  if (post.status === 'RESOLVED') {
    if (to === 'OPEN') {
      if (actor.role !== 'MODERATOR') {
        return { ok: false, code: 'FORBIDDEN' };
      }
      return { ok: true };
    }
  }

  return { ok: false, code: 'INVALID_TRANSITION' };
}
