import { MapPin, MessageSquare, PlayCircle, Wrench, MonitorPlay, Mail, MessageCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ref, get, child } from 'firebase/database'
import { db } from '../firebase'

const channels = [
  { name: "WHATSAPP", handle: "0952 467 9636", link: "https://wa.me/639524679636", icon: MessageCircle },
  { name: "FACEBOOK", handle: "GAMERZNET", link: "https://www.facebook.com/gamerznetisback", icon: MessageSquare },
  { name: "YOUTUBE", handle: "@gamerznetisbackonline", link: "https://www.youtube.com/@gamerznetisbackonline", icon: MonitorPlay },
  { name: "EMAIL", handle: "gamerz.nets@gmail.com", link: "mailto:gamerz.nets@gmail.com", icon: Mail }
]

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url?.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export default function Support() {
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const dbRef = ref(db)
        const snapshot = await get(child(dbRef, 'tutorials'))
        if (snapshot.exists()) {
          const data = snapshot.val()
          const formattedData = Object.keys(data)
            .map(key => ({ id: key, ...data[key] }))
            .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          setTutorials(formattedData)
        } else {
          setTutorials([])
        }
      } catch (error) {} finally {
        setLoading(false)
      }
    }
    fetchTutorials()
  }, [])

  return (
    <div className="w-full flex flex-col flex-grow bg-[#050505]">
      
      <div className="w-full relative overflow-hidden bg-anime-stripes border-b border-[#111] py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10"></div>
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[#FFD600]/10 blur-[120px] pointer-events-none z-0"></div>
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center text-center">
          <div className="bg-[#FFD600] text-black px-3 py-1 flex items-center gap-2 mb-4 clip-button -skew-x-12">
            <span className="skew-x-12 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black animate-pulse rounded-full"></span> Connection_Live
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {channels.map((channel, idx) => {
              const IconComponent = channel.icon
              return (
                <a 
                  key={idx} 
                  href={channel.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#111] p-6 clip-card border-b-2 border-transparent hover:border-[#FFD600] transition-colors group flex items-start gap-4 shadow-lg"
                >
                  <div className="w-12 h-12 bg-[#050505] border border-[#222] flex items-center justify-center group-hover:border-[#FFD600] transition-colors clip-button shrink-0">
                    <IconComponent size={20} className="text-[#FFD600]" />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">{channel.name}</h3>
                      <ExternalLink size={14} className="text-neutral-600 group-hover:text-[#FFD600] transition-colors shrink-0 ml-2" />
                    </div>
                    <p className="text-xs font-medium text-neutral-400 mt-1.5 truncate">{channel.handle}</p>
                  </div>
                </a>
              )
            })}
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
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HQ Location Map"
              />
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

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-sm font-bold text-[#FFD600] animate-pulse uppercase tracking-widest">Syncing Directives...</div>
            </div>
          ) : tutorials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-[#222] bg-[#111] clip-card">
              <AlertCircle size={32} className="text-neutral-600 mb-4" />
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">No Tutorial Directives Available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => {
                const videoId = getYoutubeId(tutorial.url)
                const thumbnailUrl = videoId 
                  ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                  : 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'

                return (
                  <div key={tutorial.id} className="bg-[#111] p-5 flex flex-col group hover:bg-[#151515] transition-colors clip-card border-b-2 border-transparent hover:border-[#FFD600] shadow-lg">
                    <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
                      <PlayCircle size={16} className="text-[#FFD600]" />
                      <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                        Phase_{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-video bg-[#050505] border border-[#222] overflow-hidden mb-4 group-hover:border-[#FFD600] transition-colors clip-button">
                      <img src={thumbnailUrl} alt={tutorial.title} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle size={36} className="text-[#FFD600] drop-shadow-[0_0_10px_rgba(255,214,0,0.5)] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      </div>
                    </a>
                    <h4 className="text-base font-display font-bold text-white uppercase tracking-wider mb-2 line-clamp-1">{tutorial.title}</h4>
                    <p className="text-[10px] font-medium text-neutral-400 leading-relaxed line-clamp-3">{tutorial.description}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}