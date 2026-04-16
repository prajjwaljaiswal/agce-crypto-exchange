import { createElement, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../providers/AuthProvider.js';
import { tokenStore } from '../../lib/tokenStore.js';

/**
 * Extract origin from a URL string, stripping any pathname.
 * Handles the case where VITE_MARKET_DATA_URL was accidentally set to the full
 * socket.io endpoint (e.g. http://host:8080/market-data/socket.io/) instead of
 * just the base origin (http://host:8080).
 */
function extractOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

const RAW_URL  = import.meta.env.VITE_MARKET_DATA_URL  || 'http://localhost:8080';
const MARKET_DATA_URL  = extractOrigin(RAW_URL);
const MARKET_DATA_PATH = import.meta.env.VITE_MARKET_DATA_PATH || '/market-data/socket.io/';

export const SocketContext = createContext({
  getSocket: () => null,
  isConnected: false,
});

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, status } = useAuth();

  useEffect(() => {
    // Wait until auth status resolves before opening the socket.
    if (status === 'loading') return undefined;

    // market-data-service REFUSES unauthenticated Socket.IO connections
    // (server-side middleware). Guests get nothing live — REST seed still
    // works, but we don't even open the socket to avoid noisy 401 loops.
    if (!isAuthenticated) {
      console.log('[SocketProvider] Guest — skipping socket connection (server requires auth).');
      return undefined;
    }

    const token = tokenStore.getAccess();
    if (!token) {
      console.warn('[SocketProvider] Authenticated but no access token in storage — cannot open socket.');
      return undefined;
    }

    const opts = {
      path: MARKET_DATA_PATH,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      auth: { token },
    };

    console.log('[SocketProvider] Connecting to', MARKET_DATA_URL, 'path:', MARKET_DATA_PATH);

    const socket = io(MARKET_DATA_URL, opts);

    socket.on('connect', () => {
      console.log('[SocketProvider] Connected. id:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[SocketProvider] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      // Most common: UNAUTHORIZED (invalid/expired token) or gateway/path misconfig.
      console.warn('[SocketProvider] connect_error:', err.message, err.data || '');
    });

    socketRef.current = socket;

    return () => {
      console.log('[SocketProvider] Cleaning up socket');
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, status]);

  // Stable reference — never changes, always returns current socket
  const getSocket = useCallback(() => socketRef.current, []);

  const value = useMemo(
    () => ({ getSocket, isConnected }),
    [getSocket, isConnected]
  );

  return createElement(SocketContext.Provider, { value }, children);
}

export function useSocket() {
  return useContext(SocketContext);
}
