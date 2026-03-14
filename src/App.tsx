import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import YuminGuo from './pages/YuminGuo'
import KunlunQiu from './pages/KunlunQiu'
import LingShan from './pages/LingShan'
import TangGu from './pages/TangGu'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/yumin" element={<YuminGuo />} />
        <Route path="/kunlun" element={<KunlunQiu />} />
        <Route path="/lingshan" element={<LingShan />} />
        <Route path="/tanggu" element={<TangGu />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
