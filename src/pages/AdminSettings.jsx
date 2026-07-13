import { useState, useEffect, useMemo } from 'react'
import { auth, db } from '../firebase'
import { updatePassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, push, set, get, child, update, remove } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { Terminal, Database, Link as LinkIcon, Power, Shield, Settings, Trash2, Edit2, Loader2, Wand2 } from 'lucide-react'

const RAWG_API_KEY = 'a73ea23a91934b4c9cce7dbe01a9708d'

export default function AdminSettings() {
  const navigate = useNavigate()
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingAPI, setIsFetchingAPI] = useState(false)
  const [log, setLog] = useState([])
  const [games, setGames] = useState([])
  const [searchFilter, setSearchFilter] = useState('')
  const [editingId, setEditingId] = useState(null)
  
  const [form, setForm] = useState({
    title: '', category: 'PC', size: '', image: '', description: '', minSpecs: '', recSpecs: '', isTrending: false
  })

  useEffect(() => {
    let timeout
    const resetTimer = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        signOut(auth)
        navigate('/login')
      }, 600000)
    }
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keypress', resetTimer)
    window.addEventListener('click', resetTimer)
    resetTimer()
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keypress', resetTimer)
      window.removeEventListener('click', resetTimer)
    }
  }, [navigate])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login')
      else { setAuthLoading(false); fetchDatabase() }
    })
    return () => unsubscribe()
  }, [navigate])

  const appendLog = (msg, type = 'info') => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${type.toUpperCase()}: ${msg}`, ...prev].slice(0, 10))
  }

  const fetchDatabase = async () => {
    try {
      const dbRef = ref(db)
      const snapshot = await get(child(dbRef, 'games'))
      if (snapshot.exists()) {
        const data = snapshot.val()
        setGames(Object.keys(data).map(key => ({ id: key, ...data[key] })))
        appendLog('Database sync complete.')
      } else {
        setGames([])
        appendLog('Database empty.')
      }
    } catch (error) {
      appendLog('Connection severed.', 'error')
    } finally {
      setDataLoading(false)
    }
  }

  const handleAutoFill = async () => {
    if (!form.title) return appendLog('Target string required.', 'warn')
    setIsFetchingAPI(true)
    appendLog('Pinging external API...')
    try {
      const searchRes = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(form.title)}&key=${RAWG_API_KEY}&page_size=1`)
      const searchData = await searchRes.json()

      if (searchData.results && searchData.results.length > 0) {
        const target = searchData.results[0]
        const detailRes = await fetch(`https://api.rawg.io/api/games/${target.id}?key=${RAWG_API_KEY}`)
        const detailData = await detailRes.json()
        
        setForm(prev => ({
          ...prev, title: target.name, image: target.background_image || '', description: detailData.description_raw || ''
        }))
        appendLog('Payload extracted.')
      } else {
        appendLog('No matching target found.', 'warn')
      }
    } catch (error) {
      appendLog('API handshake failed.', 'error')
    } finally {
      setIsFetchingAPI(false)
    }
  }

  const executeCommit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingId) {
        await update(ref(db, `games/${editingId}`), { ...form, size: Number(form.size) })
        appendLog(`Block ${editingId} modified.`)
        setEditingId(null)
      } else {
        const newRef = push(ref(db, 'games'))
        await set(newRef, { ...form, size: Number(form.size), createdAt: new Date().toISOString() })
        appendLog('New block appended.')
      }
      setForm({ title: '', category: 'PC', size: '', image: '', description: '', minSpecs: '', recSpecs: '', isTrending: false })
      fetchDatabase()
    } catch (error) {
      appendLog('Write operation failed.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (g) => {
    setEditingId(g.id)
    setForm({ title: g.title, category: g.category || 'PC', size: g.size, image: g.image || '', description: g.description || '', minSpecs: g.minSpecs || '', recSpecs: g.recSpecs || '', isTrending: g.isTrending || false })
    appendLog(`Targeting block ${g.id} for modification.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if(window.confirm('IRREVERSIBLE DATA PURGE. EXECUTE?')) {
      try {
        await remove(ref(db, `games/${id}`))
        appendLog(`Block ${id} purged.`)
        if (editingId === id) {
          setEditingId(null)
          setForm({ title: '', category: 'PC', size: '', image: '', description: '', minSpecs: '', recSpecs: '', isTrending: false })
        }
        fetchDatabase()
      } catch (error) {
        appendLog('Purge failed.', 'error')
      }
    }
  }

  const toggleTrending = async (g) => {
    try {
      await update(ref(db, `games/${g.id}`), { isTrending: !g.isTrending })
      fetchDatabase()
      appendLog(`Flag modified for ${g.title}.`)
    } catch (error) {
      appendLog('Flag modification failed.', 'error')
    }
  }

  const optimizedGamesList = useMemo(() => {
    return games
      .filter(game => game.title.toLowerCase().includes(searchFilter.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  }, [games, searchFilter])

  if (authLoading) return (
    <div className="flex-grow flex items-center justify-center bg-[#050505]">
      <div className="text-2xl font-display font-bold text-[#FFD600] animate-pulse tracking-widest">VERIFYING ADMIN SIGNATURE...</div>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row flex-grow bg-[#050505] max-w-[1800px] mx-auto w-full border-x-2 border-[#111]">
      
      <div className="w-full lg:w-1/4 border-b-2 lg:border-b-0 lg:border-r-2 border-[#111] flex flex-col h-auto lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 bg-[#0a0a0a]">
        <div className="p-8 border-b-2 border-[#111] bg-[#050505]">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-[#FFD600] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest clip-button">ROOT_ACCESS</span>
            <button onClick={() => signOut(auth)} className="w-8 h-8 flex items-center justify-center bg-[#111] text-red-500 hover:bg-red-500 hover:text-white transition-colors clip-button"><Power size={14}/></button>
          </div>
          <h2 className="text-4xl font-display font-bold text-white uppercase tracking-wider">CONTROL_NODE</h2>
        </div>
        
        <div className="p-8 flex flex-col flex-grow overflow-hidden border-b-2 border-[#111]">
          <div className="flex items-center gap-2 mb-6">
            <Terminal size={16} className="text-[#FFD600]" />
            <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">System_Logs</span>
          </div>
          <div className="flex flex-col gap-3 font-mono text-[10px] overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
            {log.length === 0 ? <span className="text-neutral-600">AWAITING_INPUT...</span> : log.map((msg, i) => (
              <span key={i} className={`border-l-2 pl-3 py-1 ${msg.includes('ERROR') ? 'border-red-500 text-red-500' : msg.includes('WARN') ? 'border-[#FFD600] text-[#FFD600]' : 'border-neutral-700 text-neutral-400'}`}>
                {msg}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8 flex flex-col gap-6 bg-[#050505]">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#FFD600]" />
            <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">Marquee_Flags</span>
          </div>
          <div className="max-h-48 overflow-y-auto pr-4 flex flex-col gap-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFD600 transparent' }}>
            {games.map(g => (
              <div key={`trend-${g.id}`} onClick={() => toggleTrending(g)} className="flex items-center justify-between cursor-pointer group bg-[#111] p-3 clip-card border-l-2 border-transparent hover:border-[#FFD600]">
                <span className={`text-xs font-black uppercase tracking-widest truncate pr-4 ${g.isTrending ? 'text-[#FFD600]' : 'text-neutral-500 group-hover:text-white'}`}>{g.title}</span>
                <div className={`w-3 h-3 border-2 flex items-center justify-center shrink-0 ${g.isTrending ? 'bg-[#FFD600] border-[#FFD600]' : 'border-[#333]'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/4 flex flex-col xl:flex-row">
        
        <div className="w-full xl:w-1/2 p-8 lg:p-12 border-b-2 xl:border-b-0 xl:border-r-2 border-[#111] bg-[#050505] overflow-y-auto">
          <div className="flex items-center gap-4 mb-10 border-b-2 border-[#111] pb-6">
            <Settings size={28} className="text-[#FFD600]" />
            <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wider">{editingId ? 'MODIFY_BLOCK' : 'APPEND_BLOCK'}</h3>
          </div>

          <form onSubmit={executeCommit} className="flex flex-col gap-8">
            
            <div className="bg-[#111] p-6 clip-card border-t-2 border-[#FFD600]">
              <div className="flex justify-between items-end mb-4">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Target_String</label>
                <button type="button" onClick={handleAutoFill} disabled={isFetchingAPI} className="text-[10px] font-black text-black uppercase tracking-widest px-4 py-2 bg-[#FFD600] hover:bg-white transition-colors clip-button flex items-center gap-2">
                  {isFetchingAPI ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  {isFetchingAPI ? 'EXTRACTING...' : 'RUN_EXTRACTION'}
                </button>
              </div>
              <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-[#050505] border-2 border-[#222] focus:border-[#FFD600] p-4 text-sm font-bold text-white focus:outline-none uppercase tracking-wide clip-button" required/>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Class_Type</label>
                <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full bg-[#111] border-2 border-[#222] focus:border-[#FFD600] p-4 text-sm font-bold text-white focus:outline-none appearance-none rounded-none uppercase tracking-wide clip-button">
                  <option className="bg-[#050505]">PC</option>
                  <option className="bg-[#050505]">PS4</option>
                  <option className="bg-[#050505]">Multiplayer</option>
                  <option className="bg-[#050505]">Kids</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Volume_GB</label>
                <input type="number" step="0.1" value={form.size} onChange={e=>setForm({...form, size: e.target.value})} className="w-full bg-[#111] border-2 border-[#222] focus:border-[#FFD600] p-4 text-sm font-bold text-white focus:outline-none clip-button" required/>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Visual_Path</label>
              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input type="url" value={form.image} onChange={e=>setForm({...form, image: e.target.value})} className="w-full bg-[#111] border-2 border-[#222] focus:border-[#FFD600] py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none clip-button"/>
                </div>
                {form.image && <img src={form.image} alt="prev" className="w-14 h-14 object-cover border-2 border-[#FFD600] shrink-0 clip-button"/>}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Intel_Dump</label>
              <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full bg-[#111] border-2 border-[#222] focus:border-[#FFD600] p-4 text-sm font-medium text-white focus:outline-none min-h-[120px] resize-y clip-card" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Min_Hardware</label>
                <textarea value={form.minSpecs} onChange={e=>setForm({...form, minSpecs: e.target.value})} className="w-full bg-[#111] border-2 border-[#222] focus:border-[#FFD600] p-4 text-xs font-medium text-white focus:outline-none min-h-[100px] resize-none clip-card" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Rec_Hardware</label>
                <textarea value={form.recSpecs} onChange={e=>setForm({...form, recSpecs: e.target.value})} className="w-full bg-[#111] border-2 border-[#222] focus:border-[#FFD600] p-4 text-xs font-medium text-white focus:outline-none min-h-[100px] resize-none clip-card" />
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-8 border-t-2 border-[#111]">
              <button type="submit" disabled={isSubmitting || !form.title} className="flex-1 bg-[#FFD600] text-black py-5 font-black text-sm uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 clip-button flex items-center justify-center gap-3 -skew-x-12">
                <div className="skew-x-12 flex items-center gap-3">
                  <Save size={18} /> {editingId ? 'COMMIT_CHANGES' : 'INJECT_BLOCK'}
                </div>
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="px-10 border-2 border-[#333] bg-[#111] text-neutral-400 font-black text-sm uppercase tracking-widest hover:text-white hover:border-white transition-colors clip-button -skew-x-12">
                  <div className="skew-x-12">ABORT</div>
                </button>
              )}
            </div>

          </form>
        </div>

        <div className="w-full xl:w-1/2 p-8 lg:p-12 flex flex-col bg-[#0a0a0a]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b-2 border-[#111] gap-6">
            <div className="flex items-center gap-4 shrink-0">
              <Database size={28} className="text-[#FFD600]" />
              <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wider">DATA_MATRIX</h3>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD600]" size={16} />
              <input type="text" placeholder="FILTER..." value={searchFilter} onChange={e=>setSearchFilter(e.target.value)} className="w-full bg-[#111] border-2 border-[#222] focus:border-[#FFD600] py-3 pl-12 pr-4 text-xs font-black text-white focus:outline-none placeholder-neutral-600 uppercase tracking-widest clip-button"/>
            </div>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFD600 transparent', maxHeight: 'calc(100vh - 250px)' }}>
            {dataLoading ? <span className="text-2xl font-display font-bold text-[#FFD600] animate-pulse">SCANNING...</span> : 
             optimizedGamesList.length === 0 ? <span className="text-2xl font-display font-bold text-neutral-600">NULL_RESULT</span> :
             optimizedGamesList.map(g => (
              <div key={`mat-${g.id}`} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 border-l-4 ${editingId === g.id ? 'border-[#FFD600] bg-[#111]' : 'border-transparent bg-[#050505] hover:bg-[#111] hover:border-[#333]'} transition-colors group clip-card gap-4`}>
                <div className="flex items-center gap-5 overflow-hidden">
                  <div className="w-16 h-16 bg-[#111] border-2 border-[#222] flex items-center justify-center overflow-hidden shrink-0 clip-button">
                    {g.image ? <img src={g.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt=""/> : <div className="w-4 h-4 bg-neutral-800"></div>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-display font-bold text-white uppercase tracking-wider truncate">{g.title}</span>
                    <span className="text-[10px] font-black text-[#FFD600] uppercase tracking-widest">{g.category} // {g.size}GB</span>
                  </div>
                </div>
                <div className="flex gap-3 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>handleEdit(g)} className="w-12 h-12 flex items-center justify-center border-2 border-[#222] text-neutral-400 hover:text-black hover:bg-[#FFD600] hover:border-[#FFD600] bg-[#111] transition-all clip-button -skew-x-12"><div className="skew-x-12"><Edit2 size={16}/></div></button>
                  <button onClick={()=>handleDelete(g.id)} className="w-12 h-12 flex items-center justify-center border-2 border-[#222] text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 bg-[#111] transition-all clip-button -skew-x-12"><div className="skew-x-12"><Trash2 size={16}/></div></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}