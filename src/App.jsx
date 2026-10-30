import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import BackToTop from './components/BackToTop'
import Timeline from './components/Timeline'
import PrivateRepo from './components/PrivateRepo'
import UnderConstruction from './components/UnderConstruction'
import { PRIVATE_REPO_ROUTE, UNDER_CONSTRUCTION_ROUTE } from './data/placeholders'
import { LampProvider } from './context/LampContext'
import { ResumeProject, SecretRoomProvider } from './components/secret-room/SecretRoomContext'
import { ThemeProvider } from './context/ThemeContext'
import { useFullPageScroll } from './hooks/useFullPageScroll'
import { usePausedOffscreen } from './hooks/usePausedOffscreen'

// Só a página principal tem abas; as telas /codigo-privado e /em-construcao rolam normalmente.
function FullPageScroll() {
  useFullPageScroll()
  usePausedOffscreen()
  return null
}

function App() {
  const pathname = window.location.pathname.replace(/\/$/, '')
  const isPrivateRepo = pathname === PRIVATE_REPO_ROUTE
  const isUnderConstruction = pathname === UNDER_CONSTRUCTION_ROUTE

  return (
    <ThemeProvider>
      <LampProvider>
        <SecretRoomProvider>
        {isPrivateRepo ? (
          <PrivateRepo />
        ) : isUnderConstruction ? (
          <UnderConstruction />
        ) : (
          <>
            <FullPageScroll />
            <ResumeProject />
            <main>
              <Hero />
              <About />
              <Contact />
            </main>
            <Timeline />
            <BackToTop />
          </>
        )}
        </SecretRoomProvider>
      </LampProvider>
    </ThemeProvider>
  )
}

export default App
