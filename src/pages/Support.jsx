import { MapPin, MessageSquare, PlayCircle, Wrench, Shield, Folder, MonitorPlay, ArrowRight } from 'lucide-react'

const socials = [
  { name: "WHATSAPP", handle: "017-9797 287", link: "https://wa.me/60179797287" },
  { name: "FACEBOOK", handle: "GAMERZNET", link: "https://www.facebook.com/share/1D5zLdqBXq/" },
  { name: "TIKTOK", handle: "@gamerznet", link: "https://www.tiktok.com/@red.pcgamingbajet" },
  { name: "SHOPEE", handle: "GAMERZNET STORE", link: "https://my.shp.ee/Lz8hFW9K" }
]

export default function Support() {
  return (
    <div className="w-full flex flex-col flex-grow bg-[#050505]">
      
      {/* Header Section */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-16 flex flex-col lg:flex-row justify-between lg:items-end gap-8 border-b border-[#111]">
        <div className="flex flex-col border-l-4 border-[#FFD600] pl-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-[#FFD600] animate-pulse"></span>
            <span className="text-[10px] font-black text-[#FFD600] uppercase tracking-widest">Connection_Live</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white uppercase leading-none">
            SUPPORT DESK
          </h2>
        </div>
        <div className="px-4 py-2 border border-[#222] bg-[#111] clip-button">
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">NODE: KAJANG, SELANGOR</span>
        </div>
      </div>

      {/* Contact & Map Section */}
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 border-b border-[#111]">
        
        {/* Social Links */}
        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-[#111] bg-[#050505] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} className="text-[#FFD600]" />
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-widest">Direct Links</h3>
          </div>
          
          {socials.map((social) => (
            <a 
              key={social.name}
              href={social.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col p-4 bg-[#111] border-l-2 border-transparent hover:border-[#FFD600] group transition-all clip-card"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-white uppercase tracking-widest group-hover:text-[#FFD600] transition-colors">{social.name}</span>
                <ArrowRight size={14} className="text-neutral-600 group-hover:text-[#FFD600] transform group-hover:translate-x-1 transition-all" />
              </div>
              <span className="text-[10px] font-black text-neutral-500">{social.handle}</span>
            </a>
          ))}
        </div>

        {/* Map */}
        <div className="lg:col-span-3 bg-[#111] relative min-h-[400px] lg:min-h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15938.483647413628!2d101.77708575!3d2.9926639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdcb85f2b876d7%3A0xc3afbf3e3c04f982!2sKajang%2C%20Selangor%2C%20Malaysia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="HQ Location Map"
          ></iframe>
          
          <div className="absolute bottom-6 right-6 bg-[#FFD600] text-black px-4 py-2 flex items-center gap-2 clip-button shadow-[0_0_20px_rgba(255,214,0,0.2)]">
            <MapPin size={14} />
            <span className="text-xs font-black uppercase tracking-widest">Location Acquired</span>
          </div>
        </div>
      </div>

      {/* Utilities Section */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center gap-3 mb-10 border-b border-[#111] pb-4">
          <Wrench size={24} className="text-[#FFD600]" />
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Tutorial Directives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Phase 1 */}
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

          {/* Phase 2 */}
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

          {/* Phase 3 */}
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
  )
}