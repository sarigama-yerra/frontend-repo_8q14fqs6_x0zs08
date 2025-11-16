import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ChevronRight, ArrowRight, User, Menu, CheckCircle2, Loader2, Images } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useInr(n) {
  return useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0), [n])
}

function Navbar({ onOpenAuth, cartCount }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="font-extrabold tracking-tight text-xl">ChromaPrint</a>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          <a href="#shop" className="hover:text-black">Shop Printers</a>
          <a href="#service" className="hover:text-black">Custom Printing</a>
          <a href="#gallery" className="hover:text-black">Gallery</a>
          <a href="#account" className="hover:text-black">Account</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenAuth} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white text-sm">
            <User size={16}/> Login
          </button>
          <a href="#checkout" className="relative inline-flex items-center px-3 py-2 rounded-full border">
            <ShoppingCart size={18}/>
            {cartCount>0 && <span className="absolute -top-1 -right-1 text-[10px] bg-black text-white rounded-full px-1.5 py-0.5">{cartCount}</span>}
          </a>
          <button className="md:hidden" onClick={()=>setOpen(v=>!v)}><Menu/></button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="md:hidden overflow-hidden border-t border-black/5">
            <div className="px-4 py-3 space-y-2 text-sm">
              <a href="#shop" className="block">Shop Printers</a>
              <a href="#service" className="block">Custom Printing</a>
              <a href="#gallery" className="block">Gallery</a>
              <a href="#account" className="block">Account</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Hero() {
  useEffect(()=>{
    // light parallax on scroll
    const onScroll = () => {
      const y = window.scrollY
      const hero = document.getElementById('hero-graphic')
      if (hero) hero.style.transform = `translateY(${y*0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])
  return (
    <section id="home" className="pt-28 pb-24 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            High‑Fidelity 3D Printing — Every Shade, Every Story.
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-xl">
            Skin‑tone aware printing that celebrates diversity. Shop premium printers or design and order custom prints with instant estimates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shop" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white">
              Shop Printers <ArrowRight size={18}/>
            </a>
            <a href="#service" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border">
              Custom Printing Service <ChevronRight size={18}/>
            </a>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
            <CheckCircle2 className="text-emerald-500" size={18}/> Inclusive palette • Precise color profiling • Friendly support
          </div>
        </div>
        <div className="relative h-[340px] sm:h-[420px] lg:h-[520px]">
          <div id="hero-graphic" className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,#fde68a,transparent_60%),radial-gradient(circle_at_80%_60%,#fca5a5,transparent_55%),radial-gradient(circle_at_60%_10%,#93c5fd,transparent_60%)] shadow-2xl"></div>
        </div>
      </div>
    </section>
  )
}

function Shop({ onAddToCart }) {
  const [items, setItems] = useState([])
  useEffect(()=>{
    fetch(`${BACKEND}/api/printers`).then(r=>r.json()).then(d=>setItems(d.items||[])).catch(()=>setItems([]))
  },[])
  return (
    <section id="shop" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Shop Printers</h2>
          <p className="text-sm text-gray-600">Premium, calibrated for skin‑tone accuracy</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p,i)=> <ProductCard key={i} product={p} onAddToCart={()=>onAddToCart(p)} />)}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, onAddToCart }) {
  const price = useInr(product.price_inr)
  return (
    <motion.div whileHover={{y:-6}} className="rounded-2xl border p-4 bg-white shadow-sm">
      <div className="aspect-video rounded-xl bg-gray-50 overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>
          <div className="font-semibold">{price}</div>
        </div>
        {product.features && (
          <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
            {product.features.slice(0,3).map((f,i)=>(<li key={i}>{f}</li>))}
          </ul>
        )}
        <div className="mt-4 flex gap-2">
          <button onClick={onAddToCart} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm">
            <ShoppingCart size={16}/> Add to cart
          </button>
          <a href="#service" className="px-4 py-2 rounded-full border text-sm">Custom Print</a>
        </div>
      </div>
    </motion.div>
  )
}

function Estimator({ onLoginRequired, authToken }) {
  const [inputs, setInputs] = useState({ length_mm: 80, width_mm: 60, height_mm: 40, material: 'PLA', finish: 'Standard', complexity: 1.0, infill: 0.2 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [notes, setNotes] = useState('')

  const estimate = async () => {
    setLoading(true)
    setResult(null)
    try{
      const res = await fetch(`${BACKEND}/api/estimate`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(inputs) })
      const data = await res.json()
      setResult(data)
    }catch(e){
      setResult({ error: 'Failed to estimate' })
    }finally{ setLoading(false) }
  }

  const submitQuote = async () => {
    if(!authToken){ onLoginRequired(); return }
    setLoading(true)
    try{
      const res = await fetch(`${BACKEND}/api/quote`, { method:'POST', headers:{ 'Content-Type':'application/json', 'x-demo-token': authToken }, body: JSON.stringify({ email: 'demo@chromaprint.in', name:'Chroma Guest', estimate: result, notes }) })
      const data = await res.json()
      setResult(prev => ({...prev, submission: data}))
    }catch(e){
      setResult(prev => ({...prev, submission: { ok:false, message:'Failed to submit' }}))
    }finally{ setLoading(false) }
  }

  return (
    <section id="service" className="py-16 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Custom 3D Printing Service</h2>
          <p className="text-sm text-gray-600">Instant AI estimate in INR</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-4">
            <div className="grid grid-cols-2 gap-3">
              {['length_mm','width_mm','height_mm'].map((k)=> (
                <label key={k} className="text-sm">
                  <div className="text-gray-600">{k.replace('_mm',' (mm)')}</div>
                  <input type="number" min="1" value={inputs[k]} onChange={e=>setInputs({...inputs,[k]:Number(e.target.value)})} className="mt-1 w-full rounded-md border px-3 py-2" />
                </label>
              ))}
              <label className="text-sm">
                <div className="text-gray-600">Material</div>
                <select value={inputs.material} onChange={e=>setInputs({...inputs, material:e.target.value})} className="mt-1 w-full rounded-md border px-3 py-2">
                  {['PLA','ABS','Resin','Nylon','PETG'].map(m=> <option key={m}>{m}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <div className="text-gray-600">Finish</div>
                <select value={inputs.finish} onChange={e=>setInputs({...inputs, finish:e.target.value})} className="mt-1 w-full rounded-md border px-3 py-2">
                  {['Standard','Smooth','High-Gloss','Matte'].map(m=> <option key={m}>{m}</option>)}
                </select>
              </label>
              <label className="text-sm col-span-2">
                <div className="text-gray-600">Complexity (0.5–2.0)</div>
                <input type="range" min="0.5" max="2" step="0.1" value={inputs.complexity} onChange={e=>setInputs({...inputs, complexity:Number(e.target.value)})} className="w-full" />
              </label>
              <label className="text-sm col-span-2">
                <div className="text-gray-600">Infill (0.05–1.0)</div>
                <input type="range" min="0.05" max="1" step="0.05" value={inputs.infill} onChange={e=>setInputs({...inputs, infill:Number(e.target.value)})} className="w-full" />
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={estimate} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <ChevronRight size={16}/>} Estimate
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">Estimate considers volume, material rate, machine time, finishing, and skin‑tone color matching. Change any input and re‑estimate instantly.</p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            {!result && !loading && (
              <div className="h-full min-h-[220px] grid place-items-center text-gray-500">Run an estimate to see pricing.</div>
            )}
            {loading && (
              <div className="h-full min-h-[220px] grid place-items-center text-gray-500"><Loader2 className="animate-spin mr-2"/>Thinking…</div>
            )}
            {result && !loading && (
              <div>
                <h3 className="text-lg font-semibold">Estimated Cost</h3>
                <p className="text-3xl font-extrabold mt-1">{useInr(result.estimated_cost)}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <Info label="Volume (cm³)" value={result.breakdown?.volume_cm3}/>
                  <Info label="Material (₹/cm³)" value={result.breakdown?.material_rate_inr_per_cm3}/>
                  <Info label="Machine (hrs)" value={result.breakdown?.machine_time_hours}/>
                  <Info label="Finish x" value={result.breakdown?.finish_multiplier}/>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-gray-700">Notes (optional)</label>
                  <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" rows={3} placeholder="Tell us about surface finish, skin tone, or use case" />
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={submitQuote} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600 text-white">Submit for Final Quote</button>
                </div>
                {result.submission && (
                  <p className={`mt-3 text-sm ${result.submission.ok? 'text-emerald-600':'text-red-600'}`}>{result.submission.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Info({label, value}){ return (
  <div className="rounded-lg border p-3 bg-gray-50">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="font-semibold">{value ?? '—'}</div>
  </div>
)}

function SwatchGallery(){
  const swatches = [
    { name: 'Ivory 10', hex: '#F5E9DA' },
    { name: 'Almond 20', hex: '#EAD8C1' },
    { name: 'Honey 30', hex: '#D8B999' },
    { name: 'Caramel 40', hex: '#C89A75' },
    { name: 'Bronze 50', hex: '#A8715A' },
    { name: 'Cocoa 60', hex: '#7B4B36' },
    { name: 'Espresso 70', hex: '#593827' },
    { name: 'Onyx 80', hex: '#3C2A20' },
  ]
  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2"><Images size={22}/> Skin‑tone Swatches</h2>
          <p className="text-sm text-gray-600">Curated for light backgrounds • calibrated references</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {swatches.map((s,i)=> (
            <div key={i} className="group">
              <div className="aspect-square rounded-2xl border shadow-sm" style={{background:s.hex}} aria-label={`${s.name} swatch`} />
              <div className="mt-2 text-xs text-gray-700 font-medium">{s.name}</div>
              <div className="text-[11px] text-gray-500">{s.hex}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SamplePrints(){
  // Light‑background friendly imagery (Unsplash, royalty‑free), intentionally bright backdrops
  const items = [
    {
      title: 'Textured Vase',
      src: 'https://images.unsplash.com/photo-1730195986404-2749e395935e?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxUZXh0dXJlZCUyMFZhc2V8ZW58MHwwfHx8MTc2MzMzNjIwOHww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      desc: 'PLA • Matte finish • Sand‑beige tone'
    },
    {
      title: 'Organic Sculpture',
      src: 'https://images.unsplash.com/photo-1594514094203-aae729c9e7a9?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxPcmdhbmljJTIwU2N1bHB0dXJlfGVufDB8MHx8fDE3NjMzMzYyMDh8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      desc: 'Resin • High‑gloss • Warm ivory'
    },
    {
      title: 'Geometric Lamp',
      src: 'https://images.unsplash.com/photo-1628176679578-d9600421d8e7?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxHZW9tZXRyaWMlMjBMYW1wfGVufDB8MHx8fDE3NjMzMzYyMDl8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      desc: 'PLA • Smooth • Honey 30'
    },
    {
      title: 'Precision Prototype',
      src: 'https://images.unsplash.com/photo-1742971366169-6efb57949d56?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxQcmVjaXNpb24lMjBQcm90b3R5cGV8ZW58MHwwfHx8MTc2MzMzNjIwOXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      desc: 'Nylon • Standard • Light studio'
    },
    {
      title: 'Minimal Figurine',
      src: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=1200&auto=format&fit=crop',
      desc: 'Resin • Gloss • Neutral background'
    },
    {
      title: 'Architectural Mock',
      src: 'https://images.unsplash.com/photo-1562405393-e53fae44ed8f?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBcmNoaXRlY3R1cmFsJTIwTW9ja3xlbnwwfDB8fHwxNzYzMzM2MjEwfDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      desc: 'PETG • Smooth • Bright desk'
    },
  ]
  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Sample Prints</h2>
          <p className="text-sm text-gray-600">Shot on light backgrounds for premium clarity</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, i)=> (
            <motion.figure key={i} whileHover={{y:-4}} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-gray-50">
                <img src={it.src} alt={it.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <figcaption className="p-4">
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-gray-600">{it.desc}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function AuthModal({ open, onClose, onAuthenticated }){
  const [email, setEmail] = useState('ankitmht42@gmail.com')
  const [password, setPassword] = useState('Ankitmehta007')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const res = await fetch(`${BACKEND}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
      if(!res.ok){ throw new Error('Invalid credentials') }
      const data = await res.json()
      onAuthenticated(data.token, data.user)
      onClose()
    }catch(err){ setError('Login failed. Use provided demo credentials.') }
    finally{ setLoading(false) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Welcome back</h3>
              <button onClick={onClose} className="text-gray-500">Close</button>
            </div>
            <p className="mt-1 text-sm text-gray-600">Use the demo login to submit quotes and add to cart.</p>
            <form onSubmit={login} className="mt-4 space-y-3">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" type="email" required/>
              </div>
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" type="password" required/>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-black text-white">
                {loading && <Loader2 className="animate-spin" size={16}/>} Log in
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-500">No real emails are sent in this demo.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Account({ user }){
  const [items, setItems] = useState([])
  useEffect(()=>{
    if(!user) return
    fetch(`${BACKEND}/api/account/orders?email=${encodeURIComponent(user.email)}`).then(r=>r.json()).then(d=>setItems(d.items||[])).catch(()=>setItems([]))
  },[user])
  return (
    <section id="account" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Account</h2>
        {!user && <p className="mt-2 text-gray-600">Log in when you submit a quote to see your history here.</p>}
        {user && (
          <div className="mt-4">
            <p className="text-gray-700">Welcome, {user.name || 'Demo User'} ({user.email})</p>
            <div className="mt-4 grid gap-3">
              {items.length===0 && <p className="text-gray-600">No orders yet. Submit a quote to see it here.</p>}
              {items.map((o,i)=> (
                <div key={i} className="rounded-xl border p-4 bg-gray-50">
                  <div className="font-semibold">Submitted • {new Date(o.created_at).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Estimated: ₹{o.estimate?.estimated_cost}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function App(){
  const [cart, setCart] = useState([])
  const [authOpen, setAuthOpen] = useState(false)
  const [auth, setAuth] = useState({ token: null, user: null })

  const addToCart = (item) => {
    if(!auth.token){ setAuthOpen(true); return }
    setCart(prev=>[...prev, item])
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onOpenAuth={()=>setAuthOpen(true)} cartCount={cart.length} />
      <main>
        <Hero />
        <Shop onAddToCart={addToCart} />
        <SamplePrints />
        <SwatchGallery />
        <Estimator onLoginRequired={()=>setAuthOpen(true)} authToken={auth.token} />
        <Account user={auth.user} />
      </main>
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onAuthenticated={(token,user)=>setAuth({token,user})} />
      <footer className="py-8 border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-600">© {new Date().getFullYear()} ChromaPrint — Inclusive, high‑fidelity 3D printing. Demo only; emails are simulated.</div>
      </footer>
    </div>
  )
}
