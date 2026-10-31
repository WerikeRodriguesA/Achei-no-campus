import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import type { CustodyLocation } from '../../domain/types';

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

  const inputClass = 'w-full rounded border border-slate-300 px-3 py-2 text-sm';

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h2 className="mb-4 text-xl font-bold">Criar publicação</h2>
      <form
        className="space-y-4 rounded border border-slate-200 bg-white p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="kind">
            Tipo
          </label>
          <select
            id="kind"
            className={inputClass}
            value={kindValue}
            onChange={(event) => setValue('kind', event.target.value as 'LOST' | 'FOUND')}
          >
            <option value="LOST">Perdido</option>
            <option value="FOUND">Achado</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="title">
            Título
          </label>
          <input id="title" className={inputClass} type="text" {...register('title')} />
          {errors.title ? (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="description">
            Descrição
          </label>
          <textarea
            id="description"
            className={`${inputClass} min-h-24`}
            {...register('description')}
          />
          {errors.description ? (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="locationId">
            Local
          </label>
          <select id="locationId" className={inputClass} {...register('locationId')}>
            <option value="">Selecione…</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {errors.locationId ? (
            <p className="mt-1 text-sm text-red-600">{errors.locationId.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="approxDate">
            Data aproximada
          </label>
          <input id="approxDate" className={inputClass} type="date" {...register('approxDate')} />
          {errors.approxDate ? (
            <p className="mt-1 text-sm text-red-600">{errors.approxDate.message}</p>
          ) : null}
        </div>

        {kindValue === 'FOUND' ? (
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="custody">
              Local de guarda (obrigatório em achados)
            </label>
            <select
              id="custody"
              className={inputClass}
              value={custodyValue ?? ''}
              onChange={(event) =>
                setValue(
                  'custody',
                  (event.target.value || undefined) as CustodyLocation | undefined,
                )
              }
            >
              <option value="">Selecione…</option>
              <option value="GUARITA">Garricha</option>
              <option value="DISCIPLINA">Disciplina</option>
            </select>
            {errors.custody ? (
              <p className="mt-1 text-sm text-red-600">{errors.custody.message}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="photos">
            Fotos (até 3)
          </label>
          <input
            id="photos"
            className={inputClass}
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setValue('photos', files.slice(0, 3));
            }}
          />
          {errors.photos ? (
            <p className="mt-1 text-sm text-red-600">{errors.photos.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          disabled={false}
        >
          Publicar
        </button>
      </form>
    </div>
  );
}
