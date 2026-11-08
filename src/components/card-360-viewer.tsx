"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeftRight, Pause, Play, RotateCcw } from "lucide-react";
import type { Product } from "@/lib/types";

const DEGREES_PER_MS = 360 / 15000;

type Props = {
  product: Pick<Product, "name" | "card_number" | "front_url" | "back_url">;
};

/**
 * 360º interface rotation using the uploaded front and back images.
 * This is NOT a 3D scan of the physical card or an edge/condition inspection.
 */
export default function Card360Viewer({ product }: Props) {
  const [angle, setAngle] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [onscreen, setOnscreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const angleRef = useRef(0);
  const pointer = useRef<{ id: number; x: number } | null>(null);
  const hasBack = Boolean(product.back_url);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlaying(false);
    };
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibilityChange);
    onVisibilityChange();
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === "undefined") {
      return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }
    const observer = new IntersectionObserver(entries => setOnscreen(entries[0]?.isIntersecting ?? true), { threshold: 0.05 });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion || !hasBack || !pageVisible || !onscreen) return;
    let frame = 0;
    let previous = 0;
    let lastStatus = 0;
    const animate = (timestamp: number) => {
      if (previous !== 0) {
        angleRef.current = (angleRef.current + Math.min(timestamp - previous, 100) * DEGREES_PER_MS) % 360;
        if (cardRef.current) cardRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
        // Keep the visual transform smooth while limiting React updates to ~8/second.
        if (timestamp - lastStatus > 125) {
          setAngle(angleRef.current);
          lastStatus = timestamp;
        }
      }
      previous = timestamp;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing, reducedMotion, hasBack, pageVisible, onscreen]);

  const normalized = ((angle % 360) + 360) % 360;
  const facingBack = normalized >= 90 && normalized < 270;
  const showSide = (side: "front" | "back") => {
    setPlaying(false);
    setAngle(current => {
      const turn = Math.round(current / 360) * 360;
      const next = turn + (side === "back" ? 180 : 0);
      angleRef.current = next;
      return next;
    });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasBack) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlaying(false);
    setDragging(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const tracked = pointer.current;
    if (!tracked || tracked.id !== event.pointerId) return;
    const dx = event.clientX - tracked.x;
    tracked.x = event.clientX;
    setAngle(current => {
      const next = current + dx * 0.85;
      angleRef.current = next;
      return next;
    });
  };
  const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const onKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasBack) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setPlaying(false);
      setAngle(current => {
        const next = current + (event.key === "ArrowRight" ? 15 : -15);
        angleRef.current = next;
        return next;
      });
    } else if (event.key === "Home") {
      event.preventDefault();
      showSide("front");
    } else if (event.key === "End") {
      event.preventDefault();
      showSide("back");
    }
  };

  return (
    <div className="card360" data-testid="card360-viewer">
      <div
        ref={stageRef}
        className={`card360-stage${dragging ? " card360-dragging" : ""}${playing && pageVisible && onscreen ? " card360-playing" : ""}`}
        tabIndex={hasBack ? 0 : -1}
        role={hasBack ? "slider" : "img"}
        aria-label={`Girar carta ${product.name}, número ${product.card_number}, para ver frente e verso`}
        aria-valuemin={hasBack ? 0 : undefined}
        aria-valuemax={hasBack ? 359 : undefined}
        aria-valuenow={hasBack ? Math.round(normalized) % 360 : undefined}
        aria-valuetext={hasBack ? `${Math.round(normalized) % 360} graus; ${facingBack ? "verso" : "frente"}` : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onLostPointerCapture={() => { pointer.current = null; setDragging(false); }}
        onKeyDown={onKeyboard}
      >
        <div ref={cardRef} className="card360-card" style={{ transform: `rotateY(${angle}deg)` }}>
          <div className="card360-face card360-front">
            {product.front_url ? (
              <img src={product.front_url} alt={`Frente original de ${product.name}`} draggable={false} />
            ) : (
              <div className="card360-placeholder">Foto da frente não cadastrada</div>
            )}
          </div>
          <div className="card360-face card360-back">
            {product.back_url ? (
              <img src={product.back_url} alt={`Verso de referência de ${product.name}`} draggable={false} />
            ) : (
              <div className="card360-placeholder">Foto do verso não cadastrada</div>
            )}
          </div>
        </div>
      </div>
      <p className="card360-hint">{hasBack ? "Arraste para girar · use ← → no teclado · giro automático opcional" : "Aguardando imagem do verso para habilitar o giro"}</p>
      <div className="card360-actions" aria-label="Controles de rotação">
        <button type="button" onClick={() => showSide("front")} className={!facingBack ? "active" : ""} aria-pressed={!facingBack}>
          Frente
        </button>
        <button type="button" onClick={() => showSide("back")} disabled={!hasBack} className={facingBack ? "active" : ""} aria-pressed={facingBack}>
          Verso
        </button>
        <button
          type="button"
          className="card360-auto"
          disabled={!hasBack || reducedMotion}
          aria-pressed={playing}
          onClick={() => setPlaying(current => !current)}
          title={reducedMotion ? "Giro automático desativado pela preferência de movimento reduzido" : undefined}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Pausar" : "Girar"}
        </button>
        <button type="button" className="card360-reset" onClick={() => showSide("front")} aria-label="Voltar para a frente da carta">
          <RotateCcw size={15} />
        </button>
      </div>
      <span className="card360-status" aria-live="off"><ArrowLeftRight size={12} /> Simulação de rotação entre frente e verso; não revela bordas ou espessura física.</span>
    </div>
  );
}
