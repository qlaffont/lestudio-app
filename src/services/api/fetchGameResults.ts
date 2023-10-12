export const fetchGameResults = async (inputValue: string, token: string) => {
  if (!token || inputValue?.length === 0) {
    return [];
  }

  const res = await fetch(`https://api.lestudio.qlaffont.com/twitch/games?search=${inputValue}&token=${token}`, {
    cache: 'reload',
  });

  const games = (await res.json()).data.getTwitchGames;
  return games?.map((v) => ({ value: v.id, label: v.name, disabled: false }));
};
