import { Zap, ShieldCheck, Cpu, HardDrive, MonitorPlay, Crosshair, Database, Server } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import logo from '../images/gamerznet.webp'

export default function About() {
  const [visibleElements, setVisibleElements] = useState([])
  const refs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index)
            setVisibleElements((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full flex flex-col flex-grow bg-[#050505]">
      
      <div className="w-full relative overflow-hidden bg-anime-stripes border-b-2 border-[#111]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10"></div>
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#FFD600]/10 blur-[120px] animate-pulse z-0"></div>
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-24 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
          <div className="flex flex-col items-start w-full lg:w-1/2">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase mb-6 leading-none">
              ABOUT<span className="text-[#FFD600]"> US.</span>
            </h2>
            <p className="text-sm md:text-base font-medium text-neutral-400 max-w-2xl leading-relaxed border-l-4 border-[#FFD600] pl-5 py-2 bg-[#111]/50">
              GAMERZNET is a specialized vendor dedicated to the preservation and performance of offline gaming. We build, configure, and ship physical game drives directly to your sector.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img src={logo} alt="GAMERZNET" className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-[0_0_50px_rgba(255,214,0,0.15)] transform hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-24 relative z-10">
        <div 
          ref={el => refs.current[0] = el} 
          data-index="0"
          className={`flex flex-col lg:flex-row gap-16 transition-all duration-1000 transform ${visibleElements.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="w-full lg:w-1/3">
            <div className="sticky top-32">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase mb-4 tracking-wider">The Mission</h3>
              <div className="w-16 h-1.5 bg-[#FFD600] mb-6 clip-button"></div>
              <p className="text-sm text-neutral-400 font-medium leading-relaxed mb-6">
                Modern gaming has become a logistics nightmare. Between massive 150GB downloads, mandatory background clients, and intrusive DRM systems that drain your system memory, simply launching a game has become a chore.
              </p>
              <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                We built GAMERZNET to strip all of that away.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-8 clip-card border-t-4 border-[#222] hover:border-[#FFD600] transition-colors group shadow-xl">
              <HardDrive size={32} className="text-[#FFD600] mb-6" />
              <h4 className="text-xl font-display font-bold text-white uppercase mb-3">Physical Assets</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                We don't sell digital keys or downloads. We sell highly optimized, physical hardware. Whether you need a single portable game or a massive 8TB custom vault, we deliver the actual drive to your hands.
              </p>
            </div>

            <div className="bg-[#111] p-8 clip-card border-t-4 border-[#222] hover:border-[#FFD600] transition-colors group shadow-xl">
              <Cpu size={32} className="text-[#FFD600] mb-6" />
              <h4 className="text-xl font-display font-bold text-white uppercase mb-3">Pre-Configured</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                Unlike traditional repacks that force your CPU to decompress files for hours, our drives arrive 100% pre-installed. The binaries are extracted, patched, and ready to execute the moment you plug it in.
              </p>
            </div>

            <div className="bg-[#111] p-8 clip-card border-t-4 border-[#222] hover:border-[#FFD600] transition-colors group shadow-xl">
              <ShieldCheck size={32} className="text-[#FFD600] mb-6" />
              <h4 className="text-xl font-display font-bold text-white uppercase mb-3">Pure Offline</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                Our assets are scrubbed of all third-party launchers. No Steam, no Epic, no online checks. This dedicates your entire processor and RAM directly to the game's rendering engine for maximum framerates.
              </p>
            </div>

            <div className="bg-[#111] p-8 clip-card border-t-4 border-[#222] hover:border-[#FFD600] transition-colors group shadow-xl">
              <Database size={32} className="text-[#FFD600] mb-6" />
              <h4 className="text-xl font-display font-bold text-white uppercase mb-3">Digital Preservation</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                When you rely on servers, you don't own your games. A physical GAMERZNET drive ensures your library remains yours forever, completely immune to server shutdowns or digital delistings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#0a0a0a] border-y-2 border-[#111] py-24 relative overflow-hidden">
        <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD600]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD600]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-wider">Operational Standards</h2>
            <div className="w-16 h-1.5 bg-[#FFD600] mx-auto mt-6 clip-button"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
            <div 
              ref={el => refs.current[1] = el} 
              data-index="1"
              className={`flex flex-col items-center text-center max-w-xs transition-all duration-1000 transform delay-100 ${visibleElements.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              <div className="w-20 h-20 bg-[#111] border-2 border-[#222] flex items-center justify-center mb-6 clip-button shadow-lg">
                <Crosshair size={32} className="text-[#FFD600]" />
              </div>
              <h4 className="text-xl font-display font-bold text-white uppercase mb-2">Precision</h4>
              <p className="text-xs text-neutral-500 font-medium">Every title is rigorously tested on diverse hardware configurations before deployment.</p>
            </div>

            <div 
              ref={el => refs.current[2] = el} 
              data-index="2"
              className={`flex flex-col items-center text-center max-w-xs transition-all duration-1000 transform delay-200 ${visibleElements.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              <div className="w-20 h-20 bg-[#111] border-2 border-[#222] flex items-center justify-center mb-6 clip-button shadow-lg">
                <Server size={32} className="text-[#FFD600]" />
              </div>
              <h4 className="text-xl font-display font-bold text-white uppercase mb-2">Capacity</h4>
              <p className="text-xs text-neutral-500 font-medium">From custom 500GB SSDs to massive 8TB HDD Vaults, we scale our hardware to your exact needs.</p>
            </div>

            <div 
              ref={el => refs.current[3] = el} 
              data-index="3"
              className={`flex flex-col items-center text-center max-w-xs transition-all duration-1000 transform delay-300 ${visibleElements.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              <div className="w-20 h-20 bg-[#111] border-2 border-[#222] flex items-center justify-center mb-6 clip-button shadow-lg">
                <Zap size={32} className="text-[#FFD600]" />
              </div>
              <h4 className="text-xl font-display font-bold text-white uppercase mb-2">Velocity</h4>
              <p className="text-xs text-neutral-500 font-medium">Skip the multi-day download queues. Plug the drive in and enter the game immediately.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full py-16 bg-[#050505]">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-[#111] p-8 text-center clip-card border-t-2 border-[#FFD600] shadow-[0_0_30px_rgba(255,214,0,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-anime-stripes opacity-10"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Zap size={32} className="text-[#FFD600] mb-4" />
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase mb-3">Ready for deployment?</h3>
              <p className="text-xs font-medium text-neutral-400 mb-6 max-w-md mx-auto leading-relaxed">
                Take control of your library. Build your custom offline vault today.
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