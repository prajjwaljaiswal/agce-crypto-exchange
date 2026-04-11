import { useCallback, useEffect, useRef, useState } from 'react'

type WSStatus = 'connecting' | 'open' | 'closed' | 'error'

interface UseWebSocketOptions {
  onMessage?: (event: MessageEvent) => void
  onOpen?: () => void
  onClose?: () => void
  reconnectDelay?: number
  maxReconnects?: number
}

interface UseWebSocketReturn {
  status: WSStatus
  send: (data: string | ArrayBuffer | Blob) => void
  disconnect: () => void
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { onMessage, onOpen, onClose, reconnectDelay = 3000, maxReconnects = 5 } = options
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCount = useRef(0)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [status, setStatus] = useState<WSStatus>('connecting')

  const connect = useCallback(() => {
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      reconnectCount.current = 0
      setStatus('open')
      onOpen?.()
    }

    ws.onmessage = (event) => {
      onMessage?.(event)
    }

    ws.onclose = () => {
      setStatus('closed')
      onClose?.()
      if (reconnectCount.current < maxReconnects) {
        reconnectCount.current += 1
        reconnectTimer.current = setTimeout(connect, reconnectDelay)
      }
    }

    ws.onerror = () => {
      setStatus('error')
      ws.close()
    }
  }, [url, onMessage, onOpen, onClose, reconnectDelay, maxReconnects])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  const send = useCallback((data: string | ArrayBuffer | Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
    reconnectCount.current = maxReconnects // prevent reconnect
    wsRef.current?.close()
  }, [maxReconnects])

  return { status, send, disconnect }
}
