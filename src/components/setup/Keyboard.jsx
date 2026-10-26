import { memo } from 'react'

// Cada tecla: [id, largura relativa]. Os ids são os mesmos de KEY_IDS_BY_CODE abaixo.
const ROWS = [
  [['`', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['backspace', 2]],
  [['tab', 1.5], ['q', 1], ['w', 1], ['e', 1], ['r', 1], ['t', 1], ['y', 1], ['u', 1], ['i', 1], ['o', 1], ['p', 1], ['[', 1], [']', 1], ['\\', 1.5]],
  [['caps', 1.75], ['a', 1], ['s', 1], ['d', 1], ['f', 1], ['g', 1], ['h', 1], ['j', 1], ['k', 1], ['l', 1], [';', 1], ["'", 1], ['enter', 2.25]],
  [['shiftleft', 2.25], ['z', 1], ['x', 1], ['c', 1], ['v', 1], ['b', 1], ['n', 1], ['m', 1], [',', 1], ['.', 1], ['/', 1], ['shiftright', 2.75]],
  [['ctrlleft', 1.5], ['altleft', 1.5], ['space', 9], ['altright', 1.5], ['ctrlright', 1.5]],
]

function Keyboard({ pressed }) {
  return (
    <div className="setup-keyboard">
      <div className="setup-keyboard-body">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="setup-key-row">
            {row.map(([id, span]) => (
              <span
                key={id}
                className={`setup-key${pressed.has(id) ? ' is-pressed' : ''}`}
                style={{ flexGrow: span }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(Keyboard)
