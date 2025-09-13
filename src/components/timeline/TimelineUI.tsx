
import { useEffect, useMemo, useRef } from "react"
import { eras } from "../../data/eras"
import { Button } from "../ui/button/Button"

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
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 select-none z-20">
      {/* Portal principal */}
      <div
        ref={portalRef}
        className="relative w-56 h-56 rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-[0_0_60px_-10px_rgba(0,0,0,0.7)]"
        style={{ boxShadow: `0 0 50px -10px ${color}AA` }}
      >
        <img
          key={era.id}
          src={era.image}
          alt={era.name}
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105 animate-fadeIn"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="relative text-center text-white drop-shadow flex flex-col items-center px-4">
          <h2 className="text-2xl font-semibold tracking-wide leading-tight mb-1">{era.name}</h2>
          {era.period && (
            <p className="text-xs font-medium tracking-wide text-white/80 mb-1">{era.period}</p>
          )}
          {era.description && (
            <p
              className="text-[11px] leading-snug font-light max-w-[200px] text-white/80"
              style={{
                textShadow: "0 0 6px rgba(0,0,0,0.5)",
                borderTop: `1px solid ${color}33`,
                paddingTop: 6
              }}
            >
              {era.description}
            </p>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-5">
        <Button
          variant="tertiary"
          onClick={handlePrev}
          disabled={index === 0 || loading}
          styles="!px-3 !py-2 text-xs disabled:opacity-30"
        >Prev</Button>
        <div className="flex gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          {eras.map((e, i) => (
            <button
              key={e.id}
              onClick={() => !loading && setCurrentEra(e.id)}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${i === index ? 'bg-white border-white scale-110 shadow' : 'border-white/40 bg-white/10 hover:bg-white/40'}`}
              aria-label={e.name}
            />
          ))}
        </div>
        <Button
          variant="tertiary"
          onClick={handleNext}
          disabled={index === eras.length - 1 || loading}
          styles="!px-3 !py-2 text-xs disabled:opacity-30"
        >Next</Button>
      </div>

  {/* Miniaturas horizontales removidas para usar solo las del rail */}

      {/* Timeline rail inferior */}
      <div className="mt-6 w-[88vw] max-w-[1200px] h-24 relative">
        {/* Línea principal */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/30" />
        {/* Punteado fino */}
        <div className="absolute left-0 right-0 top-[calc(50%+6px)] flex justify-between px-4">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="w-[2px] h-[2px] bg-white/50 rounded-full opacity-50" />
          ))}
        </div>
        {/* Nodos de eras + miniaturas arriba y periodo abajo */}
        <div className="absolute inset-0 flex items-center justify-between px-6">
          {eras.map((e, i) => (
            <div key={e.id} className="relative w-0 h-0">
              {/* Miniatura arriba */}
              <button
                onClick={() => !loading && setCurrentEra(e.id)}
                className={`absolute -top-16 left-1/2 -translate-x-1/2 w-14 h-10 rounded-md overflow-hidden ring-1 transition-all ${i === index ? 'ring-white/80 shadow-md scale-105' : 'ring-white/20 opacity-70 hover:opacity-100'}`}
                aria-label={`${e.name} thumbnail`}
              >
                <img src={e.image} alt={e.name} className="w-full h-full object-cover" draggable={false} />
              </button>

              {/* Nodo en la línea */}
              <button
                aria-label={e.name}
                onClick={() => !loading && setCurrentEra(e.id)}
                className={`relative w-4 h-4 rounded-full border transition-all ml-[-8px] ${i === index ? 'bg-white border-white shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-110' : 'bg-white/20 border-white/60 hover:bg-white/50'}`}
              />

              {/* Periodo debajo */}
              {e.period && (
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium tracking-wide text-white/80 whitespace-nowrap">
                  {e.period}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Animación simple CSS (se puede mover a un CSS global si prefieres)
// .animate-fadeIn { animation: fadeIn 0.6s ease both }
