import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { CustodyLocation } from '../../domain/types';
import { limits } from '../../domain/limits';
import {
  Button,
  Input,
  Textarea,
  Select,
  FormField,
  RadioGroup,
  PageHeader,
  FullState,
} from '../../shared/ui';

const createPostSchema = z.object({
  kind: z.enum(['LOST', 'FOUND'], { message: 'Selecione o tipo da publicação.' }),
  title: z
    .string()
    .min(limits.title.min, `Título deve ter de ${limits.title.min} a ${limits.title.max} caracteres.`)
    .max(limits.title.max, `Título deve ter de ${limits.title.min} a ${limits.title.max} caracteres.`),
  description: z
    .string()
    .min(limits.description.min, `Descrição deve ter de ${limits.description.min} a ${limits.description.max} caracteres.`)
    .max(limits.description.max, `Descrição deve ter de ${limits.description.min} a ${limits.description.max} caracteres.`),
  locationId: z.string().min(1, 'Selecione o local.'),
  approxDate: z
    .string()
    .min(1, 'Informe a data aproximada.')
    .refine((value) => !Number.isNaN(Date.parse(value)) && Date.parse(value) <= Date.now(), {
      message: 'Data aproximada não pode ser futura.',
    }),
  custody: z.enum(['GUARITA', 'DISCIPLINA']).optional(),
  photos: z.array(z.instanceof(File)).max(limits.photos.max, `É permitido até ${limits.photos.max} fotos.`).optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

export default function PostCreatePage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => api.posts.locations(),
  });
  const locations = locationsData ?? [];

  // Fetch existing post when editing
  const { data: existingPost, isLoading, error } = useQuery({
    queryKey: ['posts', 'detail', id],
    queryFn: () => api.posts.get(id as string),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      kind: 'FOUND',
      title: '',
      description: '',
      locationId: '',
      approxDate: '',
      custody: undefined,
      photos: [],
    },
  });

  const kindValue = watch('kind');
  const custodyValue = watch('custody');

  // Populate form when editing
  if (isEditing && existingPost && !isLoading) {
    reset({
      kind: existingPost.kind,
      title: existingPost.title,
      description: existingPost.description,
      locationId: existingPost.locationId,
      approxDate: existingPost.approxDate.split('T')[0], // Convert ISO to date input format
      custody: existingPost.custody,
      photos: [],
    });
  }

  const onSubmit = async (values: CreatePostForm) => {
    if (isEditing && id) {
      await api.posts.update(id, {
        title: values.title,
        description: values.description,
        locationId: values.locationId,
        approxDate: values.approxDate,
        custody: values.kind === 'FOUND' ? values.custody : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'detail', id] });
      navigate(`/posts/${id}`);
    } else {
      const post = await api.posts.create({
        kind: values.kind,
        title: values.title,
        description: values.description,
        locationId: values.locationId,
        approxDate: values.approxDate,
        custody: values.kind === 'FOUND' ? values.custody : undefined,
        photos: values.photos?.length ? values.photos : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate(`/posts/${post.id}`);
    }
  };

  if (isEditing && isLoading) {
    return <FullState variant="loading" title="Carregando publicação..." />;
  }
  if (isEditing && error) {
    return <FullState variant="error" title="Erro ao carregar" onRetry={() => window.location.reload()} />;
  }
  if (isEditing && !existingPost) {
    return <FullState variant="not-found" />;
  }

  const pageTitle = isEditing ? 'Editar publicação' : 'Nova publicação';
  const pageSubtitle = isEditing
    ? 'Atualize os dados do objeto'
    : 'Cadastre um objeto perdido ou achado';
  const submitButtonText = isEditing ? 'Atualizar' : 'Publicar';

  return (
    <div className="mx-auto max-w-5xl p-4">
      <PageHeader title={pageTitle} subtitle={pageSubtitle} backUrl="/" />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormField id="create-kind" label="Tipo" hint="Selecione se o item foi perdido ou achado">
          <RadioGroup
            id="create-kind"
            name="kind"
            value={kindValue}
            onChange={(value) => setValue('kind', value as 'LOST' | 'FOUND')}
            variant="segmented"
            options={[
              { value: 'LOST', label: 'Perdido' },
              { value: 'FOUND', label: 'Achado' },
            ]}
          />
        </FormField>

        <FormField
          id="create-title"
          label="Título"
          hint={`De ${limits.title.min} a ${limits.title.max} caracteres`}
          error={errors.title?.message}
        >
          <Input
            id="create-title"
            {...register('title')}
            placeholder="Ex: Chaves do carro com chaveiro azul"
          />
        </FormField>

        <FormField
          id="create-description"
          label="Descrição"
          hint={`De ${limits.description.min} a ${limits.description.max} caracteres — descreva detalhes, cor, marca, estado`}
          error={errors.description?.message}
        >
          <Textarea
            id="create-description"
            {...register('description')}
            placeholder="Descreva o objeto com o máximo de detalhes possível..."
            maxLength={limits.description.max}
            showCounter
            rows={5}
          />
        </FormField>

        <FormField
          id="create-location"
          label="Local"
          error={errors.locationId?.message}
        >
          <Select
            id="create-location"
            {...register('locationId')}
            placeholder="Selecione o local"
            options={locations.map((loc) => ({ value: loc.id, label: loc.name }))}
          />
        </FormField>

        <FormField
          id="create-approx-date"
          label="Data aproximada"
          hint="Quando o item foi perdido ou encontrado"
          error={errors.approxDate?.message}
        >
          <Input
            id="create-approx-date"
            type="date"
            {...register('approxDate')}
            max={new Date().toISOString().split('T')[0]}
          />
        </FormField>

        {kindValue === 'FOUND' && (
          <FormField
            id="create-custody"
            label="Local de guarda"
            hint="Obrigatório para itens achados — onde o item está guardado"
            error={errors.custody?.message}
          >
            <Select
              id="create-custody"
              value={custodyValue ?? ''}
              onChange={(e) =>
                setValue(
                  'custody',
                  (e.target.value || undefined) as CustodyLocation | undefined,
                )
              }
              placeholder="Selecione o local de guarda"
              options={[
                { value: '', label: 'Selecione…' },
                { value: 'GUARITA', label: 'Guarita' },
                { value: 'DISCIPLINA', label: 'Disciplina' },
              ]}
            />
          </FormField>
        )}

        <FormField id="create-photos" label="Fotos (até 3)" hint={`Adicione fotos do objeto para facilitar a identificação (máx. ${limits.photos.max})`}>
          <Input
            id="create-photos"
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setValue('photos', files.slice(0, limits.photos.max));
            }}
          />
          {errors.photos && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.photos.message}</p>
          )}
        </FormField>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button type="submit" size="lg">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}