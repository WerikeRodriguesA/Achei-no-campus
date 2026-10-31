import { Link } from 'react-router';
import { Button, FullState, PageHeader } from '../shared/ui';
import { HomeIcon, ChevronLeftIcon } from '../shared/ui/icons';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <PageHeader title="Página não encontrada" subtitle="O endereço acessado não existe" />
      <FullState
        variant="not-found"
        title="404 — Página não encontrada"
        description="Desculpe, não conseguimos encontrar a página que você procura. Ela pode ter sido movida ou não existir."
        action={{ label: 'Voltar ao feed', onClick: () => window.location.href = '/' }}
      />
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/">
          <Button variant="secondary">
            <ChevronLeftIcon size={18} className="mr-1" />
            Início
          </Button>
        </Link>
        <Link to="/posts/new">
          <Button>
            <HomeIcon size={18} className="mr-1" />
            Nova publicação
          </Button>
        </Link>
      </div>
    </div>
  );
}