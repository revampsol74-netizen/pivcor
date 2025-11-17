"use client";

import { X } from "lucide-react";
import type { EcosystemEntity } from "@/components/three/EcosystemOrbits";

type ModalProps = {
  entity: EcosystemEntity | null;
  onClose: () => void;
};

export function EcosystemInfoModal({ entity, onClose }: ModalProps) {
  if (!entity) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0F]/95 p-6 text-white shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Ecosystem Node</p>
            <h3 className="text-2xl font-semibold mt-2">{entity.title}</h3>
            <p className="text-sm text-zinc-400 mt-1 tracking-wide">{entity.label}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed tracking-wide">{entity.description}</p>
      </div>
    </div>
  );
}
