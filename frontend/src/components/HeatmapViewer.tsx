'use client';

import { AttentionZone } from '@/lib/api';
import { useRef, useEffect, useState } from 'react';

interface HeatmapViewerProps {
    imageBase64: string;
    attentionZones: AttentionZone[];
    overallScore: number;
    summary: string;
}

export default function HeatmapViewer({ imageBase64, attentionZones, overallScore, summary }: HeatmapViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredZone, setHoveredZone] = useState<AttentionZone | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Draw heatmap overlay
    useEffect(() => {
        if (!canvasRef.current || !imageBase64) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            setDimensions({ width: img.width, height: img.height });

            // Draw base image
            ctx.drawImage(img, 0, 0);

            // Draw attention zones as glowing overlays
            attentionZones.forEach(zone => {
                const x = (zone.x_percent / 100) * img.width;
                const y = (zone.y_percent / 100) * img.height;
                const w = (zone.width_percent / 100) * img.width;
                const h = (zone.height_percent / 100) * img.height;

                // Color based on attention level (red = high, blue = low)
                const hue = 120 - (zone.attention_level * 1.2); // 120=green to 0=red
                const alpha = 0.3 + (zone.attention_level / 100) * 0.3;

                // Glow effect
                ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
                ctx.shadowBlur = 20 + (zone.attention_level / 5);

                // Draw rounded rectangle
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, 8);
                ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
                ctx.fill();

                // Border
                ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.shadowBlur = 0;
            });
        };

        img.src = `data:image/png;base64,${imageBase64}`;
    }, [imageBase64, attentionZones]);

    // Handle mouse movement for tooltip
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = dimensions.width / rect.width;
        const scaleY = dimensions.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Check if mouse is over any attention zone
        const xPercent = (x / dimensions.width) * 100;
        const yPercent = (y / dimensions.height) * 100;

        const zone = attentionZones.find(z =>
            xPercent >= z.x_percent &&
            xPercent <= z.x_percent + z.width_percent &&
            yPercent >= z.y_percent &&
            yPercent <= z.y_percent + z.height_percent
        );

        setHoveredZone(zone || null);
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-400';
        if (score >= 40) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="glass-card p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    👁️ Recruiter&apos;s 6-Second View
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Scanability Score:</span>
                    <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                        {overallScore}%
                    </span>
                </div>
            </div>

            {/* Summary */}
            <p className="text-sm text-gray-400">{summary}</p>

            {/* Canvas Container */}
            <div ref={containerRef} className="relative bg-dark-800 rounded-xl overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredZone(null)}
                    className="w-full h-auto cursor-crosshair"
                    style={{ maxHeight: '600px', objectFit: 'contain' }}
                />

                {/* Tooltip */}
                {hoveredZone && (
                    <div className="absolute bottom-4 left-4 right-4 glass-card p-4 border border-accent-cyan/30">
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    background: `hsl(${120 - hoveredZone.attention_level * 1.2}, 100%, 50%)`
                                }}
                            />
                            <span className="text-sm font-semibold text-white">
                                Attention Level: {hoveredZone.attention_level}%
                            </span>
                        </div>
                        <p className="text-sm text-gray-300">{hoveredZone.reason}</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-red-500 to-orange-500" />
                    <span>High Attention</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-500 to-green-500" />
                    <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-cyan-500" />
                    <span>Low Attention</span>
                </div>
            </div>
        </div>
    );
}
