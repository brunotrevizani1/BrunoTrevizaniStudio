import { DoorOpen } from 'lucide-react'
import { useSecretRoom } from './SecretRoomContext'

/** Entrada alternativa para a sala secreta (celular e seção Projetos), sem a estante. */
export default function SecretRoomButton({ className = '' }) {
  const { openRoom, isOpen } = useSecretRoom()

  return (
    <button
      type="button"
      onClick={() => openRoom()}
      disabled={isOpen}
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-from to-accent-to px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 ${className}`}
    >
      <DoorOpen size={18} aria-hidden="true" />
      Entrar na sala secreta
    </button>
  )
}
