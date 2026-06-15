import React from "react";
import { ArrowLeft, Compass, HelpCircle, Info, Maximize, RotateCw, ChevronRight, Sparkles,Volume2,VolumeX
} from "lucide-react";
import { VirtualTourScene } from "@/types/types";

interface VirtualTourViewerProps {
  scenes: VirtualTourScene[];
  propertyName: string;
  onClose: () => void;
}

export default function VirtualTourViewer({ scenes, propertyName, onClose }: VirtualTourViewerProps) {
  const [currentSceneIdx, setCurrentSceneIdx] = React.useState(0);
  const [isRotating, setIsRotating] = React.useState(true);
  const [rotationOffset, setRotationOffset] = React.useState(0);
  const [audioGuided, setAudioGuided] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [infoBubbleOpen, setInfoBubbleOpen] = React.useState(true);

  const activeScene = scenes[currentSceneIdx] || scenes[0];

  // Auto-pan simulation effect
  React.useEffect(() => {
    if (!isRotating) return;
    
    const interval = setInterval(() => {
      setRotationOffset((prev) => (prev + 0.15) % 100);
    }, 45);
    
    return () => clearInterval(interval);
  }, [isRotating]);

  const handleSceneSelect = (idx: number) => {
    setCurrentSceneIdx(idx);
    setRotationOffset(0); // reset orientation
  };

  const handleDrag = () => {
    setIsRotating(false); // Pause auto rot on manual action
  };

  return (
    <div className="fixed inset-0 bg-clay z-50 flex flex-col justify-between" id="virtual-tour-overlay">
      
      {/* Header bar */}
      <div className="bg-zinc-950/85 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 text-marble/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xs duration-150 cursor-pointer"
            id="close-virtual-tour-btn"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <span className="text-[10px] tracking-widest text-primary-gold uppercase font-mono block">
              3D Virtual Architectural Tour
            </span>
            <h1 className="text-marble text-sm font-display tracking-wide font-medium">
              Exploring: {propertyName}
            </h1>
          </div>
        </div>

        {/* Info or helper widgets */}
        <div className="hidden sm:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Stream Active</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-white/60">Scene {currentSceneIdx + 1} of {scenes.length}</span>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-900 group">
        
        {/* Interactive Rotatable Panorama simulation container */}
        <div 
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url(${activeScene.imageUrl})`,
            backgroundPosition: `${50 + (rotationOffset - 50) * 0.45}% center`,
            backgroundSize: `${zoomLevel}%`,
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
            transform: `scale(1.15)`,
            filter: "brightness(0.95)"
          }}
          onMouseDown={handleDrag}
          onTouchStart={handleDrag}
        />

        {/* Panoramic overlay grid vignette for depth */}
        <div className="absolute inset-0 bg-radial-gradient(circle, transparent 20%, rgba(9,13,22,0.65) 90%) pointer-events-none" />

        {/* Floating hotspot indicators - Interactive nodes to travel between rooms */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {scenes.map((sc, index) => {
            if (index === currentSceneIdx) return null;
            
            // Simulating rooms positioning dynamically
            const posX = 20 + (index * 25) + (rotationOffset % 10);
            const posY = 40 + (index * 11);

            return (
              <button
                key={sc.sceneId}
                onClick={() => handleSceneSelect(index)}
                className="absolute pointer-events-auto flex flex-col items-center group cursor-pointer animate-pulse transition-all duration-300"
                style={{
                  left: `${posX}%`,
                  top: `${posY}%`
                }}
              >
                <div className="p-3 bg-primary-gold text-clay rounded-full border-4 border-marble/20 group-hover:scale-110 shadow-2xl transition-transform duration-300">
                  <Compass className="h-5 w-5 stroke-[1.5] animate-spin-slow" />
                </div>
                <div className="mt-2 bg-clay/90 backdrop-blur-md border border-white/10 text-marble px-2.5 py-1 rounded-xs text-[10px] font-mono tracking-wider shadow-md">
                  Go to {sc.name} &rsaquo;
                </div>
              </button>
            );
          })}
        </div>

        {/* Compass rotation indicator at bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-zinc-950/80 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full shadow-2xl">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-full cursor-pointer hover:bg-white/10 duration-150 ${isRotating ? "text-primary-gold" : "text-white/60"}`}
            title={isRotating ? "Pause Auto Rotation" : "Play Auto Rotation"}
          >
            <RotateCw className="h-4 w-4" />
          </button>
          
          <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
            {isRotating ? "Scanning Room..." : "Static View"}
          </span>

          <span className="text-white/20">|</span>

          {/* Zoom modifiers */}
          <div className="flex items-center space-x-2 text-[10px] font-mono">
            <button 
              onClick={() => setZoomLevel(Math.max(100, zoomLevel - 10))} 
              className="text-white hover:text-primary-gold cursor-pointer px-1 text-sm font-semibold"
            >
              -
            </button>
            <span className="text-white/70">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))} 
              className="text-white hover:text-primary-gold cursor-pointer px-1 text-sm font-semibold"
            >
              +
            </button>
          </div>
        </div>

        {/* Info Panel Hover details */}
        {infoBubbleOpen && (
          <div className="absolute top-6 left-6 max-w-xs bg-zinc-950/85 backdrop-blur-md rounded-xs border border-white/10 p-5 shadow-2xl animate-fade-in text-white">
            <div className="flex justify-between items-start mb-2">
              <span className="text-primary-gold font-mono uppercase tracking-widest text-[9px] flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Selected Space Spec</span>
              </span>
              <button 
                onClick={() => setInfoBubbleOpen(false)}
                className="text-white/40 hover:text-white text-xs"
              >
                &times;
              </button>
            </div>
            <h4 className="font-display font-medium text-sm text-marble mb-1">
              {activeScene.name}
            </h4>
            <p className="text-xs text-white/75 leading-relaxed font-mono">
              {activeScene.description}
            </p>
            <p className="text-[9px] text-white/40 mt-3 italic">
              *Pro tip: Click room nodes floating in space or use room carousel on the right.
            </p>
          </div>
        )}

      </div>

      {/* Footer carousel for scenery selection */}
      <div className="bg-zinc-950 px-6 py-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        <div className="md:col-span-4 max-w-sm">
          <p className="text-white/55 text-xs uppercase font-mono tracking-widest mb-1.5 flex items-center space-x-1.5">
            <Info className="h-3.5 w-3.5 text-primary-gold" />
            <span>Interactive Controls Guide</span>
          </p>
          <span className="text-[11px] text-white/40 leading-normal block">
            Click on active portal indicators located in rooms to transition dynamically between levels, or use the navigation dashboard panel.
          </span>
        </div>

        {/* Panoramic scene slots */}
        <div className="md:col-span-8 flex space-x-3 overflow-x-auto pb-1 mt-2 md:mt-0">
          {scenes.map((sc, i) => (
            <button
              key={sc.sceneId}
              onClick={() => handleSceneSelect(i)}
              className={`flex-shrink-0 group relative w-36 aspect-16/10 rounded-sm overflow-hidden border transition-all cursor-pointer ${
                currentSceneIdx === i 
                  ? "border-primary-gold ring-2 ring-primary-gold/20 scale-95" 
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <img
                src={sc.imageUrl}
                alt={sc.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-[0.8] duration-200"
              />
              <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black via-black/10 to-transparent">
                <span className="text-marble text-[9px] font-mono tracking-wider font-semibold truncate block w-full text-left">
                  {sc.name}
                </span>
              </div>
              
              {currentSceneIdx === i && (
                <div className="absolute top-1 right-1 bg-primary-gold text-clay rounded-full p-0.5 shadow-sm">
                  <Compass className="h-2 w-2 animate-spin-slow" />
                </div>
              )}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
