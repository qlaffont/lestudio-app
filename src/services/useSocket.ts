/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Manager, Socket } from 'socket.io-client';
import { createEffect, createSignal } from 'solid-js';
import { API_BASE } from './env';

export const useSocket = () => {
  const [socket, setSocket] = createSignal<Socket | undefined>();
  const [manager, setManager] = createSignal<Manager>();

  createEffect(() => {
    const manager: Manager = new Manager(API_BASE, {
      reconnectionDelayMax: 500,
      reconnectionDelay: 500,
      transports: ['websocket'],
    });

    const newSocket = manager.socket('/', {});

    setManager(manager);

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  });

  return { socket: socket, manager };
};
