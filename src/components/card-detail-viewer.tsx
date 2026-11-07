"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeftRight, Image as ImageIcon, Maximize2, Minus, Plus, RotateCcw, X, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/types";
import Card360Viewer from "./card-360-viewer";
import { getCardReference } from "@/lib/card-reference";

type Side = "front" | "back";
type Mode = Side | "360" | "reference";
type ImageSize = { width: number; height: number };
type Props = { product: Product };
const MIN_INSPECTION_WIDTH = 1200;
const MAX_ZOOM = 4;
const UPSCALED_IMAGE = /-hq\.webp(?:$|\?)/;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Two distinct concepts:
 * - catalog images are legacy crops (not verified specimen photos);
 * - uploaded specimen photos may be used for condition inspection if their resolution allows it.
 * No AI upscaling, redraw, or invented image details.
 */
function describeSource(url: string, side: Side): string {
  if (!url) return "Imagem não cadastrada";
  if (/\/cards\/shiny\/zapdos-japones-foto-original\.webp(?:$|\?)/.test(url) && side === "front") {
    return "Fotografia enviada do exemplar · sem validação de condição";
  }
  if (url.includes("-hq.webp")) return "Imagem enviada · recorte preciso · ampliação interpolada, sem recriação por IA";
  if (/\/cards\/shiny\//.test(url)) return "Recorte da montagem enviada · imagem de referência";
  return "Imagem cadastrada · confirme se corresponde ao exemplar à venda";
}

function ZoomDialog({ src, alt, onClose, info, isReference = false }: { src: string; alt: string; onClose: () => void; info: ImageSize | null; isReference?: boolean }) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const fingers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const [panning, setPanning] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); }
      if (event.key === "+" || event.key === "=") setScale(v => clamp(v + 0.4, 1, MAX_ZOOM));
      if (event.key === "-") setScale(v => clamp(v - 0.4, 1, MAX_ZOOM));
      if (event.key === "0") { setScale(1); setPan({ x: 0, y: 0 }); }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const zoom = (delta: number) => {
    setScale(v => {
      const next = clamp(v + delta, 1, MAX_ZOOM);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    fingers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setPanning(true);
    if (fingers.current.size === 2) {
      const [a,b] = [...fingers.current.values()];
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale };
    }
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = fingers.current.get(event.pointerId);
    if (!previous) return;
    fingers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (fingers.current.size === 2) {
      const [a,b] = [...fingers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current && pinch.current.distance > 0) setScale(clamp(pinch.current.scale * distance / pinch.current.distance, 1, MAX_ZOOM));
    } else if (scale > 1) {
      setPan(current => ({ x: current.x + event.clientX - previous.x, y: current.y + event.clientY - previous.y }));
    }
  };
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    fingers.current.delete(event.pointerId);
    if (fingers.current.size < 2) pinch.current = null;
    if (fingers.current.size === 0) setPanning(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <div className="et-zoom-backdrop" data-zoom-open="true" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="et-zoom-dialog" role="dialog" aria-modal="true" aria-label="Ampliação da imagem da carta">
      <header className="et-zoom-header"><div><strong>{isReference ? "Ampliar arte da edição" : "Inspecionar imagem"}</strong><span>{info ? `${info.width} × ${info.height} px · ${isReference ? "referência digital" : "imagem enviada"}` : "Carregando resolução"}</span></div><button type="button" aria-label="Fechar ampliação" onClick={onClose}><X size={21}/></button></header>
      <div className={`et-zoom-stage${panning ? " is-panning" : ""}`} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onDoubleClick={() => zoom(scale > 1 ? -MAX_ZOOM : 1.5)}>
        <img src={src} alt={alt} draggable={false} style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})` }} />
      </div>
      <footer className="et-zoom-footer"><span>Arraste para mover · pinça para ampliar · duplo toque/clique</span><div className="et-zoom-controls"><button type="button" aria-label="Diminuir zoom" onClick={() => zoom(-0.5)} disabled={scale === 1}><Minus size={17}/></button><output aria-label="Nível de zoom">{Math.round(scale * 100)}%</output><button type="button" aria-label="Aumentar zoom" onClick={() => zoom(0.5)} disabled={scale === MAX_ZOOM}><Plus size={17}/></button><button type="button" aria-label="Restaurar zoom" onClick={() => { setScale(1); setPan({x:0,y:0}); }}><RotateCcw size={17}/></button></div></footer>
      {isReference ? <p className="et-zoom-resolution-warning">Arte digital de referência: não comprova a condição NM do exemplar vendido.</p> : info && info.width < MIN_INSPECTION_WIDTH && <p className="et-zoom-resolution-warning">A imagem enviada tem resolução limitada. Ampliar não recupera detalhes da impressão; solicite uma fotografia individual em alta resolução.</p>}
    </section>
  </div>;
}

export default function CardDetailViewer({ product }: Props) {
  const reference = getCardReference(product);
  const [mode, setMode] = useState<Mode>(reference ? "reference" : "front");
  const [referenceFailed, setReferenceFailed] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [sizes, setSizes] = useState<Partial<Record<Side | "reference", ImageSize>>>({});
  const [missing, setMissing] = useState(false);
  const side: Side = mode === "back" ? "back" : "front";
  const showingReference = mode === "reference" && Boolean(reference) && !referenceFailed;
  const url = showingReference ? reference!.url : side === "front" ? product.front_url : product.back_url;
  const imageKey: Side | "reference" = showingReference ? "reference" : side;
  const hasBack = Boolean(product.back_url);
  const info = sizes[imageKey] || null;
  const handleZoomClose = useCallback(() => setZoomOpen(false), []);
  const changeMode = (next: Mode) => { setMode(next); setZoomOpen(false); setMissing(false); };
  return <div className="et-detail-gallery" data-testid="card-detail-gallery">
    <div className="et-gallery-toolbar"><span><ImageIcon size={15}/> Imagem da carta</span><span className="et-gallery-note">{showingReference ? "Arte digital em inglês" : "Imagem enviada"}</span></div>
    {mode === "360" ? <Card360Viewer product={product}/> : <>
      <div className="et-card-image-stage">
        {url && !missing ? <img src={url} alt={`${side === "front" ? "Frente" : "Verso"} da carta ${product.name}, número ${product.card_number}`} draggable={false} onLoad={event => setSizes(current => ({ ...current, [imageKey]: {width:event.currentTarget.naturalWidth,height:event.currentTarget.naturalHeight} }))} onError={() => { if(showingReference){setReferenceFailed(true);setMode("front");}else setMissing(true); }}/>
        : <div className="et-gallery-placeholder">Imagem não disponível</div>}
      </div>
      <p className="et-gallery-provenance">{showingReference ? `Arte digital da edição (EN) · não representa o exemplar NM${reference&&!reference.matchesLanguage?" · idioma diferente do produto":""}` : describeSource(url,side)}</p>
      <p className={`et-gallery-quality${info && info.width < MIN_INSPECTION_WIDTH ? " et-gallery-lowres" : ""}`} aria-live="polite">
        {info ? `${info.width} × ${info.height} px${showingReference ? " · imagem de referência digital" : UPSCALED_IMAGE.test(url) ? " · upscale por interpolação, sem detalhes novos" : info.width < MIN_INSPECTION_WIDTH ? " · resolução insuficiente para inspecionar detalhes" : " · ampliação disponível"}` : "Preservando o arquivo original e suas proporções"}
      </p>
      <button type="button" className="et-open-zoom" onClick={() => setZoomOpen(true)} disabled={!url || missing}><ZoomIn size={18}/> Abrir ampliação <Maximize2 size={15}/></button>
    </>}
    <nav className="et-gallery-switch" aria-label="Visualização da carta">
      {reference && <button type="button" className={mode === "reference" ? "active" : ""} aria-pressed={mode === "reference"} onClick={() => changeMode("reference")} disabled={referenceFailed}>Arte HD (EN)</button>}
      <button type="button" className={mode === "front" ? "active" : ""} aria-pressed={mode === "front"} onClick={() => changeMode("front")}>Frente</button>
      <button type="button" className={mode === "back" ? "active" : ""} aria-pressed={mode === "back"} onClick={() => changeMode("back")} disabled={!hasBack}>Verso</button>
      <button type="button" className={mode === "360" ? "active" : ""} aria-pressed={mode === "360"} onClick={() => changeMode("360")} disabled={!hasBack}><ArrowLeftRight size={15}/> Giro 360°</button>
    </nav>
    {zoomOpen && url && <ZoomDialog src={url} alt={`${side === "front" ? "Frente" : "Verso"} de ${product.name}`} info={info} onClose={handleZoomClose} isReference={showingReference} />}
  </div>;
}
