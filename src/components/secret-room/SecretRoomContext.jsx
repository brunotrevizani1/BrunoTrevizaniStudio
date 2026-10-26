import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { OPEN_SECRET_ROOM } from './events'

// A sala secreta inteira (hub + CSS) só é baixada na primeira vez que alguém a abre.
const loadRoom = () => import('./SecretRoom')
const SecretRoom = lazy(loadRoom)

const SecretRoomContext = createContext(null)

export function SecretRoomProvider({ children }) {
  const [session, setSession] = useState(null)

  const openRoom = useCallback((options = {}) => setSession({ onClosed: options.onClosed, onClosing: options.onClosing }), [])
  const handleClosed = useCallback((nextHref) => {
    setSession((current) => {
      current?.onClosed?.()
      return null
    })
    // clicou num link do cabeçalho dentro da sala: refaz o clique na página, já sem a sala
    if (nextHref) {
      setTimeout(() => document.querySelector(`header a[href="${nextHref}"]`)?.click(), 300)
    }
  }, [])

  useEffect(() => {
    const open = () => openRoom()
    window.addEventListener(OPEN_SECRET_ROOM, open)
    return () => window.removeEventListener(OPEN_SECRET_ROOM, open)
  }, [openRoom])

  const value = useMemo(() => ({ openRoom, preload: loadRoom, isOpen: session !== null }), [openRoom, session])

  return (
    <SecretRoomContext.Provider value={value}>
      {children}
      {session && (
        <Suspense fallback={null}>
          <SecretRoom onClosing={session.onClosing} onClosed={handleClosed} />
        </Suspense>
      )}
    </SecretRoomContext.Provider>
  )
}

export function useSecretRoom() {
  const context = useContext(SecretRoomContext)
  if (!context) {
    throw new Error('useSecretRoom precisa ser usado dentro de um SecretRoomProvider')
  }
  return context
}
