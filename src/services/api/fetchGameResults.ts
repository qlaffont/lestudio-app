import { API_BASE } from '../env';

export const fetchGameResults = async (inputValue: string, token: string) => {
  if (!token || inputValue?.length === 0) {
    return [];
  }

  const url = new URL(`/twitch/games`, API_BASE);
  url.searchParams.append('search', inputValue);
  url.searchParams.append('token', token);

  const res = await fetch(url.toString(), {
    cache: 'reload',
  });

  const games = (await res.json()).data.getTwitchGames;
  return games?.map((v) => ({ value: v.id, label: v.name, disabled: false }));
};
