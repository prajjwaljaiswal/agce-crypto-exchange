import type { ReactNode } from 'react';

export interface SocketContextValue {
  getSocket: () => import('socket.io-client').Socket | null;
  isConnected: boolean;
}

export declare const SocketContext: import('react').Context<SocketContextValue>;

export declare function SocketProvider(props: { children: ReactNode }): JSX.Element;

export declare function useSocket(): SocketContextValue;
