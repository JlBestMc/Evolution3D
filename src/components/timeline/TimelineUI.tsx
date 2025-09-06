
import { useEffect, useMemo, useRef } from "react"
import { eras } from "../../data/eras"

interface TimelineUIProps {
  currentEra: string
  setCurrentEra: (eraId: string) => void
  loading?: boolean
}

export default function TimelineUI({ currentEra, setCurrentEra, loading = false }: TimelineUIProps) {
  // Indice seguro (si no se encuentra el id, forzamos 0)
  const index = useMemo(() => {
    const i = eras.findIndex(e => e.id === currentEra)
    return i < 0 ? 0 : i
  }, [currentEra])

  // Si el id actual no existe (por espacios, edición manual, etc.) lo normalizamos al primero
  useEffect(() => {
    if (!eras.some(e => e.id === currentEra)) {
      console.warn('[TimelineUI] currentEra inválido, restaurando al primero:', currentEra)
      setCurrentEra(eras[0].id)
    }
  }, [currentEra, setCurrentEra])
  const portalRef = useRef<HTMLDivElement | null>(null)

  const handlePrev = () => {
    if (loading) return
    if (index > 0) {
      const target = eras[index - 1].id
      console.log('[TimelineUI] Prev ->', target)
      setCurrentEra(target)
    }
  }
  const handleNext = () => {
    if (loading) return
    if (index < eras.length - 1) {
      const target = eras[index + 1].id
      console.log('[TimelineUI] Next ->', target)
      setCurrentEra(target)
    }
  }

  // Teclado ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Pre-cargar imágenes siguientes / previas para crossfade más suave
  useEffect(() => {
    [eras[index - 1], eras[index + 1]].forEach(e => {
      if (e?.image) {
        const img = new Image(); img.src = e.image
      }
    })
  }, [index])

  const era = eras[index]
  const color = era.color || '#ffffff'

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 select-none">
      {/* Portal principal */}
      <div
        ref={portalRef}
        className="relative w-60 h-60 rounded-full overflow-hidden shadow-[0_0_25px_-5px_rgba(0,0,0,0.6)] border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center"
        style={{ boxShadow: `0 0 40px -8px ${color}AA` }}
      >
        <img
          key={era.id}
          src={era.image}
          alt={era.name}
          className="absolute inset-0 w-full h-full object-cover opacity-90 animate-fadeIn"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative text-center text-white drop-shadow">
          <h2 className="text-xl font-semibold tracking-wide">{era.name}</h2>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-6">
  <button onClick={handlePrev} disabled={index === 0 || loading} className="px-4 py-2 text-white bg-black/50 rounded-lg disabled:opacity-30">←</button>
        <div className="flex gap-2">
          {eras.map((e, i) => (
            <button
              key={e.id}
              onClick={() => !loading && setCurrentEra(e.id)}
              className={`w-4 h-4 rounded-full border ${i === index ? 'bg-white border-white' : 'border-white/40 bg-white/10 hover:bg-white/30'} transition-colors`}
              aria-label={e.name}
            />
          ))}
        </div>
        <button onClick={handleNext} disabled={index === eras.length - 1 || loading} className="px-4 py-2 text-white bg-black/50 rounded-lg disabled:opacity-30">→</button>
      </div>

      {/* Miniaturas horizontales (opcional) */}
      <div className="mt-2 flex gap-3">
        {eras.map((e, i) => (
          <div
            key={e.id}
            className={`w-16 h-12 rounded-md overflow-hidden ring-1 cursor-pointer relative ${i === index ? 'ring-white/80 ring-2 shadow-lg' : 'ring-white/20 opacity-60 hover:opacity-90'}`}
            onClick={() => !loading && setCurrentEra(e.id)}
          >
            <img src={e.background} alt={e.name} className="w-full h-full object-cover" draggable={false} />
            {i === index && <div className="absolute inset-0 bg-black/20" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// Animación simple CSS (se puede mover a un CSS global si prefieres)
// .animate-fadeIn { animation: fadeIn 0.6s ease both }
