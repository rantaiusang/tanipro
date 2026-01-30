'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ArrowRight, Users, Factory, CheckCircle, Menu, X, Shield, Truck, Store, Package, Clock, ShoppingCart, Award, MapPin, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // State untuk produk
  const [products, setProducts] = useState([])

  const heroRef = useRef(null)
  const b2bRef = useRef(null)
  const b2cRef = useRef(null)
  const stockRef = useRef(null)
  const valueRef = useRef(null)
  const ctaRef = useRef(null)

  // --- AMBIL DATA PRODUK ---
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('taniproproducts')
        .select('*')
        .order('created_at', { ascending: false }) 

      if (error) {
        console.error("Error fetching products:", error)
      } else {
        setProducts(data)
      }
    }

    fetchProducts()

    // Realtime listener
    const channel = supabase
      .channel('public:taniproproducts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'taniproproducts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProducts((prev) => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setProducts((prev) => prev.map((prod) => prod.id === payload.new.id ? payload.new : prod))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // --- AUTH ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        window.location.href = '/dashboard'
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [supabase])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
  }

  useEffect(() => {
    if (loading) return
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, observerOptions)
    const elements = [heroRef.current, b2bRef.current, b2cRef.current, stockRef.current, valueRef.current, ctaRef.current]
    elements.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [loading])

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-stone-400 px-4">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-stone-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <span className="font-light text-xl tracking-wide">Memuat Sistem...</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050505] text-stone-300 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden flex flex-col">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 h-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="flex justify-between h-full items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-lime-500 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform duration-300">
                T
              </div>
              <div className="flex flex-col justify-center leading-none">
                <h1 className="font-bold text-xl tracking-tight text-white">TaniPro</h1>
                <span className="text-[9px] text-emerald-500 uppercase tracking-[0.2em] font-bold">Aggregator & Supply Chain</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
               <button onClick={handleLogin} className="px-8 py-2.5 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/50 transition-all duration-300">Login Partner</button>
            </div>
            <button className="md:hidden p-3 -mr-3 text-stone-400 hover:bg-white/5 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-fade-in">
            <div className="px-6 py-8 flex flex-col gap-4">
               <button onClick={handleLogin} className="w-full text-left px-6 py-4 rounded-2xl bg-emerald-600 text-white font-medium flex items-center justify-between active:scale-95 transition-transform">Login Partner <ArrowRight className="w-5 h-5 opacity-70" /></button>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="fade-in-section pt-32 pb-24 px-6 relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[#050505]">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-lime-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide mb-8">
               <Shield className="w-3 h-3" />
               TERPERCAYA & BERSERTIFIKAT
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
              Solusi Pasar <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
                Ekspor & Domestik
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-400 mb-10 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0">
              Kami adalah penadah modern yang menghubungkan ribuan petani langsung ke restoran, hotel, dan konsumen. Kelola stok, jamin kualitas, dan kirim langsung.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 w-full">
              <button onClick={handleLogin} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-900/40 transition-all duration-300 flex items-center justify-center gap-2 group">
                Mulai Kerjasama <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => window.location.href='#stok'} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 text-white border border-white/10 font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                Lihat Katalog <Package className="w-5 h-5 text-emerald-500" />
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 aspect-[4/3] border border-white/10">
               <img 
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2070&auto=format&fit=crop" 
                alt="Gudang Distribusi TaniPro" 
                className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 bg-black/70 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-600/20">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-white font-bold">Operasional Penuh</div>
                            <div className="text-stone-400 text-xs">Jaringan Logistik Nasional</div>
                        </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION KATALOG HANYA 3 PRODUK --- */}
      <section id="stok" ref={stockRef} className="fade-in-section py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Katalog Hasil Panen</h2>
                    <p className="text-stone-400 text-lg">Stok langsung dari petani mitra kami. Update secara real-time.</p>
                </div>
                <button onClick={handleLogin} className="mt-4 md:mt-0 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300">
                    Login untuk Lihat Harga
                </button>
            </div>

            {/* Grid Produk */}
            <div className="grid md:grid-cols-3 gap-8">
                {products.slice(0, 3).map((product) => {
                    const isReady = product.is_available === true && product.stock > 0;
                    const statusColor = isReady ? "bg-emerald-500 text-white" : "bg-orange-500/20 text-orange-400 border-orange-500/20 backdrop-blur-md";
                    const statusText = isReady ? "READY STOCK" : product.status || "BELUM PANEN";
                    const StatusIcon = isReady ? CheckCircle : Clock;
                    const btnText = !isReady && product.status === "Belum Panen" ? "Booking" : "Pesan";
                    const imageFilter = !isReady ? "grayscale opacity-80" : "";
                    
                    return (
                        <div key={product.id} className="group p-6 rounded-3xl bg-[#121212] border border-white/5 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500">
                            <div className="relative rounded-2xl overflow-hidden aspect-video mb-6">
                                <img src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c5c4e521d5?q=80&w=2070'} alt={product.name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageFilter}`} />
                                <div className="absolute top-3 right-3 ${statusColor} text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                    <StatusIcon className="w-3 h-3" /> {statusText}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                            <p className="text-stone-400 text-sm mb-6 h-12 overflow-hidden text-ellipsis line-clamp-2">{product.description}</p>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <div>
                                    <div className={`${isReady ? 'text-emerald-400' : 'text-orange-400'} font-bold text-lg`}>
                                        {isReady ? `Tersedia ${product.stock} ${product.unit}` : `Pre-Order`}
                                    </div>
                                    {!isReady && <div className="text-xs text-stone-500 mt-1">{product.description}</div>}
                                </div>
                                
                                <button onClick={handleLogin} className="text-white text-sm hover:text-emerald-400 font-bold flex items-center gap-1 transition-colors bg-white/5 px-3 py-2 rounded-lg hover:bg-emerald-600">
                                    {btnText} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Kami Mengelola Semuanya</h2>
                <p className="text-stone-400 text-lg">Anda fokus menanam, biarkan kami yang urus pasarnya.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="fade-in-section group p-8 rounded-3xl bg-[#121212] border border-white/5 hover:border-emerald-500/30 hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Jaminan Kualitas</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">Tim kami memeriksa setiap panen di lapangan sebelum dikirim ke pembeli.</p>
                </div>
                <div className="fade-in-section group p-8 rounded-3xl bg-[#121212] border border-white/5 hover:border-blue-500/30 hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-500 delay-100">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <Truck className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Logistik Terpadu</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">Armada pengiriman siap antar panen dari desa ke kota.</p>
                </div>
                <div className="fade-in-section group p-8 rounded-3xl bg-[#121212] border border-white/5 hover:border-orange-500/30 hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-orange-900/20 transition-all duration-500 delay-200">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Pembayaran Pasti</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">Petani dibayar lunas tepat waktu setelah barang diterima.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- MODEL BISNIS (B2B & B2C) --- */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* B2B Card */}
                <div ref={b2bRef} className="fade-in-section p-10 rounded-[3rem] bg-[#121212] border border-white/10 shadow-xl shadow-black/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-8 border border-blue-500/20"><Factory className="w-8 h-8" /></div>
                        <h3 className="text-3xl font-bold text-white mb-4">Supply Chain B2B</h3>
                        <p className="text-stone-400 mb-8 leading-relaxed">Solusi supply chain untuk restoran, hotel, dan industri pengolahan. Volume besar, standar internasional.</p>
                        
                        {/* Statistik Kecil */}
                        <div className="flex items-center gap-6 mb-6 text-xs font-bold text-stone-500">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-500" /> 30 Kota</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-blue-500" /> ISO Certified</span>
                        </div>

                        <ul className="space-y-4">
                            {['Kontrak Tahunan', 'Kontrol Kualitas Ketat', 'Pengiriman Reguler'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-stone-300 font-medium"><CheckCircle className="w-5 h-5 text-blue-500" /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* B2C Card */}
                <div ref={b2cRef} className="fade-in-section p-10 rounded-[3rem] bg-gradient-to-br from-emerald-900 to-[#050505] text-white shadow-xl shadow-emerald-900/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-emerald-400 flex items-center justify-center mb-8 border border-white/10"><Store className="w-8 h-8" /></div>
                        <h3 className="text-3xl font-bold text-white mb-4">Penjualan B2C</h3>
                        <p className="text-emerald-100 mb-8 leading-relaxed">Hasil panen yang tidak laku B2B kami distribusikan ke pasar ritel. Warung, supermarket, hingga konsumen akhir.</p>
                        
                        {/* Statistik Kecil */}
                        <div className="flex items-center gap-6 mb-6 text-xs font-bold text-emerald-200">
                            <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4 text-emerald-400" /> 10rb+ Transaksi</span>
                            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-emerald-400" /> Top Seller</span>
                        </div>

                        <ul className="space-y-4">
                            {['Harga Konsumen Wajar', 'Kemasan Retail', 'Dukungan Pi Network'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-emerald-50 font-medium"><CheckCircle className="w-5 h-5 text-emerald-400" /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- TRUST SECTION --- */}
      <section ref={valueRef} className="fade-in-section py-32 relative overflow-hidden text-white">
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2070&auto=format&fit=crop" 
                alt="Kemitraan Petani" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#050505]/95 mix-blend-multiply"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Mitra Petani <br/>Prioritas Kami.</h2>
                <p className="text-lg text-stone-300 mb-8 font-medium leading-relaxed">
                    Kami bangun hubungan jangka panjang dengan kelompok tani. Memberikan bibit unggul, panduan teknis, dan jaminan serap panen. TaniPro adalah partner bisnis Anda.
                </p>
                <div className="grid grid-cols-3 gap-8 mt-12">
                    <div>
                        <div className="text-4xl font-bold text-white">500+</div>
                        <div className="text-sm text-stone-400 uppercase tracking-widest font-semibold mt-2">Mitra Tani</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white">30+</div>
                        <div className="text-sm text-stone-400 uppercase tracking-widest font-semibold mt-2">Kota Jangkauan</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white">100%</div>
                        <div className="text-sm text-stone-400 uppercase tracking-widest font-semibold mt-2">Jaminan Serap</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section ref={ctaRef} className="fade-in-section py-24 px-6">
        <div className="max-w-5xl mx-auto bg-[#0a0a0a] rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-black/50 relative overflow-hidden border border-white/10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent"></div>
            
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Punya Hasil Panen?</h2>
                <p className="text-stone-400 text-lg mb-10 max-w-2xl mx-auto">
                    Jangan biarkan hasil panen Anda membusuk atau dijual murah. Bergabung dengan TaniPro sekarang untuk jaminan harga dan pasar yang pasti.
                </p>
                <button onClick={handleLogin} className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-900/40">
                    Ajukan Penawaran Panen
                </button>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-lime-500 text-white rounded-xl flex items-center justify-center font-bold">
                    T
               </div>
               <div className="text-left">
                 <h1 className="font-bold text-xl text-white">TaniPro</h1>
                 <p className="text-[10px] text-stone-500 uppercase tracking-widest">Aggregator Pertanian</p>
               </div>
            </div>
            <div className="text-center md:text-right">
                <p className="text-sm text-stone-500">© {new Date().getFullYear()} TaniPro Indonesia.</p>
                <p className="text-xs text-stone-600 mt-1">Supply Chain & Aggregator Solution.</p>
            </div>
        </div>
      </footer>

      {/* --- STYLES --- */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        body { -webkit-tap-highlight-color: transparent; background-color: #050505; color: #d6d3d1; }
        
        .fade-in-section { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1); will-change: opacity, transform; }
        .fade-in-section.visible { opacity: 1; transform: translateY(0); }
        
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }

        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>

    </div>
  )
}
