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
      className={`toon-btn ${className}`}
    >
      <DoorOpen size={18} aria-hidden="true" />
      Entrar na sala secreta
    </button>
  )
}
