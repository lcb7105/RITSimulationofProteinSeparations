import React, { useEffect, useRef, useState } from 'react';

const TwoDE = () => {
    const canvasRef = useRef(null);
    const [dots, setDots] = useState([
        { name: 'Î²-Gal', mw: 116000, pH: 5.3, color: '#FF0000', x: 50, y: 50 },
        { name: 'Albumin', mw: 66000, pH: 4.7, color: '#00FF00', x: 50, y: 50 },
        { name: 'Ovalbumin', mw: 45000, pH: 4.6, color: '#0000FF', x: 50, y: 50 },
        { name: 'Carbonic A.', mw: 29000, pH: 6.5, color: '#FFFF00', x: 50, y: 50 },
        { name: 'Lysozyme', mw: 14300, pH: 11.0, color: '#FF00FF', x: 50, y: 50 },
        { name: 'Aprotinin', mw: 6500, pH: 10.5, color: '#00FFFF', x: 50, y: 50 }
    ]);

    const getMWPosition = (mw, canvasHeight) => {
        const topMargin = 50;
        const bottomMargin = 50;
        const usableHeight = canvasHeight - (topMargin + bottomMargin);
        const logMW = Math.log10(mw);
        const logMax = Math.log10(200000);
        const logMin = Math.log10(5000);
        const percentage = (logMax - logMW) / (logMax - logMin);
        return topMargin + (percentage * usableHeight);
    };

    const getPHPosition = (pH, canvasWidth) => {
        const leftMargin = 50;
        const rightMargin = 50;
        return leftMargin + ((pH - 3) / (11 - 3)) * (canvasWidth - (leftMargin + rightMargin));
    };

    const animateDots = (targetX, targetY) => {
        const steps = 50;
        let count = 0;
        const interval = setInterval(() => {
            setDots(prevDots => prevDots.map(dot => {
                const targetPosX = targetX ? getPHPosition(dot.pH, 800) : dot.x;
                const targetPosY = targetY ? getMWPosition(dot.mw, 600) : dot.y;
                return {
                    ...dot,
                    x: dot.x + (targetPosX - dot.x) * 0.1,
                    y: dot.y + (targetPosY - dot.y) * 0.1
                };
            }));
            count++;
            if (count >= steps) clearInterval(interval);
        }, 20);
    };

    const resetPositions = () => {
        setDots(prevDots => prevDots.map(dot => ({ ...dot, x: 50, y: 50 })));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#333333';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';

            for (let pH = 3; pH <= 10; pH++) {
                const x = getPHPosition(pH, canvas.width);
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.moveTo(x, 50);
                ctx.lineTo(x, canvas.height - 50);
                ctx.stroke();
                ctx.fillText(`pH ${pH}`, x - 10, canvas.height - 30);
            }

            const mwMarkers = [200000, 100000, 50000, 25000, 10000];
            mwMarkers.forEach(mw => {
                const y = getMWPosition(mw, canvas.height);
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.moveTo(50, y);
                ctx.lineTo(canvas.width - 50, y);
                ctx.stroke();
                const label = mw >= 1000 ? `${mw/1000}k` : mw;
                ctx.fillText(label, 10, y + 4);
            });

            dots.forEach(dot => {
                ctx.fillStyle = dot.color;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(dot.name, dot.x - 30, dot.y + 15);
            });

            requestAnimationFrame(draw);
        };

        draw();
    }, [dots]);

    return (
        <div className="flex p-4 bg-gray-900 text-white">
            <div className="w-64 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Controls</h3>
                <button className="px-4 py-2 bg-blue-500 rounded mb-2 w-full" onClick={() => animateDots(true, false)}>First Dimension</button>
                <button className="px-4 py-2 bg-green-500 rounded mb-2 w-full" onClick={() => animateDots(false, true)}>Second Dimension</button>
                <button className="px-4 py-2 bg-red-500 rounded w-full" onClick={resetPositions}>Reset</button>
                <h3 className="text-lg font-semibold mt-4 mb-2">Loaded Proteins</h3>
                <ul>
                    {dots.map(dot => (
                        <li key={dot.name} className="flex items-center mb-1">
                            <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: dot.color }}></span>
                            {dot.name}
                        </li>
                    ))}
                </ul>
            </div>
            <canvas ref={canvasRef} width={800} height={600} className="border border-gray-600 ml-4" />
        </div>
    );
};

export default TwoDE;