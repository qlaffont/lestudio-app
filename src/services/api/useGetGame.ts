/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createQuery, CreateQueryOptions } from '@tanstack/solid-query';

import { fetcher } from './fetcher';
import { Accessor } from 'solid-js';

type Return = {
  data: {
    getTwitchGameFromId: {
      id: string;
      name: string;
      box_art_url: string;
    };
  };
};

export const findGetGameByTwitchCategoryIdQuery = (variables?: { gameId: string; token: string }): (() => Return) => {
  return fetcher({
    method: 'GET',
    url: `/twitch/games/${variables.gameId}?token=${encodeURIComponent(variables.token)}`,
  }) as unknown as () => Return;
};

export const useGetGameByTwitchCategoryIdQuery = (
  variables?: Accessor<{
    gameId: string;
    token: string;
  }>,
  options?: CreateQueryOptions<unknown, unknown, Return>,
) =>
  createQuery(
    () => (variables() === undefined ? ['getGameByTwitchCategoryId'] : ['getGameByTwitchCategoryId', variables()]),
    () => findGetGameByTwitchCategoryIdQuery(variables())(),
    options,
  );
