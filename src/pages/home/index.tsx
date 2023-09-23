import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { getConfig } from '../../tauri';

export const Home = () => {
  const navigate = useNavigate();

  onMount(() => {
    (async () => {
      const config = await getConfig();

      if (config.token && config?.token?.length > 0) {
        navigate('/music');
      } else {
        navigate('/settings');
      }
    })();
  });

  return <div class="text-white" />;
};
