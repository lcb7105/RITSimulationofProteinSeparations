import React, { useState, useEffect, useRef } from 'react';

const MW_RANGE = {
    MIN: 0,
    MAX: 200000
};

const PH_RANGE = {
    MIN: 3,
    MAX: 10
};

const DEFAULT_PROTEINS = [
    { name: "β-Galactosidase", color: "#4287f5", mw: 116000, pI: 4.6 },
    { name: "Phosphorylase B", color: "#42f587", mw: 97000, pI: 6.8 },
    { name: "Serum Albumin", color: "#42d4f5", mw: 66000, pI: 5.7 },
    { name: "Ovalbumin", color: "#f542f2", mw: 45000, pI: 4.5 },
    { name: "Carbonic Anhydrase", color: "#f54242", mw: 29000, pI: 6.6 },
    { name: "Trypsin Inhibitor", color: "#4542f5", mw: 20100, pI: 4.5 },
    { name: "Lysozyme", color: "#42f5d4", mw: 14300, pI: 9.2 },
    { name: "Aprotinin", color: "#f58742", mw: 6500, pI: 10.5 }
];

const TwoDe = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [stage, setStage] = useState('ready');
    const [proteins, setProteins] = useState(DEFAULT_PROTEINS.map((p, index) => ({
        ...p,
        xPos: 50 + (index * 20),
        yPos: 50,
        targetX: 50 + (index * 20),
        targetY: 50
    })));
    const [settings, setSettings] = useState({
        iefVoltage: 300,
        sdsVoltage: 50,
        acrylamide: 7.5
    });

    const drawAxes = (ctx, width, height) => {
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';

        // Y axis (MW)
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(50, height - 50);
        ctx.stroke();

        // MW markers
        const mwMarkers = [200000, 100000, 50000, 25000, 10000, 0];
        const mwLabels = ['200k', '100k', '50k', '25k', '10k', '0'];

        // Draw log scale ticks for MW
        mwMarkers.forEach((mw, index) => {
            // Special case for 0
            let y;
            if (mw === 0) {
                y = height - 50; // Bottom of scale
            } else {
                const logMax = Math.log10(200000);
                const logMin = Math.log10(1); // Using 1 instead of 0 for log calculation
                const logMW = Math.log10(mw);

                // Calculate position (reversed since we want high values at top)
                const percentage = (logMax - logMW) / (logMax - logMin);
                y = 50 + percentage * (height - 100);
            }
            // Tick
            ctx.beginPath();
            ctx.moveTo(45, y);
            ctx.lineTo(50, y);
            ctx.stroke();

            // label
            ctx.fillText(mwLabels[index], 5, y + 4);

            // Grid
            ctx.strokeStyle = '#333333';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(50, y);
            ctx.lineTo(width - 50, y);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#FFFFFF';
        });

        // X axis (pH)
        ctx.beginPath();
        ctx.moveTo(50, height - 50);
        ctx.lineTo(width - 50, height - 50);
        ctx.stroke();

        // pH scale
        for (let pH = PH_RANGE.MIN; pH <= PH_RANGE.MAX; pH++) {
            const x = ((pH - PH_RANGE.MIN) / (PH_RANGE.MAX - PH_RANGE.MIN)) * (width - 100) + 50;

            ctx.beginPath();
            ctx.moveTo(x, height - 45);
            ctx.lineTo(x, height - 50);
            ctx.stroke();
            ctx.fillText(`pH ${pH}`, x - 10, height - 30);

            ctx.strokeStyle = '#333333';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x, 50);
            ctx.lineTo(x, height - 50);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#FFFFFF';
        }

        ctx.restore();
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#FF0000';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        drawAxes(ctx, canvas.width, canvas.height);

        proteins.forEach(protein => {
            ctx.fillStyle = protein.color;
            ctx.beginPath();
            ctx.arc(protein.xPos, protein.yPos, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const calculateTargets = (dimension) => {
        const canvas = canvasRef.current;
        if (!canvas) return proteins;

        return proteins.map(protein => {
            if (dimension === 'ief') {
                console.log("148");
                const targetX = ((protein.pI - PH_RANGE.MIN) / (PH_RANGE.MAX - PH_RANGE.MIN)) *
                    (canvas.width - 100) + 50;
                return {
                    ...protein,
                    targetX,
                    targetY: 50
                };
            } else if (dimension === 'sds') {
                let migrationDistance = getFormula(protein.acrylamide)(Math.log10(protein.mw));
                migrationDistance = Math.min(migrationDistance, 1);
                const logMax = Math.log10(200000);
                const logMin = Math.log10(1);
                const logMW = Math.log10(protein.mw);
                const logPosition = (logMax - logMW) / (logMax - logMin);
                const targetY = logPosition * (canvas.height - 100) + 50;
                return {
                    ...protein,
                    targetY,
                    migrationDistance
                };
            }
            return protein;
        });
    };

    const getFormula = (percentage) => {
        switch (percentage) {
            case '7.5%':
                return (logMW) => -0.5931 * logMW + 3.2255;
            case '10%':
                return (logMW) => -0.6232 * logMW + 3.3396;
            case '12%':
                return (logMW) => -0.6581 * logMW + 3.4690;
            case '15%':
                return (logMW) => -0.6793 * logMW + 3.5972;
            default:
                return (logMW) => 0;
        }
    };

    const updatePositions = () => {
        const voltage = stage === 'ief' ? settings.iefVoltage : settings.sdsVoltage;
        let suppressor = 1;
        if (settings.acrylamide === 6) {
            suppressor = 12;
        }
        else if (settings.acrylamide === 8) {
            suppressor = 10;
        }
        else if (settings.acrylamide === 10) {
            suppressor = 7.5;
        }
        else if (settings.acrylamide === 12) {
            suppressor = 5;
        }

        let allComplete = true;

        setProteins(prevProteins => prevProteins.map(protein => {
            const newProtein = { ...protein };

            if (stage === 'ief') {
                const dx = (protein.targetX - protein.xPos) * 0.1 * (voltage / 500);
                newProtein.xPos += dx;
                if (Math.abs(protein.targetX - newProtein.xPos) > 0.1) {
                    allComplete = false;
                }
            } else if (stage === 'sds') {
                const dy = (protein.targetY - protein.yPos) * 0.1 * (voltage / 50) * (1 / suppressor);
                newProtein.yPos += dy;
                if (Math.abs(protein.targetY - newProtein.yPos) > 0.1) {
                    allComplete = false;
                }
            }

            return newProtein;
        }));

        if (allComplete) {

            if (stage === 'ief') {
                console.log("227=======================");
                setStage('ief-complete');
            } else if (stage === 'sds') {
                setStage('complete');
            }
        }
    };

    const animate = () => {
        if (stage === 'ief' || stage === 'sds') {
            console.log("237");
            updatePositions();
            draw();
            animationRef.current = requestAnimationFrame(animate);
        }
        else if (stage === "ief-complete") {
            console.log("ief-complete");
            draw();
        }
    };

    const handleStart = () => {
        console.log("226");
        // Reset all proteins to starting positions
        setProteins(prevProteins => prevProteins.map((p, index) => ({
            ...p,
            xPos: 50 + (index * 20),
            yPos: 50,
            targetX: 50 + (index * 20),
            targetY: 50
        })));

        // Calculate targets for first dimension
        const proteinsWithTargets = calculateTargets('ief');
        setProteins(proteinsWithTargets);

        setStage('ief');
    };

    const handleStop = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        setStage('ready');
        setProteins(prevProteins => prevProteins.map((p, index) => ({
            ...p,
            xPos: 50 + (index * 20),
            yPos: 50,
            targetX: 50 + (index * 20),
            targetY: 50
        })));

        draw();
    };

    const handleSecondDimension = () => {
        console.log("second dimension");
        // Keep X positions but reset Y positions and calculate new Y targets
        setProteins(prevProteins => {
            const resetProteins = prevProteins.map(p => ({
                ...p,
                yPos: 50
            }));
            return calculateTargets('sds');
        });

        setStage('sds');
    };

    useEffect(() => {
        console.log("274");
        if (stage === 'ief' || stage === 'sds') {
            animationRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationRef.current && stage === 'ief-complete') {
                cancelAnimationFrame(animationRef.current);
                draw();
            }
        };
    }, [stage, settings, animate]);

    // Initial draw
    useEffect(() => {
        draw();
    }, []);

    return (
        <div className="flex flex-col space-y-4 p-4">
            <div>
                <header>
                    <title>2D Gel Electrophoresis Simulation</title>
                </header>
                <div>
                    <div className="flex gap-8">
                        <div className="w-64 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Voltage (IEF)</h3>
                                <input type="radio"
                                    value={settings.iefVoltage.toString()}
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, iefVoltage: parseInt(value) }))}
                                />
                                {[300, 400, 500, 600].map((v) => (
                                    <div key={v} className="flex items-center space-x-2">
                                        <input type="radio" value={v.toString()} id={`ief-${v}`} />
                                        <label htmlFor={`ief-${v}`}>{v}V</label>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Voltage (SDS)</h3>
                                <input type="radio"
                                    value={settings.sdsVoltage.toString()}
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, sdsVoltage: parseInt(value) }))}
                                />
                                {[50, 100, 150, 200].map((v) => (
                                    <div key={v} className="flex items-center space-x-2">
                                        <input type="radio" value={v.toString()} id={`sds-${v}`} />
                                        <label htmlFor={`sds-${v}`}>{v}V</label>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Acrylamide %</h3>
                                <input type="radio"
                                    value={settings.acrylamide.toString()}
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, acrylamide: parseFloat(value) }))}
                                />
                                {[7.5, 10, 12, 15].map((v) => (
                                    <div key={v} className="flex items-center space-x-2">
                                        <input type="radio" value={v.toString()} id={`acr-${v}`} />
                                        <label htmlFor={`acr-${v}`}>{v}%</label>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Controls</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleStart}
                                        disabled={stage !== 'ready'}
                                    >
                                        Start
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        disabled={stage === 'ready'}
                                    >
                                        Stop
                                    </button>
                                    <button
                                        onClick={handleSecondDimension}
                                        disabled={stage !== 'ief-complete'}
                                    >
                                        Start Second Dimension
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Loaded Proteins</h3>
                                <div className="space-y-2">
                                    {proteins.map((protein) => (
                                        <div key={protein.name} className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: protein.color }}
                                            />
                                            <span>{protein.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={600}
                                className="border border-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoDe;