import { HardDrive, MonitorPlay, Zap, ArrowDown, PackageCheck, Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="w-full flex flex-col flex-grow bg-[#050505]">
      
      <div className="w-full relative overflow-hidden bg-anime-stripes border-b-2 border-[#111]">
        <div className="absolute right-[-5%] top-10 text-[150px] md:text-[200px] font-display font-bold text-white/[0.02] leading-none pointer-events-none select-none z-0">
          情報
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10"></div>
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[#FFD600]/10 blur-[120px] animate-pulse z-0"></div>
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-20 relative z-20 flex flex-col items-center text-center">
          <div className="bg-[#FFD600] text-black px-4 py-1.5 flex items-center gap-2 mb-6 clip-button -skew-x-12">
            <span className="skew-x-12 text-xs font-black uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white uppercase mb-6 leading-none">
            NO INSTALLS. <span className="text-[#FFD600]">JUST PLAY.</span>
          </h2>
          <p className="text-sm font-medium text-neutral-400 max-w-2xl leading-relaxed">
            We bypass the internet. We bypass the launchers. We provide fully portable, modified game binaries physically shipped to your location on high-speed hardware.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-24 relative">
        
        {/* Animated Process Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center group cursor-default">
            <div className="w-24 h-24 bg-[#111] border-2 border-[#222] flex items-center justify-center mb-8 relative group-hover:scale-110 group-hover:border-[#FFD600] transition-all duration-500 clip-button z-10">
              <div className="absolute inset-0 bg-[#FFD600]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <HardDrive size={40} className="text-neutral-500 group-hover:text-[#FFD600] transition-colors relative z-10" />
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FFD600] text-black font-black flex items-center justify-center clip-button shadow-lg">1</div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 group-hover:text-[#FFD600] transition-colors">Select Payload</h3>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-xs">
              Open the Vault Configurator. Choose your physical hard drive size (500GB up to 8TB) and pick the exact games you want loaded onto it.
            </p>
          </div>

          {/* Arrow / Line separator (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center relative -ml-8 -mr-8 z-0">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFD600]/30 to-transparent"></div>
            <ArrowDown size={32} className="text-[#FFD600]/50 absolute -rotate-90 animate-pulse" />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center group cursor-default mt-8 lg:mt-0">
            <div className="w-24 h-24 bg-[#111] border-2 border-[#222] flex items-center justify-center mb-8 relative group-hover:scale-110 group-hover:border-[#FFD600] transition-all duration-500 clip-button z-10">
              <div className="absolute inset-0 bg-[#FFD600]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <PackageCheck size={40} className="text-neutral-500 group-hover:text-[#FFD600] transition-colors relative z-10" />
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FFD600] text-black font-black flex items-center justify-center clip-button shadow-lg">2</div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 group-hover:text-[#FFD600] transition-colors">We Compile</h3>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-xs">
              We do the heavy lifting. We extract, modify, and optimize the game binaries onto your drive, removing DRM and background bloatware.
            </p>
          </div>

          {/* Arrow / Line separator (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center relative -ml-8 -mr-8 z-0">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFD600]/30 to-transparent"></div>
            <ArrowDown size={32} className="text-[#FFD600]/50 absolute -rotate-90 animate-pulse delay-150" />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group cursor-default mt-8 lg:mt-0">
            <div className="w-24 h-24 bg-[#111] border-2 border-[#222] flex items-center justify-center mb-8 relative group-hover:scale-110 group-hover:border-[#FFD600] transition-all duration-500 clip-button z-10">
              <div className="absolute inset-0 bg-[#FFD600]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Gamepad2 size={40} className="text-neutral-500 group-hover:text-[#FFD600] transition-colors relative z-10" />
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FFD600] text-black font-black flex items-center justify-center clip-button shadow-lg">3</div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 group-hover:text-[#FFD600] transition-colors">Direct Execution</h3>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-xs">
              Receive your drive. Connect via USB or SATA. Double click the game and play instantly. Zero unpacking. Zero internet needed.
            </p>
          </div>

        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 pb-32">
        <div className="bg-[#111] p-10 md:p-14 text-center clip-card border-t-4 border-[#FFD600] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-anime-stripes opacity-10"></div>
          <div className="relative z-10">
            <Zap size={48} className="text-[#FFD600] mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase mb-4">Ready for deployment?</h3>
            <p className="text-sm font-medium text-neutral-400 mb-10 max-w-xl mx-auto">
              Skip the massive downloads. Build your custom offline vault today and experience pure hardware performance.
            </p>
            <Link to="/store" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#FFD600] text-black font-black text-sm uppercase tracking-widest hover:bg-white transition-colors clip-button hover:scale-105 transform-gpu duration-300 -skew-x-12">
              <div className="skew-x-12 flex items-center gap-3">
                <MonitorPlay size={20} /> Access Store
              </div>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}