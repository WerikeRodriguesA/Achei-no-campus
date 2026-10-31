import { createBrowserRouter, type RouteObject } from 'react-router';
import AppLayout from './layout';
import { RequireAuth, RequireModerator } from './guards';
import FeedPage from '../features/feed/FeedPage';
import LoginPage from '../features/auth/LoginPage';
import PostCreatePage from '../features/post-create/PostCreatePage';
import PostDetailPage from '../features/post-detail/PostDetailPage';
import MyPostsPage from '../features/post-create/MyPostsPage';
import ModerationPage from '../features/moderation/ModerationPage';
import RegisterPage from '../features/auth/RegisterPage';
import StyleguidePage from './StyleguidePage';
import NotFoundPage from './NotFoundPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <FeedPage />
          </RequireAuth>
        ),
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <RegisterPage /> },
      {
        path: 'posts/new',
        element: (
          <RequireAuth>
            <PostCreatePage />
          </RequireAuth>
        ),
      },
      {
        path: 'posts/:id',
        element: (
          <RequireAuth>
            <PostDetailPage />
          </RequireAuth>
        ),
      },
      {
        path: 'me',
        element: (
          <RequireAuth>
            <MyPostsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'moderation',
        element: (
          <RequireModerator>
            <ModerationPage />
          </RequireModerator>
        ),
      },
      // Styleguide - apenas em desenvolvimento
      ...(import.meta.env.DEV
        ? [
            {
              path: '_styleguide',
              element: <StyleguidePage />,
            },
          ]
        : []),
      // Catch-all 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
