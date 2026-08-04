import React, { useRef, useEffect, useState } from 'react';
import { db } from '../services/db';

interface Globe3DProps {
  activeYear: number | null;
  onSelectEntity: (entity: any, type: string) => void;
}

interface ProjectedPoint {
  x: number;
  y: number;
  visible: boolean;
}

export const Globe3D: React.FC<Globe3DProps> = ({ activeYear, onSelectEntity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Rotation angles (in radians)
  const [rotationX, setRotationX] = useState(0.2); // pitch
  const [rotationY, setRotationY] = useState(0.6); // yaw
  
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0.005, y: 0 }); // Slow spin default

  const civilizations = db.getCivilizations();
  const tradeRoutes = db.getTradeRoutes();
  const migrationRoutes = db.getMigrationRoutes();

  // Static site markers
  const markers = [
    { name: 'Giza Pyramids', lat: 30.04, lng: 31.23, type: 'Monument', civId: 'kemet', description: 'Ancient Nile Valley structures representing advanced geometry.', dating: 'c. 2500 BCE' },
    { name: 'Meroë Pyramids', lat: 16.88, lng: 33.74, type: 'Monument', civId: 'kush', description: 'Steep-angled pyramids and iron-smelting furnaces.', dating: 'c. 700 BCE' },
    { name: 'Lalibela Churches', lat: 12.03, lng: 39.04, type: 'Monument', civId: 'aksum', description: 'Monolithic rock-hewn churches carved from living basalt.', dating: 'c. 1200 CE' },
    { name: 'Jenne-Jeno', lat: 13.90, lng: -4.55, type: 'City', civId: 'mali', description: 'One of the oldest urban centers in West Africa.', dating: 'c. 250 BCE' },
    { name: 'Great Enclosure', lat: -20.27, lng: 30.93, type: 'Excavation', civId: 'great_zimbabwe', description: 'Metropolis featuring dry-stone walls pre-dating external contacts.', dating: 'c. 1100 CE' },
    { name: 'Nok Terracottas', lat: 9.50, lng: 8.00, type: 'Excavation', civId: 'benin', description: 'Early iron metallurgy and stylized clay head sculptures.', dating: 'c. 1000 BCE' }
  ];

  const checkCivTemporal = (civId: string) => {
    if (activeYear === null) return true;
    const civ = civilizations.find(c => c.id === civId);
    if (!civ) return true;
    return activeYear >= civ.startYear && activeYear <= civ.endYear;
  };

  const project = (lat: number, lng: number, radX: number, radY: number, width: number, height: number, radius: number): ProjectedPoint => {
    // Convert to radians
    const phi = (lat * Math.PI) / 180;
    const theta = (lng * Math.PI) / 180;

    // Unit Sphere Coordinates
    const x = Math.cos(phi) * Math.sin(theta);
    const y = Math.sin(phi);
    const z = Math.cos(phi) * Math.cos(theta);

    // Apply Yaw (Y-axis rotation)
    let x1 = x * Math.cos(radY) - z * Math.sin(radY);
    let z1 = x * Math.sin(radY) + z * Math.cos(radY);

    // Apply Pitch (X-axis rotation)
    let y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
    let z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

    // Screenspace translations
    return {
      x: width / 2 + x1 * radius,
      y: height / 2 - y2 * radius,
      visible: z2 > 0 // Backface culling: visible if depth is on front side
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) * 0.38;

      // Draw outer atmosphere glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, radius * 0.95, width / 2, height / 2, radius * 1.25);
      grad.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
      grad.addColorStop(0.5, 'rgba(205, 127, 50, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius * 1.3, 0, 2 * Math.PI);
      ctx.fill();

      // Draw sphere background
      ctx.fillStyle = '#080808';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Apply drag inertia / slow rotation
      let currentRotX = rotationX;
      let currentRotY = rotationY;
      if (!isDraggingRef.current) {
        currentRotY += velocityRef.current.x;
        currentRotX += velocityRef.current.y;
        
        // Boundaries for vertical rotation (avoid flipping)
        currentRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, currentRotX));
        
        setRotationX(currentRotX);
        setRotationY(currentRotY);
        
        // Decay speed
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;
        
        // Maintain a slow minimum spin
        if (Math.abs(velocityRef.current.x) < 0.001) {
          velocityRef.current.x = 0.0008;
        }
      }

      // Draw Lat/Lng Wiregrid lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
      ctx.lineWidth = 0.5;

      // Latitudes
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 5) {
          const pt = project(lat, lng, currentRotX, currentRotY, width, height, radius);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Longitudes
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const pt = project(lat, lng, currentRotX, currentRotY, width, height, radius);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Kingdoms region overlays (simulated via glowing ellipses)
      civilizations.forEach((civ) => {
        const isTemporal = checkCivTemporal(civ.id);
        const opacity = isTemporal ? 0.3 : 0.05;

        // Map centers roughly to coordinates (Kemet, Kush, Aksum, Mali, Benin, Great Zimbabwe, Tiwanaku)
        const coordsMap: Record<string, { lat: number; lng: number; size: number }> = {
          kemet: { lat: 26, lng: 30, size: 28 },
          kush: { lat: 18, lng: 33, size: 24 },
          aksum: { lat: 12, lng: 38, size: 20 },
          mali: { lat: 15, lng: -4, size: 30 },
          benin: { lat: 6, lng: 5, size: 18 },
          great_zimbabwe: { lat: -20, lng: 31, size: 22 },
          tiwanaku: { lat: -16, lng: -68, size: 20 }
        };

        const loc = coordsMap[civ.id];
        if (loc) {
          const pt = project(loc.lat, loc.lng, currentRotX, currentRotY, width, height, radius);
          if (pt.visible) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, loc.size * (radius / 200), 0, 2 * Math.PI);
            ctx.fillStyle = civ.id === 'kemet' || civ.id === 'mali' || civ.id === 'great_zimbabwe'
              ? `rgba(212, 175, 55, ${opacity})`
              : `rgba(205, 127, 50, ${opacity})`;
            ctx.fill();
            ctx.strokeStyle = civ.id === 'kemet' || civ.id === 'mali' || civ.id === 'great_zimbabwe'
              ? `rgba(212, 175, 55, ${opacity * 1.5})`
              : `rgba(205, 127, 50, ${opacity * 1.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Draw Trade Routes (Bezier / lines)
      tradeRoutes.forEach((route) => {
        const isTemporal = activeYear === null || (activeYear >= (route.startYear ?? -Infinity) && activeYear <= (route.endYear ?? Infinity));
        ctx.strokeStyle = isTemporal ? 'rgba(205, 127, 50, 0.55)' : 'rgba(205, 127, 50, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        let first = true;
        route.coordinates.forEach(([lat, lng]) => {
          const pt = project(lat, lng, currentRotX, currentRotY, width, height, radius);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        });
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Migration paths (glowing curves)
      migrationRoutes.forEach((route) => {
        const isTemporal = activeYear === null || (activeYear >= (route.startYear ?? -Infinity) && activeYear <= (route.endYear ?? Infinity));
        ctx.strokeStyle = isTemporal ? 'rgba(168, 85, 247, 0.45)' : 'rgba(168, 85, 247, 0.08)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        let first = true;
        route.coordinates.forEach(([lat, lng]) => {
          const pt = project(lat, lng, currentRotX, currentRotY, width, height, radius);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        });
        ctx.stroke();
      });

      // Draw Site pins
      markers.forEach((marker) => {
        const isTemporal = checkCivTemporal(marker.civId);
        const pt = project(marker.lat, marker.lng, currentRotX, currentRotY, width, height, radius);
        
        if (pt.visible) {
          const scaleOpacity = isTemporal ? 1.0 : 0.15;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = marker.type === 'Monument' ? `rgba(212, 175, 55, ${scaleOpacity})` : `rgba(34, 197, 94, ${scaleOpacity})`;
          ctx.fill();
          
          ctx.strokeStyle = '#080808';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Render Label if temporal matching and close enough
          if (isTemporal) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.font = '10px Cinzel, serif';
            ctx.fillText(marker.name, pt.x + 8, pt.y + 3);
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotationX, rotationY, activeYear]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    
    // Scale motion speed
    const factor = 0.007;
    const nextRotY = rotationY + deltaX * factor;
    const nextRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotationX + deltaY * factor));

    setRotationY(nextRotY);
    setRotationX(nextRotX);

    // Track drag velocity
    velocityRef.current = { x: deltaX * factor * 0.5, y: deltaY * factor * 0.5 };
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) * 0.38;

    // Check hit collision with markers
    let hitFound = false;
    markers.forEach((marker) => {
      if (hitFound) return;
      const pt = project(marker.lat, marker.lng, rotationX, rotationY, width, height, radius);
      if (pt.visible) {
        const dx = clickX - pt.x;
        const dy = clickY - pt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist <= 12) {
          // Trigger click info drawer
          onSelectEntity(marker, 'Site');
          hitFound = true;
        }
      }
    });

    // Check hit on kingdoms
    if (!hitFound) {
      const coordsMap: Record<string, { lat: number; lng: number; size: number; id: string }> = {
        kemet: { lat: 26, lng: 30, size: 28, id: 'kemet' },
        kush: { lat: 18, lng: 33, size: 24, id: 'kush' },
        aksum: { lat: 12, lng: 38, size: 20, id: 'aksum' },
        mali: { lat: 15, lng: -4, size: 30, id: 'mali' },
        benin: { lat: 6, lng: 5, size: 18, id: 'benin' },
        great_zimbabwe: { lat: -20, lng: 31, size: 22, id: 'great_zimbabwe' },
        tiwanaku: { lat: -16, lng: -68, size: 20, id: 'tiwanaku' }
      };

      Object.values(coordsMap).forEach((loc) => {
        if (hitFound) return;
        const pt = project(loc.lat, loc.lng, rotationX, rotationY, width, height, radius);
        if (pt.visible) {
          const dx = clickX - pt.x;
          const dy = clickY - pt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist <= loc.size * (radius / 200)) {
            const civ = civilizations.find(c => c.id === loc.id);
            if (civ) {
              onSelectEntity(civ, 'Kingdom');
              hitFound = true;
            }
          }
        }
      });
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative overflow-hidden bg-matte-950">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono uppercase bg-black/60 px-3 py-1 rounded-full border border-gold-500/10 z-10">
        Drag to rotate globe sphere
      </div>
      <canvas
        ref={canvasRef}
        width={750}
        height={450}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        className="max-w-full max-h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
export default Globe3D;
