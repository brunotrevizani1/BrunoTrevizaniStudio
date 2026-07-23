import { createContext, useContext, useState } from 'react'

const LampContext = createContext(null)

export function LampProvider({ children }) {
  const [isOn, setIsOn] = useState(true)
  const toggleLamp = () => setIsOn((value) => !value)

  return (
    <LampContext.Provider value={{ isOn, toggleLamp }}>
      {children}
    </LampContext.Provider>
  )
}

export function useLamp() {
  const context = useContext(LampContext)
  if (!context) {
    throw new Error('useLamp precisa ser usado dentro de um LampProvider')
  }
  return context
}
