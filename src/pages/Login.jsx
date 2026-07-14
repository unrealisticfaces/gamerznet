import { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Lock, Shield, Loader2, User } from 'lucide-react'
import logo from '../images/gamerznet.webp'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err) {
      setError('ACCESS DENIED: INVALID CREDENTIALS.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-[#050505]">
      
      <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-[#111]">
        <div className="absolute inset-0 bg-anime-stripes opacity-50 z-0"></div>
        <div className="relative z-10 flex flex-col items-start">
          <div className="bg-[#FFD600] text-black px-3 py-1 flex items-center gap-2 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest">System Admin</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white uppercase leading-[0.85] mb-6">
            MAINFRAME <br/><span className="text-[#FFD600]">UPLINK.</span>
          </h1>
          <p className="text-xs font-black text-neutral-500 uppercase tracking-widest border-l-2 border-[#FFD600] pl-4 bg-[#111]/50 py-3 max-w-sm">
            AUTHORIZED PERSONNEL ONLY. SYSTEM ACTIVITIES ARE LOGGED AND MONITORED BY PROTOCOL.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-[#0a0a0a] relative">
        <div className="w-full max-w-sm mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-[#222]">
            <Shield size={24} className="text-[#FFD600]" />
            <span className="text-2xl font-display font-bold text-white uppercase tracking-wider">Authentication</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Admin_ID</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD600]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] focus:border-[#FFD600] py-4 pl-12 pr-4 text-xs font-bold text-white focus:outline-none transition-colors clip-button placeholder-neutral-700 uppercase tracking-widest"
                  placeholder="ROOT@GAMERZNET.LOCAL"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Security_Key</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD600]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] focus:border-[#FFD600] py-4 pl-12 pr-4 text-xs font-bold text-white focus:outline-none transition-colors clip-button placeholder-neutral-700 tracking-widest"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border-l-2 border-red-500 p-3 clip-card">
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">
                  &gt; {error}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD600] text-black py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-colors disabled:opacity-50 mt-6 clip-button"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
              {loading ? 'VERIFYING...' : 'INITIATE_HANDSHAKE'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}