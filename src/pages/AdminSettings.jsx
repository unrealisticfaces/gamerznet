import { useState, useEffect, useMemo, useRef } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, push, set, get, child, update, remove } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { Database, Link as LinkIcon, Power, Shield, Settings, Trash2, Edit2, Loader2, Wand2, Search, Save, TrendingUp, Video, ImagePlus, CheckSquare, Square, Upload, PlayCircle, Layers } from 'lucide-react'

const RAWG_API_KEY = import.meta.env?.VITE_RAWG_API_KEY || 'a73ea23a91934b4c9cce7dbe01a9708d'

export default function AdminSettings() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingAPI, setIsFetchingAPI] = useState(false)
  const [isBulkImporting, setIsBulkImporting] = useState(false)
  const [importProgress, setImportProgress] = useState('')
  const [games, setGames] = useState([])
  const [tutorials, setTutorials] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTutorialId, setEditingTutorialId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(50)
  const [activeView, setActiveView] = useState('games')
  
  const [form, setForm] = useState({
    title: '', category: 'PC', size: '', image: '', video: '', screenshots: '', description: '', minSpecs: '', setupGuide: '', isTrending: false
  })

  const [tutorialForm, setTutorialForm] = useState({
    title: '', description: '', url: ''
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
      else { 
        setAuthLoading(false)
        fetchDatabase()
        fetchTutorials()
      }
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchFilter(searchInput)
      setVisibleCount(50)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchDatabase = async () => {
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
      setDataLoading(false)
    }
  }

  const fetchTutorials = async () => {
    try {
      const dbRef = ref(db)
      const snapshot = await get(child(dbRef, 'tutorials'))
      if (snapshot.exists()) {
        const data = snapshot.val()
        setTutorials(Object.keys(data).map(key => ({ id: key, ...data[key] })))
      } else {
        setTutorials([])
      }
    } catch (error) {}
  }

  const handleAutoFill = async () => {
    if (!form.title) return
    setIsFetchingAPI(true)
    try {
      const searchRes = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(form.title)}&key=${RAWG_API_KEY}&page_size=1`)
      const searchData = await searchRes.json()

      if (searchData.results && searchData.results.length > 0) {
        const target = searchData.results[0]
        const detailRes = await fetch(`https://api.rawg.io/api/games/${target.id}?key=${RAWG_API_KEY}`)
        const detailData = await detailRes.json()
        
        const screens = target.short_screenshots 
          ? target.short_screenshots.map(s => s.image).filter(img => img !== target.background_image).slice(0, 3).join(', ') 
          : ''

        setForm(prev => ({
          ...prev, 
          title: target.name, 
          image: target.background_image || '', 
          screenshots: screens,
          description: detailData.description_raw || ''
        }))
      } else {
        alert('Asset not found in RAWG database.')
      }
    } catch (error) {
      alert('API connection failed. Check your network or API key.')
    } finally {
      setIsFetchingAPI(false)
    }
  }

  const executeCommit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const payload = {
      ...form,
      size: Number(form.size),
      screenshots: form.screenshots ? form.screenshots.split(',').map(s => s.trim()).filter(Boolean) : []
    }

    try {
      if (editingId) {
        await update(ref(db, `games/${editingId}`), payload)
        setEditingId(null)
      } else {
        const newRef = push(ref(db, 'games'))
        await set(newRef, { ...payload, createdAt: new Date().toISOString() })
      }
      setForm({ title: '', category: 'PC', size: '', image: '', video: '', screenshots: '', description: '', minSpecs: '', setupGuide: '', isTrending: false })
      fetchDatabase()
    } catch (error) {} finally {
      setIsSubmitting(false)
    }
  }

  const executeTutorialCommit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (editingTutorialId) {
        await update(ref(db, `tutorials/${editingTutorialId}`), tutorialForm)
        setEditingTutorialId(null)
      } else {
        const newRef = push(ref(db, 'tutorials'))
        await set(newRef, { ...tutorialForm, createdAt: new Date().toISOString() })
      }
      setTutorialForm({ title: '', description: '', url: '' })
      fetchTutorials()
    } catch (error) {} finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setIsBulkImporting(true)
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target.result
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

      for (let i = 0; i < lines.length; i++) {
        const title = lines[i]
        setImportProgress(`Extracting: ${title} (${i + 1}/${lines.length})`)
        
        try {
          const searchRes = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${RAWG_API_KEY}&page_size=1`)
          const searchData = await searchRes.json()

          if (searchData.results && searchData.results.length > 0) {
            const target = searchData.results[0]
            const detailRes = await fetch(`https://api.rawg.io/api/games/${target.id}?key=${RAWG_API_KEY}`)
            const detailData = await detailRes.json()
            
            const screens = target.short_screenshots 
              ? target.short_screenshots.map(s => s.image).filter(img => img !== target.background_image).slice(0, 3) 
              : []

            const payload = {
              title: target.name,
              category: 'PC',
              size: 0,
              image: target.background_image || '',
              video: '',
              screenshots: screens,
              description: detailData.description_raw || '',
              minSpecs: '',
              setupGuide: '',
              isTrending: false,
              createdAt: new Date().toISOString()
            }

            await set(push(ref(db, 'games')), payload)
          }
        } catch (error) {}
        
        await new Promise(r => setTimeout(r, 400))
      }

      setImportProgress('')
      setIsBulkImporting(false)
      fetchDatabase()
      e.target.value = null
    }
    reader.readAsText(file)
  }

  const handleEdit = (g) => {
    setEditingId(g.id)
    setForm({ 
      title: g.title, 
      category: g.category || 'PC', 
      size: g.size, 
      image: g.image || '', 
      video: g.video || '', 
      screenshots: g.screenshots ? g.screenshots.join(', ') : '',
      description: g.description || '', 
      minSpecs: g.minSpecs || '', 
      setupGuide: g.setupGuide || '',
      isTrending: g.isTrending || false 
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTutorialEdit = (t) => {
    setEditingTutorialId(t.id)
    setTutorialForm({
      title: t.title,
      description: t.description,
      url: t.url
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', category: 'PC', size: '', image: '', video: '', screenshots: '', description: '', minSpecs: '', setupGuide: '', isTrending: false })
  }

  const handleCancelTutorialEdit = () => {
    setEditingTutorialId(null)
    setTutorialForm({ title: '', description: '', url: '' })
  }

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this game?')) {
      try {
        await remove(ref(db, `games/${id}`))
        if (editingId === id) handleCancelEdit()
        fetchDatabase()
      } catch (error) {}
    }
  }

  const handleTutorialDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await remove(ref(db, `tutorials/${id}`))
        if (editingTutorialId === id) handleCancelTutorialEdit()
        fetchTutorials()
      } catch (error) {}
    }
  }

  const toggleTrending = async (g) => {
    try {
      await update(ref(db, `games/${g.id}`), { isTrending: !g.isTrending })
      fetchDatabase()
    } catch (error) {}
  }

  const handleListScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setVisibleCount(prev => prev + 50)
    }
  }

  const optimizedGamesList = useMemo(() => {
    const lowerFilter = searchFilter.toLowerCase()
    return games
      .filter(game => game.title.toLowerCase().includes(lowerFilter))
      .sort((a, b) => {
        const dateA = a.createdAt || ""
        const dateB = b.createdAt || ""
        return dateA < dateB ? 1 : -1
      })
  }, [games, searchFilter])

  const visibleGames = useMemo(() => {
    return optimizedGamesList.slice(0, visibleCount)
  }, [optimizedGamesList, visibleCount])

  if (authLoading) return (
    <div className="flex-grow flex items-center justify-center bg-[#050505]">
      <Loader2 size={32} className="text-[#FFD600] animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row flex-grow bg-[#050505] w-full min-h-screen">
      
      <div className="w-full lg:w-72 bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-[#222] flex flex-col h-auto lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 shrink-0">
        <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#FFD600]" />
            <span className="text-xs font-black text-white uppercase tracking-widest">Admin</span>
          </div>
          <button onClick={() => signOut(auth)} className="text-neutral-500 hover:text-red-500 transition-colors">
            <Power size={16}/>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-2 border-b border-[#222]">
          <button 
            onClick={() => setActiveView('games')} 
            className={`w-full py-3 px-4 flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest transition-colors clip-button ${activeView === 'games' ? 'bg-[#FFD600] text-black shadow-[0_0_15px_rgba(255,214,0,0.2)]' : 'bg-[#111] text-white hover:bg-[#222] border border-[#222]'}`}
          >
            <Layers size={16} /> Game Assets
          </button>
          <button 
            onClick={() => setActiveView('trending')} 
            className={`w-full py-3 px-4 flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest transition-colors clip-button ${activeView === 'trending' ? 'bg-[#FFD600] text-black shadow-[0_0_15px_rgba(255,214,0,0.2)]' : 'bg-[#111] text-white hover:bg-[#222] border border-[#222]'}`}
          >
            <TrendingUp size={16} /> Trending Config
          </button>
          <button 
            onClick={() => setActiveView('tutorials')} 
            className={`w-full py-3 px-4 flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest transition-colors clip-button ${activeView === 'tutorials' ? 'bg-[#FFD600] text-black shadow-[0_0_15px_rgba(255,214,0,0.2)]' : 'bg-[#111] text-white hover:bg-[#222] border border-[#222]'}`}
          >
            <PlayCircle size={16} /> Support Tutorials
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        
        {activeView === 'games' && (
          <>
            <div className="w-full xl:w-1/2 p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-[#222] bg-[#050505] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-[#FFD600]" />
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">{editingId ? 'Edit Asset' : 'Add New Asset'}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => fileInputRef.current.click()} disabled={isBulkImporting} className="bg-[#111] border border-[#333] hover:border-[#FFD600] text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-colors">
                    {isBulkImporting ? <Loader2 size={12} className="animate-spin text-[#FFD600]" /> : <Upload size={12} className="text-[#FFD600]" />}
                    {isBulkImporting ? importProgress : 'Bulk Import (CSV/TXT)'}
                  </button>
                  <input type="file" accept=".csv, .txt" ref={fileInputRef} onChange={handleBulkImport} className="hidden" />
                </div>
              </div>

              <form onSubmit={executeCommit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Game Title</label>
                    <button type="button" onClick={handleAutoFill} disabled={isFetchingAPI} className="text-[9px] font-bold text-black uppercase tracking-widest px-3 py-1 bg-[#FFD600] hover:bg-white transition-colors rounded-sm flex items-center gap-1.5">
                      {isFetchingAPI ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      Auto-Fill
                    </button>
                  </div>
                  <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-2.5 text-xs font-bold text-white focus:outline-none rounded-sm" required/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Category</label>
                    <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-2.5 text-xs font-bold text-white focus:outline-none rounded-sm">
                      <option value="PC">PC</option>
                      <option value="PS4">PS4</option>
                      <option value="Multiplayer">Multiplayer</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Size (GB)</label>
                    <input type="number" step="0.1" value={form.size} onChange={e=>setForm({...form, size: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-2.5 text-xs font-bold text-white focus:outline-none rounded-sm" required/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Cover Image URL</label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input type="url" value={form.image} onChange={e=>setForm({...form, image: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] py-2.5 pl-9 pr-3 text-xs font-medium text-white focus:outline-none rounded-sm"/>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Video Trailer URL (MP4)</label>
                    <div className="relative">
                      <Video size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input type="url" value={form.video || ''} onChange={e=>setForm({...form, video: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] py-2.5 pl-9 pr-3 text-xs font-medium text-white focus:outline-none rounded-sm" placeholder="https://...mp4"/>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Additional Images (Comma separated URLs)</label>
                  <div className="relative">
                    <ImagePlus size={14} className="absolute left-3 top-3 text-neutral-600" />
                    <textarea value={form.screenshots} onChange={e=>setForm({...form, screenshots: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] py-2.5 pl-9 pr-3 text-xs font-medium text-white focus:outline-none rounded-sm min-h-[60px] resize-y" placeholder="https://img1.jpg, https://img2.jpg" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                  <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-3 text-xs font-medium text-white focus:outline-none min-h-[100px] resize-y rounded-sm" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Minimum Specs</label>
                  <textarea value={form.minSpecs} onChange={e=>setForm({...form, minSpecs: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-3 text-xs font-medium text-white focus:outline-none min-h-[80px] resize-y rounded-sm" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Setup Guide (URL or Instructions)</label>
                  <textarea value={form.setupGuide} onChange={e=>setForm({...form, setupGuide: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-3 text-xs font-medium text-white focus:outline-none min-h-[60px] resize-y rounded-sm" placeholder="https://youtube.com/... or text instructions" />
                </div>

                <div className="flex gap-3 mt-4 pt-6 border-t border-[#222]">
                  <button type="submit" disabled={isSubmitting || !form.title} className="flex-1 bg-[#FFD600] text-black py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors rounded-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    <Save size={14} /> {editingId ? 'Save Changes' : 'Add Game'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={handleCancelEdit} className="px-6 border border-[#444] bg-[#111] text-neutral-300 font-bold text-xs uppercase tracking-wider hover:bg-[#222] transition-colors rounded-sm">
                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>

            <div className="w-full xl:w-1/2 p-6 md:p-8 flex flex-col bg-[#050505]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-5 border-b border-[#222] gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <Database size={20} className="text-[#FFD600]" />
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Database</h3>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD600]" size={14} />
                  <input type="text" placeholder="Search entries..." value={searchInput} onChange={e=>setSearchInput(e.target.value)} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] py-2 pl-9 pr-3 text-xs font-medium text-white focus:outline-none rounded-sm"/>
                </div>
              </div>

              <div onScroll={handleListScroll} className="flex flex-col gap-2 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent', maxHeight: 'calc(100vh - 200px)' }}>
                {dataLoading ? <div className="text-sm font-bold text-[#FFD600] animate-pulse">Loading database...</div> : 
                 optimizedGamesList.length === 0 ? <div className="text-sm font-bold text-neutral-600">No entries found.</div> :
                 visibleGames.map(g => (
                  <div key={`mat-${g.id}`} className={`flex items-center justify-between p-3 border rounded-sm ${editingId === g.id ? 'border-[#FFD600] bg-[#111]' : 'border-[#222] bg-[#0a0a0a] hover:border-[#444]'} transition-colors gap-3`}>
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 bg-[#111] border border-[#333] shrink-0 rounded-sm overflow-hidden">
                        {g.image ? <img src={g.image} loading="lazy" className="w-full h-full object-cover" alt=""/> : null}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate">{g.title}</span>
                        <span className="text-[10px] font-medium text-neutral-500 uppercase">{g.category} • {g.size}GB</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={()=>handleEdit(g)} className="w-8 h-8 flex items-center justify-center border border-[#333] text-neutral-400 hover:text-black hover:bg-[#FFD600] hover:border-[#FFD600] bg-[#111] transition-colors rounded-sm"><Edit2 size={14}/></button>
                      <button onClick={()=>handleDelete(g.id)} className="w-8 h-8 flex items-center justify-center border border-[#333] text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 bg-[#111] transition-colors rounded-sm"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeView === 'trending' && (
          <div className="w-full p-6 md:p-8 flex flex-col bg-[#050505] overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#222] pb-5">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-[#FFD600]" />
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Trending Configuration</h3>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD600]" size={14} />
                <input type="text" placeholder="Search games to feature..." value={searchInput} onChange={e=>setSearchInput(e.target.value)} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] py-2 pl-9 pr-3 text-xs font-medium text-white focus:outline-none rounded-sm"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" onScroll={handleListScroll} style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
              {visibleGames.map(g => (
                <button 
                  key={`trend-${g.id}`} 
                  onClick={() => toggleTrending(g)} 
                  className={`flex items-center gap-4 text-left p-3 border rounded-sm transition-colors ${g.isTrending ? 'bg-[#FFD600]/10 border-[#FFD600]' : 'bg-[#111] border-[#222] hover:border-[#444]'}`}
                >
                  <div className="w-12 h-12 bg-[#0a0a0a] shrink-0 border border-[#333] rounded-sm overflow-hidden">
                    {g.image && <img src={g.image} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex flex-col min-w-0 flex-grow">
                    <span className={`text-xs font-bold uppercase tracking-wider truncate ${g.isTrending ? 'text-[#FFD600]' : 'text-white'}`}>{g.title}</span>
                    <span className="text-[9px] font-medium text-neutral-500 uppercase">{g.category}</span>
                  </div>
                  {g.isTrending ? <CheckSquare size={18} className="text-[#FFD600] shrink-0" /> : <Square size={18} className="text-neutral-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeView === 'tutorials' && (
          <>
            <div className="w-full xl:w-1/2 p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-[#222] bg-[#050505] overflow-y-auto">
              <div className="flex items-center mb-8 gap-3">
                <PlayCircle size={20} className="text-[#FFD600]" />
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">{editingTutorialId ? 'Edit Tutorial' : 'Add New Tutorial'}</h3>
              </div>

              <form onSubmit={executeTutorialCommit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tutorial Title</label>
                  <input type="text" value={tutorialForm.title} onChange={e=>setTutorialForm({...tutorialForm, title: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-2.5 text-xs font-bold text-white focus:outline-none rounded-sm" required/>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">YouTube URL</label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input type="url" value={tutorialForm.url} onChange={e=>setTutorialForm({...tutorialForm, url: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] py-2.5 pl-9 pr-3 text-xs font-medium text-white focus:outline-none rounded-sm" required placeholder="https://youtube.com/watch?v=..."/>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                  <textarea value={tutorialForm.description} onChange={e=>setTutorialForm({...tutorialForm, description: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#FFD600] p-3 text-xs font-medium text-white focus:outline-none min-h-[100px] resize-y rounded-sm" required />
                </div>

                <div className="flex gap-3 mt-4 pt-6 border-t border-[#222]">
                  <button type="submit" disabled={isSubmitting || !tutorialForm.title || !tutorialForm.url} className="flex-1 bg-[#FFD600] text-black py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors rounded-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    <Save size={14} /> {editingTutorialId ? 'Save Changes' : 'Add Tutorial'}
                  </button>
                  {editingTutorialId && (
                    <button type="button" onClick={handleCancelTutorialEdit} className="px-6 border border-[#444] bg-[#111] text-neutral-300 font-bold text-xs uppercase tracking-wider hover:bg-[#222] transition-colors rounded-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="w-full xl:w-1/2 p-6 md:p-8 flex flex-col bg-[#050505]">
              <div className="flex items-center mb-8 pb-5 border-b border-[#222] gap-3">
                <Database size={20} className="text-[#FFD600]" />
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Tutorial List</h3>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                {tutorials.length === 0 ? <div className="text-sm font-bold text-neutral-600">No tutorials found.</div> :
                 tutorials.map((t, idx) => (
                  <div key={t.id} className={`flex items-center justify-between p-3 border rounded-sm ${editingTutorialId === t.id ? 'border-[#FFD600] bg-[#111]' : 'border-[#222] bg-[#0a0a0a] hover:border-[#444]'} transition-colors gap-3`}>
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-8 h-8 bg-[#111] flex items-center justify-center border border-[#333] shrink-0 rounded-sm text-[#FFD600] font-black text-xs">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate">{t.title}</span>
                        <span className="text-[10px] font-medium text-neutral-500 truncate">{t.url}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={()=>handleTutorialEdit(t)} className="w-8 h-8 flex items-center justify-center border border-[#333] text-neutral-400 hover:text-black hover:bg-[#FFD600] hover:border-[#FFD600] bg-[#111] transition-colors rounded-sm"><Edit2 size={14}/></button>
                      <button onClick={()=>handleTutorialDelete(t.id)} className="w-8 h-8 flex items-center justify-center border border-[#333] text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 bg-[#111] transition-colors rounded-sm"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}