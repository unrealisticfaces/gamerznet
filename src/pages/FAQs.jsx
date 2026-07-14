import { useState } from 'react'
import { Plus, Minus, TerminalSquare } from 'lucide-react'

const faqs = [
  {
    id: "01",
    question: "Do I have to install or unpack the games?",
    answer: "Negative. Unlike typical repacks that require lengthy decompression times, GAMERZNET games are physically shipped pre-installed, modified, and ready for immediate execution. It is 100% plug-and-play."
  },
  {
    id: "02",
    question: "Can I purchase just a single game instead of a whole drive?",
    answer: "Affirmative. We offer individual portable game deployments alongside our massive custom multi-terabyte vaults."
  },
  {
    id: "03",
    question: "Do I need an internet connection to execute binaries?",
    answer: "Negative. The entire GAMERZNET architecture is explicitly designed for air-gapped systems. Once the portable drive is connected to your SATA or USB interface, zero network traffic is required."
  },
  {
    id: "04",
    question: "Are DRM clients (Steam/Epic) required to run in the background?",
    answer: "No. All assets have been scrubbed of external DRM hooks. Binaries execute natively from the root directory, dedicating 100% of your CPU and RAM directly to the rendering engine."
  },
  {
    id: "05",
    question: "Is physical hardware shipped to my sector?",
    answer: "Affirmative. We execute localized physical deployment. We provision high-grade portable drives, flash the requested data, and ship directly to your coordinates."
  }
]

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="w-full flex flex-col flex-grow bg-[#050505]">
      
      <div className="w-full relative overflow-hidden bg-anime-stripes border-b border-[#111] py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10"></div>
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[#FFD600]/10 blur-[120px] pointer-events-none z-0"></div>
        
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center text-center">
           <div className="bg-[#FFD600] text-black px-3 py-1 flex items-center gap-2 mb-5 clip-button -skew-x-12">
            <span className="skew-x-12 text-[10px] font-black uppercase tracking-widest">Documentation</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white uppercase mb-4 leading-none">
            SYSTEM <span className="text-[#FFD600]">FAQS</span>
          </h2>
          <p className="text-xs md:text-sm font-medium text-neutral-400 max-w-xl leading-relaxed border-l-2 border-[#FFD600] pl-4 py-1">
            Query the database for established protocols, system parameters, and troubleshooting directives.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex
            return (
              <div 
                key={index} 
                className={`border transition-colors duration-150 clip-card relative overflow-hidden group ${
                  isOpen ? 'bg-[#111] border-[#FFD600] shadow-[0_0_20px_rgba(255,214,0,0.05)]' : 'bg-[#0a0a0a] border-[#222] hover:border-[#FFD600]/50 hover:bg-[#111]'
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-150 ${isOpen ? 'bg-[#FFD600]' : 'bg-transparent group-hover:bg-[#FFD600]/30'}`}></div>

                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                >
                  <span className={`text-xl md:text-2xl font-display font-bold mr-4 transition-colors duration-150 ${isOpen ? 'text-[#FFD600]' : 'text-neutral-600 group-hover:text-neutral-400'}`}>
                    {faq.id}.
                  </span>
                  <span className={`text-sm md:text-base font-black uppercase tracking-wide flex-grow transition-colors duration-150 ${isOpen ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0 border transition-colors duration-150 clip-button ${isOpen ? 'border-[#FFD600] text-black bg-[#FFD600]' : 'border-[#333] text-neutral-500 group-hover:border-[#FFD600] group-hover:text-[#FFD600]'}`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 md:px-6 pb-6 pt-0 ml-4 md:ml-12 border-t border-[#222] mt-2">
                    <div className="flex items-start gap-3 mt-5">
                      <TerminalSquare size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm font-medium text-neutral-300 leading-relaxed font-sans">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}