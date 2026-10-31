import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { FullState } from '../shared/ui';

function useCurrentUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.auth.me(),
  });
  return { user, isLoading };
}

interface RequireAuthProps {
  children: ReactElement;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <FullState variant="loading" title="Verificando autenticação..." />;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

interface RequireModeratorProps {
  children: ReactElement;
}

export function RequireModerator({ children }: RequireModeratorProps) {
  const { user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <FullState variant="loading" title="Verificando permissões..." />;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user.role !== 'MODERATOR') {
    return <FullState variant="no-permission" />;
  }
  return children;
}