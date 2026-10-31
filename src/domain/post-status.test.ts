import { describe, expect, it } from 'vitest';
import { checkTransition } from './post-status';
import type { Post, PostStatus, Resolution, User } from './types';

describe('checkTransition', () => {
  const author: User = { id: 'u-author', displayName: 'Marina', role: 'USER' };
  const moderator: User = { id: 'u-mod', displayName: 'Moderação', role: 'MODERATOR' };
  const other: User = { id: 'u-other', displayName: 'Rafael', role: 'USER' };

  const basePost: Post = {
    id: 'p1',
    kind: 'LOST',
    status: 'OPEN',
    title: 'Mochila azul',
    description: 'Perdi minha mochila.',
    photoUrls: [],
    locationId: 'loc-guarita',
    approxDate: '2026-10-01T00:00:00.000Z',
    authorId: author.id,
    hidden: false,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  };

  const inProgressPost: Post = { ...basePost, status: 'IN_PROGRESS' };
  const resolvedPost: Post = { ...basePost, status: 'RESOLVED', resolution: 'RETURNED' };

  interface Case {
    post: Post;
    to: PostStatus;
    actor: User;
    resolution?: Resolution;
    expected: { ok: true } | { ok: false; code: 'FORBIDDEN' | 'INVALID_TRANSITION' | 'VALIDATION' };
  }

  const cases: Case[] = [
    // OPEN -> IN_PROGRESS: autor aceita reivindicação
    { post: basePost, to: 'IN_PROGRESS', actor: author, expected: { ok: true } },
    {
      post: basePost,
      to: 'IN_PROGRESS',
      actor: moderator,
      expected: { ok: false, code: 'FORBIDDEN' },
    },
    { post: basePost, to: 'IN_PROGRESS', actor: other, expected: { ok: false, code: 'FORBIDDEN' } },

    // IN_PROGRESS -> OPEN: autor, quando reivindicação não se confirma
    { post: inProgressPost, to: 'OPEN', actor: author, expected: { ok: true } },
    { post: inProgressPost, to: 'OPEN', actor: other, expected: { ok: false, code: 'FORBIDDEN' } },

    // OPEN -> RESOLVED e IN_PROGRESS -> RESOLVED: autor com desfecho obrigatório
    {
      post: basePost,
      to: 'RESOLVED',
      actor: author,
      resolution: 'RETURNED',
      expected: { ok: true },
    },
    { post: basePost, to: 'RESOLVED', actor: author, expected: { ok: false, code: 'VALIDATION' } },
    {
      post: inProgressPost,
      to: 'RESOLVED',
      actor: author,
      expected: { ok: false, code: 'VALIDATION' },
    },
    {
      post: inProgressPost,
      to: 'RESOLVED',
      actor: author,
      resolution: 'GAVE_UP',
      expected: { ok: true },
    },

    // RESOLVED -> OPEN: apenas moderador (caso excepcional)
    { post: resolvedPost, to: 'OPEN', actor: moderator, expected: { ok: true } },
    { post: resolvedPost, to: 'OPEN', actor: author, expected: { ok: false, code: 'FORBIDDEN' } },

    // combinações inválidas
    {
      post: basePost,
      to: 'OPEN',
      actor: author,
      expected: { ok: false, code: 'INVALID_TRANSITION' },
    },
    {
      post: resolvedPost,
      to: 'RESOLVED',
      actor: moderator,
      resolution: 'OTHER',
      expected: { ok: false, code: 'INVALID_TRANSITION' },
    },
    {
      post: resolvedPost,
      to: 'IN_PROGRESS',
      actor: author,
      expected: { ok: false, code: 'INVALID_TRANSITION' },
    },
  ];

  it.each(cases)('estado %s -> %s com actor %s', (c: Case) => {
    expect(checkTransition(c.post, c.to, c.actor, c.resolution)).toEqual(c.expected);
  });
});
