import { Link } from 'react-router-dom'
import { MonitorPlay, HardDrive, Download, Zap, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ref, get, child } from 'firebase/database'
import { db } from '../firebase'

export default function Home() {
  const [trendingGames, setTrendingGames] = useState([])

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const dbRef = ref(db)
        const snapshot = await get(child(dbRef, 'games'))
        if (snapshot.exists()) {
          const data = snapshot.val()
          const gamesList = Object.keys(data)
            .map(key => ({ id: key, ...data[key] }))
            .filter(game => game.isTrending)
          setTrendingGames(gamesList)
        }
      } catch (error) {}
    }
    fetchTrending()
  }, [])

  return (
    <div className="flex flex-col flex-grow">
      
      <section className="relative w-full min-h-[85vh] flex items-center justify-start overflow-hidden px-4 md:px-12 bg-anime-stripes">
        <div className="absolute top-10 right-10 text-[120px] font-display font-bold text-white/5 leading-none pointer-events-none select-none z-0">
          オフライン
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-right opacity-30 mix-blend-luminosity z-0"></div>

        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-start pt-10">
          
          <div className="bg-[#FFD600] text-black px-3 py-1 flex items-center gap-2 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest">System Ready</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase leading-[0.85] mb-6 drop-shadow-[0_0_20px_rgba(255,214,0,0.15)] -ml-1">
            PORTABLE.<br/>
            <span className="text-[#FFD600]">MODIFIED.</span><br/>
            PLUG & PLAY.
          </h1>

          <p className="text-sm md:text-base text-neutral-400 font-medium max-w-xl mb-10 leading-relaxed">
            Single titles or custom-built hard drives pre-loaded with your exact game selections. No unpacking, no installation, no internet required. Pure plug-and-play performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/store" className="group relative px-8 py-4 bg-[#FFD600] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all hover:bg-white hover:scale-105 clip-button">
              <div className="flex items-center gap-3">
                <MonitorPlay size={18} />
                <span>Access Store</span>
              </div>
            </Link>
            
            <Link to="/about" className="group relative px-8 py-4 bg-[#111] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center border border-[#333] transition-all hover:border-[#FFD600] clip-button">
              <div className="flex items-center gap-3">
                <span>Directives</span>
                <ChevronRight size={18} className="text-[#FFD600] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {trendingGames.length > 0 && (
        <div className="w-full bg-[#FFD600] py-2 overflow-hidden flex items-center shadow-[0_0_20px_rgba(255,214,0,0.15)] relative z-30">
          <div className="px-6 shrink-0 bg-[#FFD600] z-10 border-r border-black">
            <span className="text-[10px] font-black text-black uppercase tracking-widest">Trending</span>
          </div>
          <div className="flex items-center gap-10 animate-marquee whitespace-nowrap pl-10">
            {[...trendingGames, ...trendingGames, ...trendingGames].map((game, idx) => (
              <div key={`${game.id}-${idx}`} className="flex items-center gap-3 shrink-0">
                <span className="text-xl font-display font-bold text-black uppercase tracking-wider">{game.title}</span>
                <span className="text-black/30 font-black">+</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-24 relative">
        <div className="absolute right-10 top-20 text-[80px] font-display font-bold text-white/5 leading-none pointer-events-none select-none">
          特徴
        </div>
        
        <div className="mb-16 flex flex-col items-start border-l-4 border-[#FFD600] pl-5">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase leading-none">System Specs</h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2">Why deploy with GAMERZNET</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] p-8 clip-card border-l-2 border-transparent hover:border-[#FFD600] transition-colors group">
            <div className="w-16 h-16 bg-[#050505] flex items-center justify-center mb-6 clip-button group-hover:bg-[#FFD600] transition-colors">
              <Download size={24} className="text-[#FFD600] group-hover:text-black" />
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase mb-3">Zero Installation</h3>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Skip the multi-hour repack extractions. We pre-install, configure, and patch every single binary directly onto the physical hardware.
            </p>
          </div>

          <div className="bg-[#111] p-8 clip-card border-l-2 border-transparent hover:border-[#FFD600] transition-colors group">
            <div className="w-16 h-16 bg-[#050505] flex items-center justify-center mb-6 clip-button group-hover:bg-[#FFD600] transition-colors">
              <HardDrive size={24} className="text-[#FFD600] group-hover:text-black" />
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase mb-3">Singles to Vaults</h3>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Order a single portable game, or deploy a massive 8TB custom hard drive. Our hardware scales perfectly to your specific requirements.
            </p>
          </div>

          <div className="bg-[#111] p-8 clip-card border-l-2 border-transparent hover:border-[#FFD600] transition-colors group">
            <div className="w-16 h-16 bg-[#050505] flex items-center justify-center mb-6 clip-button group-hover:bg-[#FFD600] transition-colors">
              <Zap size={24} className="text-[#FFD600] group-hover:text-black" />
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase mb-3">Direct Execution</h3>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              No Steam. No Epic. No DRM. Launch modified executables directly from the root directory to allocate 100% of CPU to rendering.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}