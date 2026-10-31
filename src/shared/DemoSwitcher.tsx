import { useQuery, useQueryClient } from '@tanstack/react-query';
import { demo } from '../api';

const demoEnabled = (import.meta.env.VITE_DEMO_MODE ?? 'true') !== 'false';

export function DemoSwitcher() {
  const queryClient = useQueryClient();
  const controls = demo;
  const enabled = demoEnabled && controls !== null;

  const { data: users } = useQuery({
    queryKey: ['demo', 'users'],
    queryFn: () => (controls ? controls.listUsers() : []),
    enabled,
  });

  if (!controls) {
    return null;
  }

  const handleSwitch = (userId: string) => {
    controls.switchUser(userId);
    void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">Trocar usuário (demo)</span>
      <select
        aria-label="Trocar usuário (demo)"
        className="rounded border border-slate-300 px-2 py-1 text-sm"
        value=""
        onChange={(event) => {
          const userId = event.target.value;
          if (userId) {
            handleSwitch(userId);
          }
        }}
      >
        <option value="" disabled>
          Selecionar…
        </option>
        {users?.map((user) => (
          <option key={user.id} value={user.id}>
            {user.displayName}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => controls.reset()}
        className="rounded border border-slate-300 px-2 py-1 text-xs"
      >
        Restaurar dados
      </button>
    </div>
  );
}
