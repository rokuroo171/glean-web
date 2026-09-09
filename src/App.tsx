import SkyCanvas from './components/SkyCanvas'
import ConstellationPath from './components/ConstellationPath'
import Hero from './components/Hero'
import TheIdea from './components/TheIdea'
import Brightness from './components/Brightness'
import Lines from './components/Lines'
import LivingSky from './components/LivingSky'
import Editor from './components/Editor'
import YourFiles from './components/YourFiles'
import Download from './components/Download'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <SkyCanvas />
      <ConstellationPath />
      <main className="page">
        <Hero />
        <TheIdea />
        <Brightness />
        <Lines />
        <LivingSky />
        <Editor />
        <YourFiles />
        <Download />
      </main>
      <Footer />
    </>
  )
}
