import React, { useEffect, useRef, useState } from 'react';

// Amino acid properties for calculations
const AMINO_ACIDS = {
  'A': { mass: 71.07, pKa: 0 },
  'R': { mass: 156.18, pKa: 12.48 },
  'N': { mass: 114.08, pKa: 0 },
  'D': { mass: 115.08, pKa: 3.65 },
  'C': { mass: 103.14, pKa: 8.18 },
  'E': { mass: 129.11, pKa: 4.25 },
  'Q': { mass: 128.13, pKa: 0 },
  'G': { mass: 57.05, pKa: 0 },
  'H': { mass: 137.14, pKa: 6.00 },
  'I': { mass: 113.16, pKa: 0 },
  'L': { mass: 113.16, pKa: 0 },
  'K': { mass: 128.17, pKa: 10.53 },
  'M': { mass: 131.19, pKa: 0 },
  'F': { mass: 147.17, pKa: 0 },
  'P': { mass: 97.11, pKa: 0 },
  'S': { mass: 87.07, pKa: 0 },
  'T': { mass: 101.10, pKa: 0 },
  'W': { mass: 186.21, pKa: 0 },
  'Y': { mass: 163.17, pKa: 10.07 },
  'V': { mass: 99.13, pKa: 0 }
};

// Initial protein data
const initialProteinData = {
  'Î²-Galactosidase': {
    fullName: 'Beta-Galactosidase',
    organism: 'Escherichia coli',
    uniprotId: 'P00722',
    pdbId: '3DYP',
    function: 'Hydrolyzes lactose into glucose and galactose',
    mw: 116250,
    pH: 5.3,
    color: '#FF0000'
  },
  'Albumin': {
    fullName: 'Bovine Serum Albumin',
    organism: 'Bos taurus',
    uniprotId: 'P02769',
    pdbId: '3V03',
    function: 'Transport protein in blood plasma',
    mw: 66200,
    pH: 4.7,
    color: '#00FF00'
  },
  'Ovalbumin': {
    fullName: 'Ovalbumin',
    organism: 'Gallus gallus',
    uniprotId: 'P01012',
    pdbId: '1OVA',
    function: 'Major protein component in egg white',
    mw: 45000,
    pH: 4.6,
    color: '#0000FF'
  }
};

const calculateMolecularWeight = (sequence) => {
  return sequence.split('').reduce((total, aa) => {
    return total + (AMINO_ACIDS[aa]?.mass || 0);
  }, 0);
};

const calculateTheoreticalPI = (sequence) => {
  const counts = sequence.split('').reduce((acc, aa) => {
    if (AMINO_ACIDS[aa]?.pKa > 0) {
      acc[aa] = (acc[aa] || 0) + 1;
    }
    return acc;
  }, {});

  let totalPka = 0;
  let totalCount = 0;

  Object.entries(counts).forEach(([aa, count]) => {
    totalPka += AMINO_ACIDS[aa].pKa * count;
    totalCount += count;
  });

  return totalCount > 0 ? totalPka / totalCount : 7.0;
};

const parseFastaContent = (content) => {
  const sequences = [];
  let currentHeader = '';
  let currentSequence = '';

  content.split('\n').forEach(line => {
    line = line.trim();
    if (line.startsWith('>')) {
      if (currentHeader && currentSequence) {
        sequences.push({ header: currentHeader, sequence: currentSequence });
      }
      currentHeader = line.substring(1).trim();
      currentSequence = '';
    } else if (line) {
      currentSequence += line;
    }
  });

  if (currentHeader && currentSequence) {
    sequences.push({ header: currentHeader, sequence: currentSequence });
  }

  return sequences;
};

const extractProteinInfo = async (header, sequence) => {
  const match = header.match(/^gi\|(\d+)\|.*\|\s*(.*?)\s*\[(.*?)\]$/);
  const name = match ? match[2] : header;

  try {
    const response = await fetch(`https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(name)}&format=json`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        id: result.primaryAccession,
        name: name,
        organism: result.organism?.scientificName || (match ? match[3] : 'Unknown organism'),
        uniprotId: result.primaryAccession,
        pdbId: 'N/A',
        function: result.proteinDescription?.recommendedName?.fullName?.value || 'Function unknown'
      };
    }
  } catch (error) {
    console.error('Error fetching UniProt data:', error);
  }

  return {
    id: 'unknown',
    name: name,
    organism: match ? match[3] : 'Unknown organism',
    uniprotId: 'N/A',
    pdbId: 'N/A',
    function: 'Imported from FASTA file'
  };
};

const TwoDE = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const GEL_TOP = 30;
  const GEL_HEIGHT = 60;
  const IEF_BAND_HEIGHT = 40;
  const GEL_WIDTH = 700;
  const GEL_LEFT = 50;
  const TRANSFORMATION_DURATION = 1000; // 1 second for initial transformation
  const MIGRATION_DURATION = 4000; // 4 seconds for pH migration

// For the initial dots state
const [dots, setDots] = useState(
    Object.entries(initialProteinData).map(([name, data]) => ({
      name,
      ...data,
      x: GEL_LEFT,  // Start at exact left edge of gray rectangle
      y: GEL_TOP,   // Start at exact top of gray rectangle
      width: GEL_WIDTH,  // Full width of gray rectangle
      height: GEL_HEIGHT, // Full height of gray rectangle
      currentpH: 7,
      velocity: 0,
      settled: false,
      isInitial: true,
      opacity: 0.5  // For overlap visibility
    }))
  );

  const [hoveredDot, setHoveredDot] = useState(null);
  const [selectedDot, setSelectedDot] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [simulationState, setSimulationState] = useState('ready');
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [acrylamidePercentage, setAcrylamidePercentage] = useState(7.5);
  const [phRange, setPhRange] = useState({ min: 0, max: 14 });

  const MIN_PH = phRange.min;
  const MAX_PH = phRange.max;
  const PH_STEP = 2;
  const IEF_DURATION = 5000;
  const DAMPING = 0.95;
  const FORCE_MULTIPLIER = 0.5;

  const startIEF = () => {
    if (simulationState !== 'ready') return;
  
    setSimulationState('ief-running');
    setSimulationProgress(0);
  
    // Pre-calculate all final positions
    const targetPositions = dots.map(dot => ({
      targetX: getPHPosition(dot.pH),
    }));
  
    const startTime = Date.now();
    const TRANSFORM_DURATION = 1000;
  
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / TRANSFORM_DURATION, 1);
  
      setDots(prevDots => prevDots.map((dot, i) => {
        const target = targetPositions[i];
        
        // Calculate the center point where the bar should end up
        const finalCenterX = target.targetX + 1.5; // center of 3px wide bar
        
        // Calculate width reduction (from full width to 3px)
        const currentWidth = GEL_WIDTH * (1 - progress) + 3 * progress;
        
        // Calculate the current x position keeping the bar centered on its final position
        const currentX = finalCenterX - (currentWidth / 2);
  
        return {
          ...dot,
          width: currentWidth,
          x: currentX,
          height: GEL_HEIGHT * (1 - progress) + IEF_BAND_HEIGHT * progress,
          y: GEL_TOP + (GEL_HEIGHT - IEF_BAND_HEIGHT) / 2,
          settled: progress === 1
        };
      }));
  
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSimulationState('ief-complete');
      }
    };
  
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  const startSDS = () => {
    if (simulationState !== 'ief-complete') return;

    setSimulationState('sds-running');
    const steps = 50;
    let count = 0;
    const interval = setInterval(() => {
      setDots(prevDots =>
        prevDots.map(dot => {
          const migrationFactor = 1 - (acrylamidePercentage / 20);
          const targetPosY = getMWPosition(dot.mw, 600) * migrationFactor;
          return {
            ...dot,
            y: dot.y + (targetPosY - dot.y) * 0.1
          };
        })
      );
      count++;
      if (count >= steps) {
        clearInterval(interval);
        setSimulationState('complete');
      }
    }, 20);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleFileUpload = async (files) => {
    const colorPalette = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
      '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#808080'
    ];

    const processFile = async (file) => {
      if (!file.name.endsWith('.fasta') && !file.name.endsWith('.fa')) return null;

      try {
        const content = await file.text();
        const sequences = parseFastaContent(content);
        const currentDotsLength = dots.length;

        return Promise.all(sequences.map(async (seq, index) => {
          const mw = calculateMolecularWeight(seq.sequence);
          const pH = calculateTheoreticalPI(seq.sequence);
          const info = await extractProteinInfo(seq.header, seq.sequence);

          return {
            name: info.name,
            fullName: info.name,
            organism: info.organism,
            uniprotId: info.uniprotId,
            pdbId: info.pdbId,
            function: info.function,
            mw,
            pH,
            color: colorPalette[(currentDotsLength + index) % colorPalette.length],
            sequence: seq.sequence,
            x: GEL_LEFT,
            y: GEL_TOP,
            width: GEL_WIDTH,
            height: GEL_HEIGHT,
            currentpH: 7,
            velocity: 0,
            settled: false,
            isInitial: false,
            opacity: 0.5
          };
        }));
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        return null;
      }
    };

    const newProteinsArrays = await Promise.all(Array.from(files).map(processFile));
    const newProteins = newProteinsArrays.flat().filter(Boolean);
    
    if (newProteins.length > 0) {
      setDots(prevDots => [...prevDots, ...newProteins]);
    }
  };

  const handleFolderUpload = (items) => {
    const getFileEntries = async (item) => {
      if (item.isFile) {
        const file = await new Promise(resolve => item.file(resolve));
        if (file.name.endsWith('.fasta') || file.name.endsWith('.fa')) {
          return file;
        }
      } else if (item.isDirectory) {
        const reader = item.createReader();
        const entries = await new Promise(resolve => reader.readEntries(resolve));
        const files = await Promise.all(entries.map(getFileEntries));
        return files.flat();
      }
      return null;
    };

    const processItems = async () => {
      const entries = Array.from(items).map(item => item.webkitGetAsEntry());
      const files = await Promise.all(entries.map(getFileEntries));
      const validFiles = files.flat().filter(Boolean);
      
      if (validFiles.length > 0) {
        await handleFileUpload(validFiles);
      }
    };

    processItems().catch(console.error);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const items = e.dataTransfer.items;
    if (items?.length > 0) {
      await handleFolderUpload(items);
    } else {
      const files = Array.from(e.dataTransfer.files)
        .filter(file => file.name.endsWith('.fasta') || file.name.endsWith('.fa'));
      if (files.length > 0) {
        await handleFileUpload(files);
      }
    }
  };

  const getMWPosition = (mw, canvasHeight) => {
    const minMW = 1000;
    const maxMW = 1000000;
    const logMW = Math.log10(Math.min(Math.max(mw, minMW), maxMW));
    return 120 + ((Math.log10(maxMW) - logMW) / (Math.log10(maxMW) - Math.log10(minMW))) * (canvasHeight - 170);
  };

  const getPHPosition = (pH) => {
    const clampedPH = Math.min(Math.max(pH, MIN_PH), MAX_PH);
    // Calculate position within gray rectangle bounds
    return GEL_LEFT + ((clampedPH - MIN_PH) / (MAX_PH - MIN_PH)) * (GEL_WIDTH - 3);
  };
  
  const resetPositions = () => {
    setDots(prevDots => prevDots.filter(dot => dot.isInitial).map((dot, index) => ({
      ...dot,
      x: GEL_LEFT,
      y: GEL_TOP,
      width: GEL_WIDTH,
      height: GEL_HEIGHT,
      currentpH: 7,
      velocity: 0,
      settled: false,
      opacity: 0.5
    })));
    setHoveredDot(null);
    setSelectedDot(null);
    setSimulationState('ready');
    setSimulationProgress(0);
  };

  const clearProteins = () => {
    setDots(prevDots => prevDots.filter(dot => dot.isInitial));
    setHoveredDot(null);
    setSelectedDot(null);
  };

  const handleCanvasMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePos({ x: event.clientX, y: event.clientY });

    if (!selectedDot) {
      const hoveredDot = dots.find(dot => {
        if (simulationState === 'ready') {
          return y >= dot.y && y <= dot.y + dot.height;
        } else {
          const dx = x - dot.x;
          const dy = y - dot.y;
          return Math.sqrt(dx * dx + dy * dy) < 10;
        }
      });
      setHoveredDot(hoveredDot);
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedDot = dots.find(dot => {
      if (simulationState === 'ready') {
        return y >= dot.y && y <= dot.y + dot.height;
      } else {
        const dx = x - dot.x;
        const dy = y - dot.y;
        return Math.sqrt(dx * dx + dy * dy) < 10;
      }
    });

    setSelectedDot(clickedDot);
    setHoveredDot(null);
  };

  const handleDocumentClick = (event) => {
    const canvas = canvasRef.current;
    const infoCard = document.getElementById('protein-info-card');

    if (selectedDot &&
      !canvas.contains(event.target) &&
      (!infoCard || !infoCard.contains(event.target))) {
      setSelectedDot(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [selectedDot]);

  const handleCanvasMouseLeave = () => {
    if (!selectedDot) {
      setHoveredDot(null);
    }
  };

  const handleFileInputChange = async (e) => {
    const items = e.target.files;
    if (!items) return;

    const files = [];
    for (let i = 0; i < items.length; i++) {
      const file = items[i];
      if (file.name.endsWith('.fasta') || file.name.endsWith('.fa')) {
        files.push(file);
      }
    }

    await handleFileUpload(files);
  };

  const handleProteinClick = (dot) => {
    setSelectedDot(dot);
    setHoveredDot(null);

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: rect.left + dot.x,
        y: rect.top + dot.y
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gel rectangle
      ctx.fillStyle = '#333333';
      ctx.fillRect(GEL_LEFT, GEL_TOP, GEL_WIDTH, GEL_HEIGHT);

      // Draw pH gradient visualization if not in ready state
      if (simulationState !== 'ready') {
        const gradient = ctx.createLinearGradient(GEL_LEFT, 0, GEL_LEFT + GEL_WIDTH, 0);
        gradient.addColorStop(0, '#FF6B6B');   // Acidic
        gradient.addColorStop(0.5, '#4ECDC4'); // Neutral
        gradient.addColorStop(1, '#45B7D1');   // Basic

        ctx.fillStyle = gradient;
        ctx.fillRect(GEL_LEFT, GEL_TOP + GEL_HEIGHT + 10, GEL_WIDTH, 10);
      }

      // Draw Grid
      ctx.strokeStyle = '#444';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';

      // Draw axes based on simulation state
      if (simulationState === 'ief-complete' || simulationState === 'sds-running' || simulationState === 'complete') {
        // MW Axis Labels
        for (let y = 120; y <= canvas.height - 50; y += 100) {
          ctx.beginPath();
          ctx.moveTo(GEL_LEFT, y);
          ctx.lineTo(GEL_LEFT + GEL_WIDTH, y);
          ctx.stroke();
          const mwValue = Math.pow(10, Math.log10(1000000) - ((y - 120) / (canvas.height - 170)) * (Math.log10(1000000) - Math.log10(1000)));
          ctx.fillText(`${Math.round(mwValue / 1000) * 1000} Da`, 5, y + 5);
        }

        // pH Axis Labels
        for (let pH = MIN_PH; pH <= MAX_PH; pH += PH_STEP) {
          const x = getPHPosition(pH, canvas.width);
          ctx.beginPath();
          ctx.moveTo(x, 120);
          ctx.lineTo(x, canvas.height - 50);
          ctx.stroke();
          ctx.fillText(pH.toFixed(1), x - 10, canvas.height - 30);
        }
      }

      // Draw axis labels
      ctx.fillText('pH', canvas.width / 2, canvas.height - 10);
      ctx.fillText('MW (Da)', 10, canvas.height / 2);

      // Draw progress indicator during IEF
      if (simulationState === 'ief-running') {
        ctx.fillStyle = '#666';
        ctx.fillRect(GEL_LEFT, canvas.height - 20, GEL_WIDTH, 4);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(GEL_LEFT, canvas.height - 20, GEL_WIDTH * simulationProgress, 4);
      }

      // Draw Proteins
      dots.forEach(dot => {
        ctx.fillStyle = dot.color;

                  if (simulationState === 'ready') {
          // Draw overlapping rectangles within gel
          ctx.globalAlpha = dot.opacity;
          ctx.fillRect(dot.x, dot.y, dot.width, dot.height);
          ctx.globalAlpha = 1.0;

          if (dot === hoveredDot || dot === selectedDot) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(dot.x, dot.y, dot.width, dot.height);
          }
        } else if (simulationState === 'ief-running' || simulationState === 'ief-complete') {
          // Draw vertical bands within gel
          ctx.fillRect(
            dot.x - dot.width / 2,
            dot.y - dot.height / 2,
            dot.width,
            dot.height
          );

          if (dot === hoveredDot || dot === selectedDot) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(
              dot.x - dot.width / 2,
              dot.y - dot.height / 2,
              dot.width,
              dot.height
            );
          }
        } else {
          // Draw dots for SDS-PAGE
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, (dot === hoveredDot || dot === selectedDot) ? 8 : 5, 0, Math.PI * 2);
          ctx.fill();
          if (dot === hoveredDot || dot === selectedDot) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, [dots, hoveredDot, selectedDot, simulationState, simulationProgress, phRange, acrylamidePercentage]);

  const buttonStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #3a3a3a',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    width: '140px',
    marginBottom: '8px'
  };

  const buttonHoverEffect = (e) => {
    e.target.style.backgroundColor = '#2a2a2a';
    e.target.style.borderColor = '#4a4a4a';
  };

  const buttonLeaveEffect = (e) => {
    e.target.style.backgroundColor = '#1a1a1a';
    e.target.style.borderColor = '#3a3a3a';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      marginTop: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <button
          style={{
            ...buttonStyle,
            opacity: simulationState === 'ief-running' ? 0.5 : 1,
            cursor: simulationState === 'ready' ? 'pointer' : 'not-allowed'
          }}
          onClick={startIEF}
          disabled={simulationState !== 'ready'}
          onMouseOver={buttonHoverEffect}
          onMouseOut={buttonLeaveEffect}
        >
          First Dimension
        </button>
        <button
          style={{
            ...buttonStyle,
            opacity: simulationState !== 'ief-complete' ? 0.5 : 1,
            cursor: simulationState === 'ief-complete' ? 'pointer' : 'not-allowed'
          }}
          onClick={startSDS}
          disabled={simulationState !== 'ief-complete'}
          onMouseOver={buttonHoverEffect}
          onMouseOut={buttonLeaveEffect}
        >
          Second Dimension
        </button>
        <button
          style={{
            ...buttonStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onClick={resetPositions}
          onMouseOver={buttonHoverEffect}
          onMouseOut={buttonLeaveEffect}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2.5 12a9.5 9.5 0 1 1 9.5 9.5 9.5 9.5 0 0 1-9.5-9.5m9.5-9.5v9.5l5-4.5" />
          </svg>
          Reset
        </button>
        <label
          style={{
            ...buttonStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          onMouseOver={buttonHoverEffect}
          onMouseOut={buttonLeaveEffect}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload FASTA
          <input
            type="file"
            accept=".fasta,.fa"
            multiple
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            directory=""
            webkitdirectory=""
            mozdirectory=""
          />
        </label>
        <button
          style={{
            ...buttonStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onClick={clearProteins}
          onMouseOver={buttonHoverEffect}
          onMouseOut={buttonLeaveEffect}
        >
          Clear Proteins
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <label>pH Range:</label>
            <input
              type="number"
              min="0"
              max="14"
              step="0.1"
              value={phRange.min}
              onChange={(e) => setPhRange(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
              style={{
                width: '60px',
                padding: '4px',
                backgroundColor: '#282828',
                border: '1px solid #444',
                color: 'white',
                borderRadius: '4px'
              }}
            />
            <span>to</span>
            <input
              type="number"
              min="0"
              max="14"
              step="0.1"
              value={phRange.max}
              onChange={(e) => setPhRange(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
              style={{
                width: '60px',
                padding: '4px',
                backgroundColor: '#282828',
                border: '1px solid #444',
                color: 'white',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <label>Acrylamide %:</label>
            <select
              value={acrylamidePercentage}
              onChange={(e) => setAcrylamidePercentage(parseFloat(e.target.value))}
              style={{
                width: '80px',
                padding: '4px',
                backgroundColor: '#282828',
                border: '1px solid #444',
                color: 'white',
                borderRadius: '4px'
              }}
            >
              <option value={7.5}>7.5%</option>
              <option value={10}>10%</option>
              <option value={12.5}>12.5%</option>
              <option value={15}>15%</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#282828',
          borderRadius: '4px',
          width: '250px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Proteins</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
            flex: 1
          }}>
            {dots.map(dot => (
              <div
                key={dot.name}
                onClick={() => handleProteinClick(dot)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: '24px',
                  padding: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedDot?.name === dot.name ? '#3a3a3a' : 'transparent',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  minWidth: '12px',
                  backgroundColor: dot.color,
                  borderRadius: '50%'
                }} />
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '14px'
                }}>{dot.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ position: 'relative' }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              borderRadius: '4px'
            }}>
              <div style={{
                padding: '20px',
                border: '2px dashed #666',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                Drop FASTA files here
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{
              border: '1px solid #444',
              borderRadius: '4px'
            }}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
            onClick={handleCanvasClick}
          />

          {(hoveredDot || selectedDot) && (
            <div
              id="protein-info-card"
              style={{
                position: 'fixed',
                left: mousePos.x + 10,
                top: mousePos.y + 10,
                backgroundColor: '#282828',
                border: '1px solid #444',
                color: 'white',
                padding: '12px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 1000,
                minWidth: '200px',
                pointerEvents: selectedDot ? 'auto' : 'none'
              }}
            >
              <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>{(selectedDot || hoveredDot).fullName}</h4>
              <div style={{ fontSize: '14px', display: 'grid', gap: '4px' }}>
                <div>Source: {(selectedDot || hoveredDot).organism}</div>
                {(selectedDot || hoveredDot).uniprotId !== 'N/A' && (
                  <div>
                    UniProt: <a
                      href={`https://www.uniprot.org/uniprot/${(selectedDot || hoveredDot).uniprotId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#63B3ED', textDecoration: 'none' }}
                    >
                      {(selectedDot || hoveredDot).uniprotId}
                    </a>
                  </div>
                )}
                {(selectedDot || hoveredDot).pdbId !== 'N/A' && (
                  <div>
                    PDB: <a
                      href={`https://www.rcsb.org/structure/${(selectedDot || hoveredDot).pdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#63B3ED', textDecoration: 'none' }}
                    >
                      {(selectedDot || hoveredDot).pdbId}
                    </a>
                  </div>
                )}
                <div>MW: {(selectedDot || hoveredDot).mw.toLocaleString()} Da</div>
                <div>pH: {(selectedDot || hoveredDot).pH.toFixed(2)}</div>
                <div style={{ marginTop: '4px' }}>
                  <div style={{ fontWeight: 500 }}>Function:</div>
                  <div style={{ color: '#A0AEC0' }}>{(selectedDot || hoveredDot).function}</div>
                </div>
                {(selectedDot || hoveredDot).sequence && (
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontWeight: 500 }}>Sequence Preview:</div>
                    <div style={{
                      color: '#A0AEC0',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '300px'
                    }}>
                      {(selectedDot || hoveredDot).sequence.substring(0, 50)}...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoDE;