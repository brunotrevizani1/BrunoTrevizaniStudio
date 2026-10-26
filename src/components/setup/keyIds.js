// Converte um KeyboardEvent no id da tecla desenhada em Keyboard.jsx.
const SPECIAL_CODES = {
  Backquote: '`',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/',
  Space: 'space',
  Enter: 'enter',
  NumpadEnter: 'enter',
  Backspace: 'backspace',
  Tab: 'tab',
  CapsLock: 'caps',
  ShiftLeft: 'shiftleft',
  ShiftRight: 'shiftright',
  ControlLeft: 'ctrlleft',
  ControlRight: 'ctrlright',
  AltLeft: 'altleft',
  AltRight: 'altright',
}

/** Converte um KeyboardEvent no id da tecla desenhada (ou null se não existir no desenho). */
export function keyIdFromEvent(event) {
  const { code } = event
  if (SPECIAL_CODES[code]) return SPECIAL_CODES[code]
  if (code.startsWith('Key')) return code.slice(3).toLowerCase()
  if (code.startsWith('Digit')) return code.slice(5)
  return null
}

