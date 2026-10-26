import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import PrivateRepo from './components/PrivateRepo'
import UnderConstruction from './components/UnderConstruction'
import { PRIVATE_REPO_ROUTE, UNDER_CONSTRUCTION_ROUTE } from './data/placeholders'
import { LampProvider } from './context/LampContext'
import { SecretRoomProvider } from './components/secret-room/SecretRoomContext'
import { ThemeProvider } from './context/ThemeContext'
import { useFullPageScroll } from './hooks/useFullPageScroll'

// Só a página principal tem abas; as telas /codigo-privado e /em-construcao rolam normalmente.
function FullPageScroll() {
  useFullPageScroll()
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
            <Navbar />
            <main>
              <Hero />
              <About />
              <Contact />
            </main>
            <Footer />
            <BackToTop />
          </>
        )}
        </SecretRoomProvider>
      </LampProvider>
    </ThemeProvider>
  )
}

export default App
