import { Link } from 'react-router-dom'
import { MonitorPlay, HardDrive, PackageCheck, Gamepad2, Zap, ChevronRight, WifiOff, ShieldCheck, Cpu } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { ref, get, child } from 'firebase/database'
import { db } from '../firebase'

export default function Home() {
  const [trendingGames, setTrendingGames] = useState([])
  const [visibleSteps, setVisibleSteps] = useState([])
  const stepRefs = useRef([])

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = Number(entry.target.dataset.step)
            setVisibleSteps((prev) => [...new Set([...prev, stepIndex])])
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col flex-grow bg-[#050505]">
      
      <section className="relative w-full min-h-[85vh] flex items-center justify-start overflow-hidden px-4 md:px-12 bg-anime-stripes border-b-2 border-[#111]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-right opacity-30 mix-blend-luminosity z-0"></div>
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#FFD600]/10 blur-[150px] animate-pulse z-0 pointer-events-none"></div>

        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-start pt-10">
          
          {/* <div className="bg-[#FFD600] text-black px-4 py-1.5 flex items-center gap-2 mb-6 clip-button -skew-x-12">
            <span className="skew-x-12 text-xs font-black uppercase tracking-widest">System Ready</span>
          </div> */}

          <h1 className="text-6xl md:text-7xl lg:text-[100px] font-display font-bold text-white uppercase leading-[0.85] mb-6 drop-shadow-[0_0_20px_rgba(255,214,0,0.15)] -ml-1">
            PORTABLE.<br/>
            <span className="text-[#FFD600]">MODIFIED.</span><br/>
            PLUG & PLAY.
          </h1>

          <p className="text-sm md:text-base text-neutral-400 font-medium max-w-2xl mb-10 leading-relaxed border-l-4 border-[#FFD600] pl-5 bg-[#111]/50 py-3 pr-4">
            Single titles or custom-built hard drives pre-loaded with your exact game selections. No unpacking, no installation, no internet required. Pure hardware execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link to="/store" className="group relative px-10 py-5 bg-[#FFD600] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all hover:bg-white hover:scale-105 clip-button -skew-x-12 cursor-pointer shadow-[0_0_20px_rgba(255,214,0,0.2)]">
              <div className="skew-x-12 flex items-center gap-3">
                <MonitorPlay size={18} />
                <span>Access Store</span>
              </div>
            </Link>
            
            <Link to="/about" className="group relative px-10 py-5 bg-[#111] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center border-2 border-[#222] transition-all hover:border-[#FFD600] clip-button -skew-x-12 cursor-pointer">
              <div className="skew-x-12 flex items-center gap-3">
                <span>Directives</span>
                <ChevronRight size={18} className="text-[#FFD600] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {trendingGames.length > 0 && (
        <div className="w-full bg-[#FFD600] py-3 overflow-hidden flex items-center shadow-[0_0_30px_rgba(255,214,0,0.15)] relative z-30 border-y-2 border-black">
          <div className="px-8 shrink-0 bg-[#FFD600] z-10 border-r-2 border-black">
            <span className="text-xs font-black text-black uppercase tracking-widest">Trending Now</span>
          </div>
          <div className="flex items-center gap-12 animate-marquee whitespace-nowrap pl-12">
            {[...trendingGames, ...trendingGames, ...trendingGames].map((game, idx) => (
              <div key={`${game.id}-${idx}`} className="flex items-center gap-4 shrink-0">
                <span className="text-2xl font-display font-bold text-black uppercase tracking-wider">{game.title}</span>
                <span className="text-black/30 font-black text-xl">+</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="w-full bg-[#050505] border-b-2 border-[#111] py-20 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-wider">Core Architecture</h2>
            <div className="w-16 h-1 bg-[#FFD600] mt-4 clip-button"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] p-8 flex flex-col items-center text-center group transition-all duration-300 hover:bg-[#151515] clip-card border-b-4 border-transparent hover:border-[#FFD600] shadow-lg">
              <div className="w-16 h-16 bg-[#050505] flex items-center justify-center mb-6 clip-button group-hover:bg-[#FFD600] transition-colors duration-300 border border-[#222]">
                <WifiOff size={28} className="text-[#FFD600] group-hover:text-black" />
              </div>
              <h4 className="text-xl font-display font-bold text-white uppercase mb-3">Air-Gapped Ready</h4>
              <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                Zero internet connection required. All files execute entirely offline directly from the physical sector.
              </p>
            </div>

            <div className="bg-[#111] p-8 flex flex-col items-center text-center group transition-all duration-300 hover:bg-[#151515] clip-card border-b-4 border-transparent hover:border-[#FFD600] shadow-lg">
              <div className="w-16 h-16 bg-[#050505] flex items-center justify-center mb-6 clip-button group-hover:bg-[#FFD600] transition-colors duration-300 border border-[#222]">
                <ShieldCheck size={28} className="text-[#FFD600] group-hover:text-black" />
              </div>
              <h4 className="text-xl font-display font-bold text-white uppercase mb-3">DRM Eliminated</h4>
              <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                No third-party clients running in the background stealing memory. Pure, unprotected execution.
              </p>
            </div>

            <div className="bg-[#111] p-8 flex flex-col items-center text-center group transition-all duration-300 hover:bg-[#151515] clip-card border-b-4 border-transparent hover:border-[#FFD600] shadow-lg">
              <div className="w-16 h-16 bg-[#050505] flex items-center justify-center mb-6 clip-button group-hover:bg-[#FFD600] transition-colors duration-300 border border-[#222]">
                <Cpu size={28} className="text-[#FFD600] group-hover:text-black" />
              </div>
              <h4 className="text-xl font-display font-bold text-white uppercase mb-3">Maximum Compute</h4>
              <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                100% of your processor and RAM are dedicated to rendering the game, resulting in higher framerates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#050505] border-b-2 border-[#111] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] via-[#050505] to-[#050505] z-0"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FFD600]/5 rounded-full blur-[120px] z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FFD600]/5 rounded-full blur-[120px] z-0 pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider">Deployment Protocol</h2>
            <div className="w-20 h-1.5 bg-[#FFD600] mx-auto mt-5 clip-button"></div>
          </div>

          <div className="flex flex-col gap-12 md:gap-20 relative z-10 max-w-4xl mx-auto">
            
            <div className="absolute left-[50%] top-8 bottom-8 w-1 bg-[#222] hidden md:block z-0">
              <div className="w-full h-1/2 bg-gradient-to-b from-[#FFD600] to-transparent animate-pulse"></div>
            </div>
            
            <div 
              ref={el => stepRefs.current[0] = el} 
              data-step="1"
              className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 group transition-all duration-1000 transform ease-out ${visibleSteps.includes(1) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'}`}
            >
              <div className="w-full md:w-1/2 flex justify-end relative z-10">
                <div className="w-32 h-32 bg-[#050505] border-4 border-[#222] flex items-center justify-center relative group-hover:scale-105 group-hover:border-[#FFD600] transition-all duration-500 clip-button shadow-xl">
                  <div className="absolute inset-0 bg-[#FFD600]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <HardDrive size={40} className="text-neutral-500 group-hover:text-[#FFD600] transition-colors relative z-10" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#FFD600] text-black font-display text-2xl font-bold flex items-center justify-center clip-button shadow-lg border-2 border-black">1</div>
                  <div className="absolute bottom-2 left-2 text-[7px] font-black text-[#FFD600] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Step_01</div>
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left bg-[#111] p-6 clip-card border-l-4 border-transparent group-hover:border-[#FFD600] transition-colors shadow-xl relative z-10">
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#FFD600] transition-colors">Select Payload</h3>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                  Open the Vault Configurator. Choose your physical hard drive size (500GB up to 8TB) and pick the exact games you want loaded onto it.
                </p>
              </div>
            </div>

            <div 
              ref={el => stepRefs.current[1] = el} 
              data-step="2"
              className={`flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 group transition-all duration-1000 transform ease-out ${visibleSteps.includes(2) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'}`}
            >
              <div className="w-full md:w-1/2 flex justify-start relative z-10">
                <div className="w-32 h-32 bg-[#050505] border-4 border-[#222] flex items-center justify-center relative group-hover:scale-105 group-hover:border-[#FFD600] transition-all duration-500 clip-button shadow-xl">
                  <div className="absolute inset-0 bg-[#FFD600]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <PackageCheck size={40} className="text-neutral-500 group-hover:text-[#FFD600] transition-colors relative z-10" />
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#FFD600] text-black font-display text-2xl font-bold flex items-center justify-center clip-button shadow-lg border-2 border-black">2</div>
                  <div className="absolute bottom-2 right-2 text-[7px] font-black text-[#FFD600] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Step_02</div>
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-right bg-[#111] p-6 clip-card border-r-4 border-transparent group-hover:border-[#FFD600] transition-colors shadow-xl relative z-10">
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#FFD600] transition-colors">We Compile</h3>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                  We handle the heavy lifting. We extract, modify, and optimize the game binaries onto your drive, completely removing DRM and background bloatware.
                </p>
              </div>
            </div>

            <div 
              ref={el => stepRefs.current[2] = el} 
              data-step="3"
              className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 group transition-all duration-1000 transform ease-out ${visibleSteps.includes(3) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'}`}
            >
              <div className="w-full md:w-1/2 flex justify-end relative z-10">
                <div className="w-32 h-32 bg-[#050505] border-4 border-[#222] flex items-center justify-center relative group-hover:scale-105 group-hover:border-[#FFD600] transition-all duration-500 clip-button shadow-xl">
                  <div className="absolute inset-0 bg-[#FFD600]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Gamepad2 size={40} className="text-neutral-500 group-hover:text-[#FFD600] transition-colors relative z-10" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#FFD600] text-black font-display text-2xl font-bold flex items-center justify-center clip-button shadow-lg border-2 border-black">3</div>
                  <div className="absolute bottom-2 left-2 text-[7px] font-black text-[#FFD600] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Step_03</div>
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left bg-[#111] p-6 clip-card border-l-4 border-transparent group-hover:border-[#FFD600] transition-colors shadow-xl relative z-10">
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#FFD600] transition-colors">Direct Execution</h3>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                  Receive your drive. Connect via USB or SATA. Double click the game and play instantly. Zero unpacking. Zero internet needed.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-[#050505]">
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="bg-[#111] p-8 text-center clip-card border-t-2 border-[#FFD600] shadow-[0_0_30px_rgba(255,214,0,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-anime-stripes opacity-10"></div>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#FFD600]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#FFD600]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <Zap size={32} className="text-[#FFD600] mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase mb-3">Ready for deployment?</h3>
              <p className="text-xs font-medium text-neutral-400 mb-6 max-w-md mx-auto leading-relaxed">
                Skip the massive downloads. Build your custom offline vault today.
              </p>
              <Link to="/store" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#FFD600] text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-all clip-button hover:scale-105 transform-gpu duration-300 -skew-x-12 cursor-pointer shadow-[0_0_15px_rgba(255,214,0,0.2)]">
                <div className="skew-x-12 flex items-center gap-2">
                  <MonitorPlay size={16} /> Access Store
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}