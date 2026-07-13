import { useState, useEffect, useMemo } from 'react'
import { Image as ImageIcon, Search, MonitorPlay, HardDrive, ShoppingCart, Trash2, CheckCircle2, AlertTriangle, ChevronDown, X, Info, Shield, Save } from 'lucide-react'
import { ref, get, child } from 'firebase/database'
import { db } from '../firebase'

export default function Products() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [driveCapacity, setDriveCapacity] = useState(500)
  const [cart, setCart] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [previewGame, setPreviewGame] = useState(null)

  const categories = ['All', 'PC', 'PS4', 'Multiplayer', 'Kids']

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const dbRef = ref(db)
        const snapshot = await get(child(dbRef, 'games'))
        if (snapshot.exists()) {
          const data = snapshot.val()
          setGames(Object.keys(data).map(key => ({ id: key, ...data[key] })))
        } else {
          setGames([])
        }
      } catch (error) {} finally {
        setLoading(false)
      }
    }
    fetchCatalog()
  }, [])

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory
      return matchesSearch && matchesCategory
    }).sort((a, b) => a.title.localeCompare(b.title))
  }, [games, searchQuery, activeCategory])

  const { totalUsedSpace, remainingSpace, progressPercentage, isOverCapacity } = useMemo(() => {
    const used = cart.reduce((total, game) => total + (Number(game.size) || 0), 0)
    const remain = driveCapacity - used
    const progress = Math.min((used / driveCapacity) * 100, 100)
    const over = used > driveCapacity
    return {
      totalUsedSpace: used,
      remainingSpace: remain,
      progressPercentage: progress,
      isOverCapacity: over
    }
  }, [cart, driveCapacity])

  useEffect(() => {
    if (isOverCapacity) {
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 4000)
      return () => clearTimeout(timer)
    } else {
      setShowToast(false)
    }
  }, [isOverCapacity])

  const cartIds = useMemo(() => new Set(cart.map(g => g.id)), [cart])

  const toggleGameSelection = (game) => {
    if (cartIds.has(game.id)) {
      setCart(prev => prev.filter(g => g.id !== game.id))
    } else {
      setCart(prev => [...prev, game])
    }
  }

  const exportToNotepad = () => {
    if (cart.length === 0) return
    let text = "=========================================\n"
    text += "       GAMERZNET - DEPLOYMENT ORDER\n"
    text += "=========================================\n\n"
    const driveName = driveCapacity >= 1000 ? `${driveCapacity / 1000}TB` : `${driveCapacity}GB`
    text += `[ HARDWARE ]: ${driveName}\n`
    text += `[ ALLOCATED ]: ${totalUsedSpace.toFixed(2)} GB\n`
    text += `[ REMAINING ]: ${remainingSpace.toFixed(2)} GB\n\n`
    if (isOverCapacity) text += "WARNING: CAPACITY EXCEEDED\n\n"
    text += "--- ASSET LIST ---\n\n"
    cart.forEach((game, index) => {
      text += `${index + 1}. ${game.title}\n`
      text += `   Category: ${game.category}\n`
      text += `   Size: ${game.size} GB\n\n`
    })
    text += "=========================================\n"
    text += "Transmit this log to HQ via WhatsApp/FB.\n"
    
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "GAMERZNET_Payload.txt"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 relative pb-24 pt-6">
      
      {previewGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-sm">
          <div className="bg-[#111] border-l-2 border-[#FFD600] w-full max-w-2xl max-h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-[0_0_30px_rgba(255,214,0,0.15)] relative clip-card">
            
            <button onClick={() => setPreviewGame(null)} className="absolute top-3 right-3 z-50 bg-[#FFD600] text-black w-8 h-8 flex items-center justify-center hover:bg-white transition-colors clip-button shadow-md cursor-pointer">
              <X size={16} strokeWidth={3} />
            </button>
            
            <div className="w-full md:w-1/3 h-40 md:h-auto relative bg-[#050505] shrink-0 border-b md:border-b-0 md:border-r border-[#222]">
              {previewGame.image ? (
                <img src={previewGame.image} alt={previewGame.title} className="w-full h-full object-cover transition-all duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon size={32} className="text-[#222]" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#111]"></div>
            </div>
            
            <div className="p-5 md:p-6 flex flex-col flex-grow overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFD600 transparent' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#FFD600] text-black px-2 py-1 text-[10px] font-black uppercase tracking-widest clip-button">
                  {previewGame.category}
                </span>
                <span className="text-sm font-sans font-bold text-white tracking-widest">{previewGame.size} GB</span>
              </div>
              
              <h2 className="text-2xl font-display font-bold text-white uppercase leading-tight mb-4">{previewGame.title}</h2>
              
              <div className="space-y-4">
                <div className="border-l-2 border-[#FFD600] pl-3 bg-[#0a0a0a] p-3 clip-card">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1.5 flex items-center gap-2">Mission Intel</h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">{previewGame.description || 'Intel secured. Awaiting decryption.'}</p>
                </div>
                
                <div className="border-l-2 border-[#333] pl-3 bg-[#0a0a0a] p-3 clip-card">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1.5 flex items-center gap-2">System Specs</h3>
                  <p className="text-xs text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed">{previewGame.minSpecs || 'System parameters not provided.'}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-[#222] flex justify-end shrink-0">
                <button
                  onClick={() => { toggleGameSelection(previewGame); setPreviewGame(null); }}
                  className={`px-6 py-2.5 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors clip-button cursor-pointer ${
                    cartIds.has(previewGame.id)
                      ? 'bg-[#222] text-[#FFD600] hover:bg-[#333]'
                      : 'bg-[#FFD600] text-black hover:bg-white'
                  }`}
                >
                  {cartIds.has(previewGame.id) ? <Trash2 size={14} /> : <ShoppingCart size={14} />}
                  {cartIds.has(previewGame.id) ? 'Remove' : 'Add to List'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed top-24 right-4 md:right-8 z-[90] transition-all duration-500 ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'}`}>
        <div className="bg-[#111] border-l-2 border-red-500 p-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-start gap-4 w-80 clip-card">
          <div className="w-8 h-8 bg-red-500/20 flex items-center justify-center shrink-0 clip-button">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-black text-white uppercase mb-0.5">Capacity Overload</h4>
            <p className="text-xs font-medium text-neutral-400">Assets exceed hardware limit. Reconfigure payload.</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-neutral-500 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 pb-6 border-b border-[#111] gap-6">
        <div className="flex flex-col border-l-4 border-[#FFD600] pl-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase leading-none">The Vault</h2>
          <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-widest mt-2">Initialize your local payload</p>
        </div>
        
        <div className="relative w-full xl:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD600]" size={16} />
          <input
            type="text"
            placeholder="SEARCH FOR A GAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] py-3.5 pl-12 pr-4 text-xs font-black text-white focus:outline-none focus:border-[#FFD600] transition-all clip-button placeholder-neutral-500 hover:border-[#FFD600]/50"
          />
        </div>
      </div>

      <div className="bg-[#111] p-6 md:p-8 mb-12 shadow-2xl relative border-t border-[#222] clip-card">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[#FFD600]"></div>
        
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD600] text-black flex items-center justify-center clip-button">
                  <HardDrive size={18} />
                </div>
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Hardware Spec</h3>
              </div>
              <div className="flex items-center gap-3 bg-[#050505] p-1.5 border border-[#222] clip-button w-full sm:w-auto">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-3">Volume:</span>
                <div className="relative flex-grow sm:flex-grow-0">
                  <select 
                    value={driveCapacity}
                    onChange={(e) => setDriveCapacity(Number(e.target.value))}
                    className="bg-[#111] text-xs text-white font-black py-2 pl-3 pr-10 focus:outline-none cursor-pointer appearance-none w-full border-none"
                  >
                    <option value={500}>500 GB</option>
                    <option value={1000}>1 TB</option>
                    <option value={2000}>2 TB</option>
                    <option value={4000}>4 TB</option>
                    <option value={8000}>8 TB</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFD600] pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="w-full h-4 bg-[#050505] overflow-hidden mb-3 border border-[#222] clip-button relative">
              <div className="absolute inset-0 bg-anime-stripes opacity-20"></div>
              <div 
                className={`h-full transition-all duration-700 relative ${isOverCapacity ? 'bg-red-600' : 'bg-[#FFD600]'}`}
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
              <span className={isOverCapacity ? 'text-red-500' : 'text-[#FFD600]'}>
                {totalUsedSpace.toFixed(1)} GB ALLOCATED
              </span>
              <span className="text-neutral-500">
                {driveCapacity >= 1000 ? `${driveCapacity / 1000} TB` : `${driveCapacity} GB`} LIMIT
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 lg:border-l lg:border-[#222] lg:pl-8">
            <button 
              onClick={() => setCart([])}
              className="w-full sm:w-auto px-6 py-4 bg-[#050505] text-neutral-400 border border-[#222] hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 clip-button cursor-pointer"
            >
              <Trash2 size={14} /> Clear
            </button>
            <button 
              onClick={exportToNotepad}
              className="w-full sm:w-auto px-8 py-4 bg-[#FFD600] text-black hover:bg-white transition-colors font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed clip-button cursor-pointer"
              disabled={cart.length === 0}
            >
              <Save size={14} /> Extract Log
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 font-black text-[10px] transition-colors uppercase tracking-widest clip-button cursor-pointer ${
              activeCategory === category
                ? 'bg-[#FFD600] text-black shadow-[0_0_10px_rgba(255,214,0,0.2)]'
                : 'bg-[#111] text-white hover:bg-[#222] border border-[#222]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-24 text-[#FFD600] font-black text-xl tracking-widest uppercase animate-pulse">
          Establishing Link...
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-24 text-neutral-600 font-black text-xl tracking-widest uppercase border-y border-[#111]">
          No Assets Detected.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 md:gap-4">
          {filteredGames.map(game => {
            const isSelected = cartIds.has(game.id)
            return (
              <div 
                key={game.id} 
                className={`w-full bg-[#111] flex flex-col relative group transition-colors duration-300 clip-card ${
                  isSelected ? 'border-b-2 border-[#FFD600]' : 'border-b-2 border-transparent hover:border-[#333]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 left-2 z-30 bg-[#FFD600] text-black w-5 h-5 flex items-center justify-center clip-button shadow-md pointer-events-none">
                    <CheckCircle2 size={10} strokeWidth={3} />
                  </div>
                )}
                
                <div 
                  onClick={() => setPreviewGame(game)}
                  className="aspect-[3/4] w-full bg-[#050505] relative overflow-hidden flex items-center justify-center cursor-pointer border-b border-[#222]"
                >
                  {game.image ? (
                    <img src={game.image} alt={game.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <Shield size={24} className="text-[#222] group-hover:text-[#FFD600] transition-colors" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-[2px]">
                    <span className="px-2.5 py-1.5 bg-[#FFD600] text-black text-[9px] font-black uppercase tracking-widest clip-button flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                      <Info size={12} /> Preview
                    </span>
                  </div>
                  
                  <span className="absolute top-2 right-2 z-20 bg-[#050505] px-1.5 py-0.5 text-[8px] font-black text-[#FFD600] border border-[#FFD600]/30 uppercase tracking-widest clip-button pointer-events-none">
                    {game.category}
                  </span>
                </div>
                
                <div className="p-3 flex flex-col flex-grow bg-[#111]">
                  <h3 className={`text-xs md:text-sm font-sans font-bold mb-1.5 line-clamp-2 uppercase tracking-wide leading-snug ${isSelected ? 'text-[#FFD600]' : 'text-white group-hover:text-[#FFD600] transition-colors'}`}>
                    {game.title}
                  </h3>
                  <div className="mt-auto flex flex-col gap-2">
                    <div className="text-[9px] font-black text-neutral-500 tracking-widest border-l-2 border-[#333] pl-2">
                      {game.size} GB
                    </div>
                    
                    <button
                      onClick={() => toggleGameSelection(game)}
                      className={`w-full py-2 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors clip-button cursor-pointer ${
                        isSelected
                          ? 'bg-[#222] text-[#FFD600] hover:bg-[#333]'
                          : 'bg-[#050505] text-white hover:bg-[#FFD600] hover:text-black border border-[#222] hover:border-[#FFD600]'
                      }`}
                    >
                      {isSelected ? <Trash2 size={10} /> : <ShoppingCart size={10} />}
                      {isSelected ? 'Remove' : 'Add to List'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}