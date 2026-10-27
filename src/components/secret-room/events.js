// Evento global para abrir a sala secreta de qualquer lugar (ex.: links #projetos sem a estante, no celular).
export const OPEN_SECRET_ROOM = 'open-secret-room'

// Rolar para baixo no corredor fecha a sala e segue para a próxima aba: a estante dispara este evento
// quando termina de fechar, e o useFullPageScroll devolve a câmera à mesa e segue.
export const SECRET_ROOM_CONTINUE = 'secret-room-continue'
// valor que o SecretRoom passa em onClosed (no lugar de um href) para pedir esse "continuar"
export const CONTINUE_DOWN = '>continue'
