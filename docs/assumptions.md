# Premissas provisórias (P1 a P17)

Este documento registra as premissas provisórias (P1 a P17) da arquitetura v0.1. Elas não são
decisões do Werike; servem de base para o protótipo e devem ser revisadas.

## Premissas

- **P1**: A guarda do objeto só existe em publicações do tipo FOUND e só aceita
  `GUARITA` ou `DISCIPLINA`. Custody obrigatório em FOUND e proibido em LOST.
- **P2**: `kind` é imutável após a criação.
- **P3**: Reivindicação só em FOUND com status OPEN; em LOST, a colaboração é por comentários
  públicos (pistas).
- **P4**: O autor não reivindica a própria publicação; no máximo uma reivindicação PENDING por
  usuário por publicação.
- **P5**: Aceitar (só com a publicação OPEN): claim ACCEPTED e post IN_PROGRESS; as demais
  PENDING ficam PENDING e não podem ser decididas enquanto IN_PROGRESS. IN_PROGRESS → OPEN:
  a ACCEPTED vira REJECTED. Ao RESOLVED, todas as PENDING viram REJECTED.
- **P6**: Visibilidade: o autor da publicação vê todas as reivindicações dela; o solicitante
  vê só a sua; o moderador não vê.
- **P7**: Edição só se status ≠ RESOLVED e sem alterar fotos; exclusão pelo autor em qualquer
  estado, em cascata (comentários, reivindicações, denúncias).
- **P8**: Comentários: qualquer autenticado comenta enquanto a publicação não estiver RESOLVED
  nem oculta; remove o autor do comentário ou o moderador.
- **P9**: Publicação hidden: visível só ao autor (com aviso) e aos moderadores; para os demais,
  NOT_FOUND.
- **P10**: Feed: 10 itens por página, createdAt decrescente; busca `q` sem diferenciar caixa nem
  acentos, em título e descrição.
- **P11**: Limites: título 3 a 80; descrição 10 a 1000; até 3 fotos; data aproximada não futura;
  comentário 1 a 500; mensagem de reivindicação 10 a 500; motivo de denúncia 5 a 300.
- **P12**: Persistência do mock no localStorage com botão de restaurar (proposta do v0.1).
- **P13**: npm e Node LTS atual.
- **P14**: Composição do seed conforme a seção 10 do prompt.
- **P15**: Login de demonstração: qualquer método resolve para os usuários do seed, senha
  `demo123`.
- **P16**: Uma denúncia por usuário por publicação. HIDE_CONTENT coloca `hidden = true` e a
  denúncia vira CONTENT_HIDDEN; DISMISS vira DISMISSED.
- **P17**: As portas retornam `PostView`, `CommentView` e `ClaimView` com o autor embutido.

## Premissas novas

- Nenhuma nova premissa registrada até a resolução de ambiguidades durante o desenvolvimento.

## Decisões registradas

- A decisão de hospedagem do protótipo permanece pendente (ver issue de meta).
- A lista real de locais do campus permanece pendente (ver issue de meta).
