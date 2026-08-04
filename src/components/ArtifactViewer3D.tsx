import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Eye, RefreshCw } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face {
  indices: number[];
  color?: string;
}

interface ArtifactViewer3DProps {
  artifactId: string;
}

export const ArtifactViewer3D: React.FC<ArtifactViewer3DProps> = ({ artifactId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState<number>(1.2);
  const [shadingMode, setShadingMode] = useState<'wireframe' | 'solid'>('wireframe');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  
  // Rotation angles (radians)
  const angleXRef = useRef<number>(0.2);
  const angleYRef = useRef<number>(0.5);
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseXRef = useRef<number>(0);
  const prevMouseYRef = useRef<number>(0);

  // Generate 3D geometries mathematically
  const getGeometry = (id: string): { vertices: Point3D[]; faces: Face[] } => {
    const vertices: Point3D[] = [];
    const faces: Face[] = [];

    if (id === 'art_ishango') {
      // Cylinder representing the Ishango Bone
      const segments = 24;
      const height = 4.0;
      const radius = 0.8;

      // 1. Generate cylinder vertices
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        
        // Vertices along the height
        for (let j = 0; j <= 10; j++) {
          const y = -height / 2 + (j / 10) * height;
          // Add some irregular bumps for a natural bone texture
          const bump = 1.0 + 0.08 * Math.sin(theta * 3) * Math.sin(y * 2);
          vertices.push({
            x: cos * radius * bump,
            y: y,
            z: sin * radius * bump
          });
        }
      }

      // 2. Generate faces (cylinder walls)
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < 10; j++) {
          const idx0 = i * 11 + j;
          const idx1 = (i + 1) * 11 + j;
          const idx2 = (i + 1) * 11 + (j + 1);
          const idx3 = i * 11 + (j + 1);

          faces.push({
            indices: [idx0, idx1, idx2, idx3],
            color: 'rgba(212, 175, 55, 0.15)' // Semi-transparent gold
          });
        }
      }

      // 3. Add tally carvings (grouped notches along the bone)
      // We represent notches as tiny secondary 3D line-segments extruded outward
      const addCarvings = (yPos: number, count: number, startTheta: number) => {
        for (let c = 0; c < count; c++) {
          const angle = startTheta + (c / segments) * Math.PI * 0.4;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const vIdx = vertices.length;
          
          vertices.push({ x: cos * radius * 1.02, y: yPos - 0.05, z: sin * radius * 1.02 });
          vertices.push({ x: cos * radius * 1.02, y: yPos + 0.05, z: sin * radius * 1.02 });
          vertices.push({ x: cos * radius * 1.08, y: yPos, z: sin * radius * 1.08 });

          faces.push({
            indices: [vIdx, vIdx + 1, vIdx + 2],
            color: 'rgba(230, 200, 100, 0.8)' // Solid gold lines
          });
        }
      };

      // Mathematical notches: Column 1 (primes: 11, 13, 17, 19)
      addCarvings(-1.5, 5, 0);
      addCarvings(-1.2, 5, Math.PI * 0.5);
      addCarvings(-0.5, 7, 0);
      addCarvings(0.5, 9, Math.PI * 1.1);

    } else if (id.includes('rhino') || id === 'art_gold_rhino') {
      // low-poly 3D Gold Rhino
      // Core body vertices
      vertices.push({ x: -1.8, y: 0.2, z: 0 });    // 0: Tail base
      vertices.push({ x: -1.2, y: 0.7, z: 0.5 });  // 1: Rear-left hip
      vertices.push({ x: -1.2, y: 0.7, z: -0.5 }); // 2: Rear-right hip
      vertices.push({ x: -1.2, y: -0.5, z: 0.4 }); // 3: Rear-left foot
      vertices.push({ x: -1.2, y: -0.5, z: -0.4 });// 4: Rear-right foot
      vertices.push({ x: 0, y: 0.9, z: 0.6 });     // 5: Mid-left back
      vertices.push({ x: 0, y: 0.9, z: -0.6 });    // 6: Mid-right back
      vertices.push({ x: 1.0, y: 0.8, z: 0.5 });   // 7: Front-left shoulder
      vertices.push({ x: 1.0, y: 0.8, z: -0.5 });  // 8: Front-right shoulder
      vertices.push({ x: 0.9, y: -0.5, z: 0.4 });  // 9: Front-left foot
      vertices.push({ x: 0.9, y: -0.5, z: -0.4 }); // 10: Front-right foot
      vertices.push({ x: 1.6, y: 0.5, z: 0 });     // 11: Neck
      vertices.push({ x: 2.1, y: 0.2, z: 0.2 });   // 12: Muzzle top-left
      vertices.push({ x: 2.1, y: 0.2, z: -0.2 });  // 13: Muzzle top-right
      vertices.push({ x: 1.9, y: -0.2, z: 0 });    // 14: Jaw bottom
      vertices.push({ x: 2.3, y: 0.9, z: 0 });     // 15: Horn tip (extruded)

      // Connect vertices into low-poly faces
      // Back & flank faces
      faces.push({ indices: [0, 1, 5], color: 'rgba(212, 175, 55, 0.2)' });
      faces.push({ indices: [0, 5, 6], color: 'rgba(180, 140, 40, 0.25)' });
      faces.push({ indices: [0, 6, 2], color: 'rgba(212, 175, 55, 0.2)' });
      faces.push({ indices: [1, 7, 5], color: 'rgba(212, 175, 55, 0.15)' });
      faces.push({ indices: [2, 6, 8], color: 'rgba(180, 140, 40, 0.2)' });
      faces.push({ indices: [5, 7, 8], color: 'rgba(212, 175, 55, 0.3)' });
      faces.push({ indices: [5, 8, 6], color: 'rgba(180, 140, 40, 0.25)' });

      // Rear Leg faces
      faces.push({ indices: [0, 3, 1], color: 'rgba(180, 140, 40, 0.35)' });
      faces.push({ indices: [0, 2, 4], color: 'rgba(150, 110, 30, 0.4)' });

      // Front Leg faces
      faces.push({ indices: [7, 9, 11], color: 'rgba(212, 175, 55, 0.3)' });
      faces.push({ indices: [8, 11, 10], color: 'rgba(150, 110, 30, 0.35)' });

      // Head & Horn faces
      faces.push({ indices: [11, 12, 13], color: 'rgba(212, 175, 55, 0.45)' });
      faces.push({ indices: [12, 15, 11], color: 'rgba(230, 195, 70, 0.6)' }); // Gold Horn Highlight
      faces.push({ indices: [13, 11, 15], color: 'rgba(230, 195, 70, 0.55)' });
      faces.push({ indices: [12, 14, 15], color: 'rgba(212, 175, 55, 0.4)' });
      faces.push({ indices: [13, 15, 14], color: 'rgba(180, 140, 40, 0.35)' });

    } else {
      // Default: 3D Dodecahedron (Sacred Geometry shape)
      const t = (1 + Math.sqrt(5)) / 2; // Golden ratio
      vertices.push({ x: -1, y: -1, z: -1 });
      vertices.push({ x: -1, y: -1, z: 1 });
      vertices.push({ x: -1, y: 1, z: -1 });
      vertices.push({ x: -1, y: 1, z: 1 });
      vertices.push({ x: 1, y: -1, z: -1 });
      vertices.push({ x: 1, y: -1, z: 1 });
      vertices.push({ x: 1, y: 1, z: -1 });
      vertices.push({ x: 1, y: 1, z: 1 });
      
      vertices.push({ x: 0, y: -t, z: -1/t });
      vertices.push({ x: 0, y: -t, z: 1/t });
      vertices.push({ x: 0, y:  t, z: -1/t });
      vertices.push({ x: 0, y:  t, z: 1/t });
      
      vertices.push({ x: -1/t, y: 0, z: -t });
      vertices.push({ x:  1/t, y: 0, z: -t });
      vertices.push({ x: -1/t, y: 0, z:  t });
      vertices.push({ x:  1/t, y: 0, z:  t });
      
      vertices.push({ x: -t, y: -1/t, z: 0 });
      vertices.push({ x: -t, y:  1/t, z: 0 });
      vertices.push({ x:  t, y: -1/t, z: 0 });
      vertices.push({ x:  t, y:  1/t, z: 0 });

      // Pentagonal faces
      faces.push({ indices: [3, 11, 7, 19, 17], color: 'rgba(212, 175, 55, 0.2)' });
      faces.push({ indices: [7, 11, 10, 6, 18], color: 'rgba(180, 140, 40, 0.25)' });
      faces.push({ indices: [11, 3, 14, 1, 15], color: 'rgba(212, 175, 55, 0.2)' });
      faces.push({ indices: [19, 6, 13, 12, 2], color: 'rgba(212, 175, 55, 0.15)' });
    }

    return { vertices, faces };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = 360;
    };
    resizeCanvas();

    const geom = getGeometry(artifactId);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const scale = Math.min(width, height) * 0.25 * zoom;
      
      // Auto-rotation increment
      if (autoRotate && !isDraggingRef.current) {
        angleYRef.current += 0.008;
        angleXRef.current = 0.2 + 0.15 * Math.sin(angleYRef.current * 0.5);
      }

      const cosX = Math.cos(angleXRef.current);
      const sinX = Math.sin(angleXRef.current);
      const cosY = Math.cos(angleYRef.current);
      const sinY = Math.sin(angleYRef.current);

      // 3D rotation and projection logic
      const projected = geom.vertices.map(v => {
        // Rotate around Y-axis
        const x1 = v.x * cosY - v.z * sinY;
        const z1 = v.z * cosY + v.x * sinY;

        // Rotate around X-axis
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + v.y * sinX;

        // Perspective projection
        const dist = 5.0; // Distance to camera
        const persp = dist / (dist + z2);

        return {
          x: width / 2 + x1 * scale * persp,
          y: height / 2 - y2 * scale * persp,
          z: z2 // Keep depth for z-sorting
        };
      });

      // Z-sorting faces for correct painter's algorithm rendering
      const sortedFaces = geom.faces
        .map((face, index) => {
          const avgZ = face.indices.reduce((sum, idx) => sum + (projected[idx]?.z || 0), 0) / face.indices.length;
          return { face, avgZ, index };
        })
        .sort((a, b) => b.avgZ - a.avgZ); // Render furthest away first

      // Render faces
      sortedFaces.forEach(({ face }) => {
        ctx.beginPath();
        face.indices.forEach((vIdx, i) => {
          const pt = projected[vIdx];
          if (pt) {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        });
        ctx.closePath();

        // Shaded Fill
        if (shadingMode === 'solid') {
          ctx.fillStyle = face.color || 'rgba(212, 175, 55, 0.15)';
          ctx.fill();
        }

        // Gold Vector outline
        ctx.strokeStyle = shadingMode === 'solid' ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.85)';
        ctx.lineWidth = shadingMode === 'solid' ? 0.8 : 1.2;
        ctx.stroke();

        // Draw vertices joints
        if (shadingMode === 'wireframe') {
          face.indices.forEach(vIdx => {
            const pt = projected[vIdx];
            if (pt) {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
              ctx.fillStyle = '#cd7f32'; // Bronze node points
              ctx.fill();
            }
          });
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [artifactId, zoom, shadingMode, autoRotate]);

  // Drag interaction logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    prevMouseXRef.current = e.clientX;
    prevMouseYRef.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseXRef.current;
    const deltaY = e.clientY - prevMouseYRef.current;
    
    angleYRef.current += deltaX * 0.007;
    angleXRef.current += deltaY * 0.007;

    prevMouseXRef.current = e.clientX;
    prevMouseYRef.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="glass-panel border border-gold-500/10 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden bg-matte-950/60">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Render Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full bg-matte-950 rounded-xl border border-gold-500/5 cursor-grab active:cursor-grabbing shadow-inner"
        style={{ height: '360px' }}
      />

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold-500/5 pt-3 z-10">
        
        {/* Toggle Shading mode */}
        <div className="flex gap-2">
          <button
            onClick={() => setShadingMode(shadingMode === 'wireframe' ? 'solid' : 'wireframe')}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wide flex items-center gap-1.5 transition-all ${
              shadingMode === 'solid'
                ? 'bg-gradient-to-r from-gold-600 to-bronze-600 text-black border-gold-500 font-bold'
                : 'bg-matte-900 border-gold-500/10 text-gray-400 hover:text-gray-200'
            }`}
          >
            <Eye size={12} />
            {shadingMode === 'solid' ? 'Shaded Solid' : 'Vector Wireframe'}
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wide flex items-center gap-1.5 transition-all ${
              autoRotate
                ? 'bg-gradient-to-r from-gold-600 to-bronze-600 text-black border-gold-500 font-bold'
                : 'bg-matte-900 border-gold-500/10 text-gray-400 hover:text-gray-200'
            }`}
          >
            <RefreshCw size={12} className={autoRotate ? 'animate-spin' : ''} />
            {autoRotate ? 'Auto Spin Active' : 'Manual Rotations'}
          </button>
        </div>

        {/* Zoom triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.15))}
            className="p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gold-400 hover:text-white transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={12} />
          </button>
          <span className="text-[10px] font-mono text-gold-500/80">Zoom: {Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(2.5, prev + 0.15))}
            className="p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gold-400 hover:text-white transition-all"
            title="Zoom In"
          >
            <ZoomIn size={12} />
          </button>
        </div>

      </div>
    </div>
  );
};
export default ArtifactViewer3D;
