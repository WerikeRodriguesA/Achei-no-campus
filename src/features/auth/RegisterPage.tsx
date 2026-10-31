import { useNavigate } from 'react-router';
import { Button, Card, CardContent, FullState, PageHeader } from '../../shared/ui';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md p-8">
      <PageHeader title="Cadastrar" subtitle="Cadastro não disponível no protótipo" backUrl="/login" />

      <Card variant="default" padding="md">
        <CardContent className="space-y-4 text-center">
          <FullState
            variant="empty"
            title="Cadastro não implementado"
            description="Este protótipo usa autenticação simulada. Use a tela de Entrar para selecionar um usuário demo."
          />
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Voltar para Entrar
          </Button>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-slate-500">
        Protótipo v0.1 — autenticação simulada
      </p>
    </div>
  );
}