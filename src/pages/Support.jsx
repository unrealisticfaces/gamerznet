import { MapPin, MessageSquare, PlayCircle, Wrench, Shield, Folder, MonitorPlay, Mail, MessageCircle, ExternalLink } from 'lucide-react'

const channels = [
  { name: "WHATSAPP", handle: "0952 467 9636", link: "https://wa.me/639524679636", icon: MessageCircle },
  { name: "FACEBOOK", handle: "GAMERZNET", link: "https://www.facebook.com/gamerznetisback", icon: MessageSquare },
  { name: "EMAIL", handle: "gamerz.nets@gmail.com", link: "mailto:gamerz.nets@gmail.com", icon: Mail }
]

export default function Support() {
  return (
    <div className="w-full flex flex-col flex-grow bg-[#050505]">
      
      <div className="w-full relative overflow-hidden bg-anime-stripes border-b border-[#111] py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10"></div>
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[#FFD600]/10 blur-[120px] pointer-events-none z-0"></div>
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center text-center">
          <div className="bg-[#FFD600] text-black px-3 py-1 flex items-center gap-2 mb-4 clip-button -skew-x-12">
            <span className="skew-x-12 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black animate-pulse rounded-full"></span> Need help?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white uppercase mb-4 leading-none">
            SUPPORT <span className="text-[#FFD600]">DESK</span>
          </h2>
          <p className="text-xs md:text-sm font-medium text-neutral-400 max-w-xl leading-relaxed border-l-2 border-[#FFD600] pl-4 py-1">
            Establish a direct connection with our technicians for hardware deployment inquiries, troubleshooting, or custom vault configurations.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 border-b border-[#111] pb-4">
            <MessageSquare size={20} className="text-[#FFD600]" />
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Direct Comms</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {channels.map((channel, idx) => (
              <a 
                key={idx} 
                href={channel.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#111] p-6 clip-card border-b-2 border-transparent hover:border-[#FFD600] transition-colors group flex items-start gap-4 shadow-lg"
              >
                <div className="w-12 h-12 bg-[#050505] border border-[#222] flex items-center justify-center group-hover:border-[#FFD600] transition-colors clip-button shrink-0">
                  <channel.icon size={20} className="text-[#FFD600]" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{channel.name}</h3>
                    <ExternalLink size={14} className="text-neutral-600 group-hover:text-[#FFD600] transition-colors" />
                  </div>
                  <p className="text-xs font-medium text-neutral-400 mt-1.5">{channel.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6 border-b border-[#111] pb-4">
            <MapPin size={20} className="text-[#FFD600]" />
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Headquarters Location</h2>
          </div>
          
          <div className="w-full bg-[#111] p-2 border border-[#222] clip-card relative shadow-2xl">
            <div className="w-full h-[350px] md:h-[500px] relative bg-[#050505] clip-button overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=14.782384,121.046344&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HQ Location Map"
              ></iframe>
            </div>
            
            <div className="absolute top-6 right-6 bg-[#050505] border border-[#FFD600]/30 text-[#FFD600] px-4 py-2 flex items-center gap-2 clip-button shadow-[0_0_20px_rgba(255,214,0,0.15)] pointer-events-none backdrop-blur-md">
              <span className="w-2 h-2 bg-[#FFD600] rounded-full animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">Target Acquired</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-[#111] pb-4">
            <Wrench size={20} className="text-[#FFD600]" />
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Tutorial Directives</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#111] p-5 flex flex-col group hover:bg-[#151515] transition-colors clip-card border-b-2 border-transparent hover:border-[#FFD600]">
              <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
                <Shield size={16} className="text-[#FFD600]" />
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Phase_01</span>
              </div>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="relative w-full aspect-video bg-[#050505] border border-[#222] overflow-hidden mb-4 group-hover:border-[#FFD600] transition-colors clip-button">
                <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop" alt="Tutorial" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={36} className="text-[#FFD600] drop-shadow-[0_0_10px_rgba(255,214,0,0.5)] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
              </a>
              <h4 className="text-base font-display font-bold text-white uppercase tracking-wider mb-1">Security Override</h4>
              <p className="text-[10px] font-medium text-neutral-400 leading-relaxed">Disable real-time protection protocols to halt false-positive binary deletions.</p>
            </div>

            <div className="bg-[#111] p-5 flex flex-col group hover:bg-[#151515] transition-colors clip-card border-b-2 border-transparent hover:border-[#FFD600]">
              <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
                <Folder size={16} className="text-[#FFD600]" />
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Phase_02</span>
              </div>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="relative w-full aspect-video bg-[#050505] border border-[#222] overflow-hidden mb-4 group-hover:border-[#FFD600] transition-colors clip-button">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" alt="Tutorial" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={36} className="text-[#FFD600] drop-shadow-[0_0_10px_rgba(255,214,0,0.5)] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
              </a>
              <h4 className="text-base font-display font-bold text-white uppercase tracking-wider mb-1">Whitelist Config</h4>
              <p className="text-[10px] font-medium text-neutral-400 leading-relaxed">Establish folder exclusions and manually inject required DirectX/VC++ variables.</p>
            </div>

            <div className="bg-[#111] p-5 flex flex-col group hover:bg-[#151515] transition-colors clip-card border-b-2 border-transparent hover:border-[#FFD600]">
              <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
                <MonitorPlay size={16} className="text-[#FFD600]" />
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Phase_03</span>
              </div>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="relative w-full aspect-video bg-[#050505] border border-[#222] overflow-hidden mb-4 group-hover:border-[#FFD600] transition-colors clip-button">
                <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop" alt="Tutorial" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={36} className="text-[#FFD600] drop-shadow-[0_0_10px_rgba(255,214,0,0.5)] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
              </a>
              <h4 className="text-base font-display font-bold text-white uppercase tracking-wider mb-1">Mount & Execute</h4>
              <p className="text-[10px] font-medium text-neutral-400 leading-relaxed">Finalize drive mounting procedures and execute optimized local binaries.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}