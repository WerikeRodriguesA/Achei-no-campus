import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import type { CustodyLocation } from '../../domain/types';
import {
  Button,
  Input,
  Textarea,
  Select,
  FormField,
  RadioGroup,
  PageHeader,
} from '../../shared/ui';

const createPostSchema = z.object({
  kind: z.enum(['LOST', 'FOUND'], { message: 'Selecione o tipo da publicação.' }),
  title: z
    .string()
    .min(3, 'Título deve ter de 3 a 80 caracteres.')
    .max(80, 'Título deve ter de 3 a 80 caracteres.'),
  description: z
    .string()
    .min(10, 'Descrição deve ter de 10 a 1000 caracteres.')
    .max(1000, 'Descrição deve ter de 10 a 1000 caracteres.'),
  locationId: z.string().min(1, 'Selecione o local.'),
  approxDate: z
    .string()
    .min(1, 'Informe a data aproximada.')
    .refine((value) => !Number.isNaN(Date.parse(value)) && Date.parse(value) <= Date.now(), {
      message: 'Data aproximada não pode ser futura.',
    }),
  custody: z.enum(['GUARITA', 'DISCIPLINA']).optional(),
  photos: z.array(z.instanceof(File)).max(3, 'É permitido até 3 fotos.').optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

export default function PostCreatePage() {
  const navigate = useNavigate();
  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => api.posts.locations(),
  });
  const locations = locationsData ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const onSubmit = async (values: CreatePostForm) => {
    const post = await api.posts.create({
      kind: values.kind,
      title: values.title,
      description: values.description,
      locationId: values.locationId,
      approxDate: values.approxDate,
      custody: values.kind === 'FOUND' ? values.custody : undefined,
      photos: values.photos?.length ? values.photos : undefined,
    });
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <PageHeader title="Criar publicação" subtitle="Preencha os dados do objeto perdido ou achado" backUrl="/" />

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
          hint="De 3 a 80 caracteres"
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
          hint="De 10 a 1000 caracteres — descreva detalhes, cor, marca, estado"
          error={errors.description?.message}
        >
          <Textarea
            id="create-description"
            {...register('description')}
            placeholder="Descreva o objeto com o máximo de detalhes possível..."
            maxLength={1000}
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

        <FormField id="create-photos" label="Fotos (até 3)" hint="Adicione fotos do objeto para facilitar a identificação">
          <Input
            id="create-photos"
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setValue('photos', files.slice(0, 3));
            }}
          />
          {errors.photos && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.photos.message}</p>
          )}
        </FormField>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button type="submit" size="lg">
            Publicar
          </Button>
        </div>
      </form>
    </div>
  );
}