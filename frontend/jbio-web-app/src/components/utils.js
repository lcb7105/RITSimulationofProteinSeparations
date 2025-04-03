function calculateLogPosition(mw) {
    if (mw <= 0) return 1; // Bottom of scale
    const logMax = Math.log10(200000);
    const logMin = Math.log10(1);
    const logMW = Math.log10(mw);
    return (logMax - logMW) / (logMax - logMin);
}

function calculateSuppressor(acrylamidePercent) {
    if (acrylamidePercent === 6) return 12.0;
    if (acrylamidePercent === 8) return 10.0;
    if (acrylamidePercent > 7.5) return 2;
    return 1;
}

function drawAxes(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';

    // Draw Y axis (MW)
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, height - 50);
    ctx.stroke();

    // Define MW markers
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

        // Draw tick
        ctx.beginPath();
        ctx.moveTo(45, y);
        ctx.lineTo(50, y);
        ctx.stroke();

        // Draw label
        ctx.fillText(mwLabels[index], 5, y + 4);

        // Draw grid line
        ctx.strokeStyle = '#333333';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(width - 50, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = '#FFFFFF';
    });

    // Draw X axis (pH)
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(width - 50, height - 50);
    ctx.stroke();

    // Draw pH scale
    for (let pH = PH_RANGE.MIN; pH <= PH_RANGE.MAX; pH++) {
        const x = ((pH - PH_RANGE.MIN) / (PH_RANGE.MAX - PH_RANGE.MIN)) * (width - 100) + 50;
        ctx.beginPath();
        ctx.moveTo(x, height - 45);
        ctx.lineTo(x, height - 50);
        ctx.stroke();
        ctx.fillText(`pH ${pH}`, x - 10, height - 30);

        // Draw vertical grid lines
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
}