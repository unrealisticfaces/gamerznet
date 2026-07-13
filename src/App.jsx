import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import FAQs from './pages/FAQs'
import Support from './pages/Support'
import Login from './pages/Login'
import AdminSettings from './pages/AdminSettings'
import logo from './images/gamerznet.webp'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const links = [
    { name: 'HOME', path: '/', jp: 'ホーム' },
    { name: 'STORE', path: '/store', jp: 'ストア' },
    { name: 'ABOUT', path: '/about', jp: '情報' },
    { name: 'FAQ', path: '/faqs', jp: '質問' },
    { name: 'SUPPORT', path: '/support', jp: 'サポート' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed w-full z-[100] bg-[#050505]/90 backdrop-blur-xl border-b border-[#111]">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          <Link to="/" className="flex items-center gap-4 group" onClick={() => setIsOpen(false)}>
            <div className="w-12 h-12 flex items-center justify-center transform-gpu group-hover:scale-105 transition-transform">
              <img src={logo} alt="GAMERZNET" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-3xl font-display font-bold text-white tracking-wider uppercase">GAMERZNET</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`group flex flex-col items-center justify-center px-6 py-2 -skew-x-12 transition-all ${
                  isActive(link.path) ? 'bg-[#FFD600] text-black shadow-[0_0_15px_rgba(255,214,0,0.3)]' : 'hover:bg-[#111] text-white'
                }`}
              >
                <div className="skew-x-12 flex flex-col items-center">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${isActive(link.path) ? 'text-black' : 'text-white'}`}>
                    {link.name}
                  </span>
                  <span className={`text-[8px] font-bold opacity-50 ${isActive(link.path) ? 'text-black' : 'text-[#FFD600]'}`}>
                    {link.jp}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-[#050505] border-b border-[#FFD600] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
        <div className="px-4 py-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-display font-bold uppercase tracking-wider p-4 clip-button ${
                isActive(link.path) ? 'bg-[#FFD600] text-black' : 'bg-[#111] text-white'
              }`}
            >
              {link.name} <span className="text-sm opacity-50 ml-2">{link.jp}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#111] py-8 md:py-10 mt-auto relative z-50 overflow-hidden">
      <div className="absolute right-0 bottom-0 text-[80px] font-display font-bold text-white/5 leading-none pointer-events-none select-none -mb-4">
        システム
      </div>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
        <div className="flex items-end gap-3">
          <div className="w-12 h-12 bg-[#FFD600] flex items-center justify-center clip-button">
            <img src={logo} alt="GAMERZNET" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-3xl font-display font-bold text-white tracking-wider">GAMERZNET</span>
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
          </div>
        </div>
        
        <Link to="/login" className="text-[10px] font-black text-[#FFD600] hover:text-white transition-colors tracking-widest uppercase bg-[#111] px-5 py-2 clip-button">
          System Admin
        </Link>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <div className="fixed inset-0 z-[-5] bg-[#050505]"></div>
      <div className="fixed inset-0 z-[-4] bg-anime-dots opacity-40 pointer-events-none"></div>
      <div className="fixed inset-0 z-[-3] bg-gradient-to-b from-[#050505]/50 to-[#050505] pointer-events-none"></div>

      <div className="min-h-screen text-white flex flex-col selection:bg-[#FFD600] selection:text-black relative z-10">
        <Navigation />
        <main className="flex-grow pt-20 md:pt-24 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminSettings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}