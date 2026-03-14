import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import YuminGuo from './pages/YuminGuo'
import KunlunQiu from './pages/KunlunQiu'
import LingShan from './pages/LingShan'
import TangGu from './pages/TangGu'
import InsightDetail from './pages/InsightDetail'
import NoteDetail from './pages/NoteDetail'
import DiaryDetail from './pages/DiaryDetail'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/yumin" element={<YuminGuo />} />
        <Route path="/yumin/:id" element={<InsightDetail />} />
        <Route path="/kunlun" element={<KunlunQiu />} />
        <Route path="/kunlun/:id" element={<NoteDetail />} />
        <Route path="/lingshan" element={<LingShan />} />
        <Route path="/tanggu" element={<TangGu />} />
        <Route path="/tanggu/:id" element={<DiaryDetail />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
