import { useRef, useState } from "react";
import { useLamp } from "../../context/LampContext";

const REST_Y = 144;
const MAX_PULL = 42;
const PULL_THRESHOLD = 22;

// Luminária de arco minimalista, alta, com a cúpula inclinada na diagonal
// apontando para a foto. Puxando o fio para baixo (arrastar, não clicar)
// liga/desliga a luz, com o fio esticando e voltando ao repouso.
export default function DeskLamp({ className = "" }) {
  const { isOn, toggleLamp } = useLamp();
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);
  const dragInfo = useRef({ active: false, startY: 0, unitsPerPixel: 1 });

  function handlePointerDown(event) {
    event.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    dragInfo.current = {
      active: true,
      startY: event.clientY,
      unitsPerPixel: 380 / rect.height,
      lastPull: 0,
    };
    setDragging(true);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  }

  function handlePointerMove(event) {
    if (!dragInfo.current.active) return;
    const { startY, unitsPerPixel } = dragInfo.current;
    const deltaUnits = (event.clientY - startY) * unitsPerPixel;
    const next = Math.max(0, Math.min(MAX_PULL, deltaUnits));
    dragInfo.current.lastPull = next;
    setPull(next);
  }

  function handlePointerUp() {
    if (!dragInfo.current.active) return;
    dragInfo.current.active = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
    setDragging(false);
    if (dragInfo.current.lastPull >= PULL_THRESHOLD) {
      toggleLamp();
    }
    setPull(0);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLamp();
    }
  }

  const snapTransition = dragging
    ? "none"
    : "all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <svg
      ref={svgRef}
      viewBox="-60 0 220 380"
      fill="none"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id="lightBeam" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--color-accent-to)"
            stopOpacity="0.55"
          />
          <stop
            offset="60%"
            stopColor="var(--color-accent-to)"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="var(--color-accent-to)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {/* base fina */}
      <ellipse
        cx="132"
        cy="364"
        rx="16"
        ry="4.5"
        fill="currentColor"
        opacity="0.85"
      />

      {/* haste reta */}
      <line
        x1="132"
        y1="356"
        x2="132"
        y2="102"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* arco fino subindo e curvando na diagonal em direção à foto */}
      <path
        d="M132 102 C132 10 60 -6 28 52"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="132" cy="102" r="4" fill="currentColor" />
      <circle cx="28" cy="52" r="3.5" fill="currentColor" />

      {/* fio de puxar — arraste para baixo para ligar/desligar */}
      <g
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onDragStart={(event) => event.preventDefault()}
        role="button"
        tabIndex={0}
        aria-pressed={isOn}
        aria-label={
          isOn ? "Puxar para apagar a luminária" : "Puxar para acender a luminária"
        }
        className="cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ WebkitUserDrag: "none", WebkitTapHighlightColor: "transparent" }}
      >
        {/* área de toque invisível, maior que o fio, para facilitar o arrasto */}
        <rect
          x="8"
          y="48"
          width="52"
          height="176"
          fill="transparent"
          style={{ WebkitUserDrag: "none" }}
        />
        <path
          d="M28 52 C28 74 34 84 31 108 C30 121 33 131 31 144"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
        <line
          x1="31"
          y1={REST_Y}
          x2="31"
          y2={REST_Y + pull}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.75"
          style={{ transition: snapTransition }}
        />
        <rect
          x="27"
          y={REST_Y - 1 + pull}
          width="8"
          height="13"
          rx="4"
          fill="currentColor"
          opacity="0.85"
          style={{ transition: snapTransition }}
        />
      </g>

      {/* cúpula inclinada, apontando na diagonal para a foto */}
      <g
        transform="translate(28 52) rotate(28)"
        style={{ pointerEvents: "none" }}
      >
        <polygon
          points="-20,28 20,28 55,175 -140,175"
          fill="url(#lightBeam)"
          className="transition-opacity duration-300"
          opacity={isOn ? 1 : 0}
        />
        <path
          d="M0 0 L-15 30 L15 30 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
