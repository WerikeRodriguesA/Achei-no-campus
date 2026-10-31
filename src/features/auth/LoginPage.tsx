import { useNavigate, useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { demo } from '../../api';
import { Button, Card, CardContent, FullState, PageHeader } from '../../shared/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = (location.state as { from?: string })?.from ?? '/';

  const handleLogin = async (userId: string) => {
    // In demo mode, we use the userId as the identifier with the demo password
    const user = demo?.listUsers().find(u => u.id === userId);
    if (!user) return;

    await api.auth.login({
      method: 'INSTITUTIONAL_EMAIL',
      identifier: userId, // using userId as identifier in demo
      password: 'demo123', // DEMO_PASSWORD from seed.ts
    });
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    navigate(from, { replace: true });
  };

  const { data: users } = demo
    ? { data: demo.listUsers() }
    : { data: undefined };

  return (
    <div className="mx-auto max-w-md p-8">
      <PageHeader title="Entrar" subtitle="Selecione um usuário para continuar" backUrl="/" backLabel="Voltar" />

      <Card variant="default" padding="md">
        <CardContent className="space-y-4">
          {users?.length ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Modo demo: escolha um usuário</p>
              <ul className="space-y-2" aria-label="Usuários disponíveis">
                {users.map((user) => (
                  <li key={user.id}>
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => void handleLogin(user.id)}
                    >
                      <span className="font-medium">{user.displayName}</span>
                      <span className="ml-2 text-xs text-slate-500 uppercase">{user.role}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <FullState
              variant="empty"
              title="Nenhum usuário disponível"
              description="Configure o modo demo ou crie usuários no banco de dados."
            />
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-slate-500">
        Protótipo v0.1 — autenticação simulada
      </p>
    </div>
  );
}