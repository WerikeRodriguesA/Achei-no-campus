import { createInitialState, type MockState } from './seed';

const STORAGE_KEY = 'achei-no-campus.mock.v1';

export function loadState(): MockState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }
    const parsed = JSON.parse(raw) as Partial<MockState>;
    const base = createInitialState();
    return {
      users: Array.isArray(parsed.users) ? parsed.users : base.users,
      locations: Array.isArray(parsed.locations) ? parsed.locations : base.locations,
      posts: Array.isArray(parsed.posts) ? parsed.posts : base.posts,
      comments: Array.isArray(parsed.comments) ? parsed.comments : base.comments,
      claims: Array.isArray(parsed.claims) ? parsed.claims : base.claims,
      reports: Array.isArray(parsed.reports) ? parsed.reports : base.reports,
      sessionUserId: typeof parsed.sessionUserId === 'string' ? parsed.sessionUserId : null,
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: MockState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // persistência indisponível (modo privado etc.) — segue em memória
  }
}
