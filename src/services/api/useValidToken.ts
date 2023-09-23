/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CreateMutationOptions, createMutation } from '@tanstack/solid-query';

import { fetcher } from './fetcher';

export const useValidToken = (options?: CreateMutationOptions<unknown, unknown, { token: string }>) =>
  createMutation({
    mutationFn: ({ token }) =>
      fetcher({
        method: 'GET',
        url: `/users/valid?token=${encodeURIComponent(token)}`,
      })(),
    ...options,
  });
