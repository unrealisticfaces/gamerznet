import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

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
    <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row flex-grow px-4 md:px-8 py-16 gap-12 lg:gap-24">
      
      <div className="w-full lg:w-1/3 shrink-0">
        <div className="sticky top-28 flex flex-col items-start text-left">
          <div className="bg-[#FFD600] text-black px-3 py-1 flex items-center gap-2 mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest">Documentation</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white uppercase mb-6 leading-none">
            DATA<br/>LOGS
          </h2>
          <p className="text-xs font-medium text-neutral-400 leading-relaxed bg-[#111]/50 py-3 px-4 border-l-2 border-[#FFD600]">
            Query the database for established protocols, system parameters, and troubleshooting directives.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = index === openIndex
          return (
            <div 
              key={index} 
              className={`border transition-all duration-300 clip-card ${
                isOpen ? 'bg-[#111] border-[#FFD600]' : 'bg-[#050505] border-[#222] hover:border-[#FFD600]/50'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex items-center p-5 md:p-6 text-left focus:outline-none"
              >
                <span className={`text-xl font-display font-bold mr-4 transition-colors ${isOpen ? 'text-[#FFD600]' : 'text-neutral-600'}`}>
                  {faq.id}.
                </span>
                <span className={`text-base font-black uppercase tracking-tight flex-grow transition-colors ${isOpen ? 'text-white' : 'text-neutral-400'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 flex items-center justify-center shrink-0 border transition-colors ${isOpen ? 'border-[#FFD600] text-[#FFD600] bg-[#FFD600]/10' : 'border-[#333] text-neutral-500'}`}>
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 md:px-6 pb-6 pt-0 ml-8 border-t border-[#222] mt-2">
                  <p className="text-xs font-medium text-neutral-400 leading-relaxed pt-4">
                    <span className="text-[#FFD600] font-black mr-2">SYSTEM:</span>{faq.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}