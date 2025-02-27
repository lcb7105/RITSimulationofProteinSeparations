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
  'β-Galactosidase': {
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

const extractProteinInfo = (header) => {
  const match = header.match(/^gi\|(\d+)\|.*\|\s*(.*?)\s*\[(.*?)\]$/);
  return {
    id: match ? match[1] : 'unknown',
    name: match ? match[2] : header,
    organism: match ? match[3] : 'Unknown organism'
  };
};

const TwoDE = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [dots, setDots] = useState(
    Object.entries(initialProteinData).map(([name, data]) => ({ 
      name, 
      ...data, 
      x: 50, 
      y: 300,
      currentpH: 7,
      velocity: 0,
      settled: false 
    }))
  );
  
  const [hoveredDot, setHoveredDot] = useState(null);
  const [selectedDot, setSelectedDot] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [simulationState, setSimulationState] = useState('ready'); // 'ready', 'ief-running', 'ief-complete', 'sds-running', 'complete'
  const [simulationProgress, setSimulationProgress] = useState(0);
  
  // New states for implementing requested features
  const [phRange, setPhRange] = useState({ min: 0, max: 14 });
  const [yAxisMode, setYAxisMode] = useState('mw'); // 'mw' or 'distance'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Constants
  const MIN_PH = phRange.min;
  const MAX_PH = phRange.max;
  const PH_STEP = 2;
  const IEF_DURATION = 5000; // 5 seconds
  const DAMPING = 0.95; // Damping factor for oscillation
  const FORCE_MULTIPLIER = 0.5; // Strength of pH gradient force
  const MAX_DISTANCE_TRAVELED = 6; // Maximum distance traveled in cm

  const startIEF = () => {
    if (simulationState !== 'ready') return;
    
    setSimulationState('ief-running');
    setSimulationProgress(0);
    
    // Reset protein positions with random spread around their initial positions
    setDots(prevDots => prevDots.map(dot => {
      const startX = Math.random() * 700 + 50; // Random position across the width
      const spreadY = Math.random() * 20 + 50; // Random spread in upper portion (adjusted for new layout)
      return {
        ...dot,
        x: startX,
        y: spreadY,
        currentpH: MIN_PH + ((startX - 50) / (750)) * (MAX_PH - MIN_PH),
        bandWidth: 40, // Initial band width
        settled: false
      };
    }));

    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / IEF_DURATION, 1);
      
      setSimulationProgress(progress);

      setDots(prevDots => prevDots.map(dot => {
        if (dot.settled) return dot;

        // Calculate target X position based on protein's pI
        // Ensure protein stays within pH boundaries
        const clampedPH = Math.min(Math.max(dot.pH, MIN_PH), MAX_PH);
        const targetX = getPHPosition(clampedPH, 800);
        
        // Move X position towards target with easing
        const dx = targetX - dot.x;
        const newX = dot.x + dx * (0.1 + progress * 0.2); // Accelerate movement with progress
        
        // Gradually decrease band width as progress increases
        const newBandWidth = Math.max(3, dot.bandWidth * (1 - progress * 0.8));
        
        // Calculate Y position for band formation
        const baseY = 80; // Base Y position for bands
        const settled = Math.abs(dx) < 1;

        return {
          ...dot,
          x: newX,
          y: baseY,
          bandWidth: newBandWidth,
          settled: settled
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
    
    // Condense proteins at the bottom of IEF band first
    setDots(prevDots => 
      prevDots.map(dot => ({
        ...dot,
        y: 150, // Move to bottom of IEF band
        condensing: true,
        bandWidth: 3 // Reduce band width
      }))
    );

    // Wait for condensing animation, then start SDS-PAGE
    setTimeout(() => {
      const steps = 50;
      let count = 0;
      const interval = setInterval(() => {
        setDots(prevDots =>
          prevDots.map(dot => {
            // Calculate target Y position based on molecular weight or distance traveled
            const targetPosY = yAxisMode === 'mw' 
              ? getMWPosition(dot.mw, 600)
              : getDistancePosition(dot.mw, 600);
              
            return {
              ...dot,
              y: dot.y + (targetPosY - dot.y) * 0.1,
              condensing: false
            };
          })
        );
        count++;
        if (count >= steps) {
          clearInterval(interval);
          setSimulationState('complete');
        }
      }, 20);
    }, 1000); // 1 second for condensing animation
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const newProteins = [];
    const colorPalette = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
      '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#808080'
    ];

    for (let i = 0; i < files.length; i++) {
      // Update progress
      setUploadProgress((i / files.length) * 100);
      
      const file = files[i];
      if (!file.name.endsWith('.fasta') && !file.name.endsWith('.fa')) continue;

      try {
        const content = await file.text();
        const sequences = parseFastaContent(content);

        sequences.forEach((seq, index) => {
          const mw = calculateMolecularWeight(seq.sequence);
          const pH = calculateTheoreticalPI(seq.sequence);
          const info = extractProteinInfo(seq.header);
          
          newProteins.push({
            name: info.name,
            fullName: info.name,
            organism: info.organism,
            uniprotId: 'N/A',
            pdbId: 'N/A',
            function: 'Imported from FASTA file',
            mw,
            pH,
            color: colorPalette[newProteins.length % colorPalette.length],
            sequence: seq.sequence,
            x: 50,
            y: 300,
            currentpH: 7,
            velocity: 0,
            settled: false
          });
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    setDots(prevDots => [...prevDots, ...newProteins]);
    setIsUploading(false);
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
    
    const files = [...e.dataTransfer.files];
    await handleFileUpload(files);
  };

  const getMWPosition = (mw, canvasHeight) => {
    const minMW = 1000;
    const maxMW = 1000000;
    const logMW = Math.log10(Math.min(Math.max(mw, minMW), maxMW));
    return 170 + ((Math.log10(maxMW) - logMW) / (Math.log10(maxMW) - Math.log10(minMW))) * (canvasHeight - 220);
  };

  const getDistancePosition = (mw, canvasHeight) => {
    // Calculate distance traveled based on molecular weight
    // Smaller proteins travel farther
    const minMW = 1000;
    const maxMW = 1000000;
    const normalizedMW = (Math.log10(Math.min(Math.max(mw, minMW), maxMW)) - Math.log10(minMW)) / 
                        (Math.log10(maxMW) - Math.log10(minMW));
    // Invert the relationship - smaller proteins travel farther
    const distance = MAX_DISTANCE_TRAVELED * (1 - normalizedMW);
    // Map to canvas coordinates
    return 170 + (distance / MAX_DISTANCE_TRAVELED) * (canvasHeight - 220);
  };

  const getPHPosition = (pH, canvasWidth) => {
    const clampedPH = Math.min(Math.max(pH, MIN_PH), MAX_PH);
    return 50 + ((clampedPH - MIN_PH) / (MAX_PH - MIN_PH)) * (canvasWidth - 100);
  };

  const resetPositions = () => {
    setDots(prevDots => prevDots.map(dot => ({ 
      ...dot, 
      x: 50, 
      y: 300,
      currentpH: 7,
      velocity: 0,
      settled: false
    })));
    setHoveredDot(null);
    setSelectedDot(null);
    setSimulationState('ready');
    setSimulationProgress(0);
  };

  const handleCanvasMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePos({ x: event.clientX, y: event.clientY });

    if (!selectedDot) {
      const hoveredDot = dots.find(dot => {
        const dx = x - dot.x;
        const dy = y - dot.y;
        return Math.sqrt(dx * dx + dy * dy) < 10;
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
      const dx = x - dot.x;
      const dy = y - dot.y;
      return Math.sqrt(dx * dx + dy * dy) < 10;
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

  // Handler for pH range input
  const handlePhRangeChange = (type, value) => {
    if (type === 'min') {
      // Ensure min pH is less than max pH
      const newMin = Math.min(parseFloat(value), phRange.max - 0.1);
      setPhRange(prev => ({ ...prev, min: newMin }));
    } else {
      // Ensure max pH is greater than min pH
      const newMax = Math.max(parseFloat(value), phRange.min + 0.1);
      setPhRange(prev => ({ ...prev, max: newMax }));
    }
  };

  // Handler for pH slider
  const handlePhSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    const type = e.target.id.includes('min') ? 'min' : 'max';
    handlePhRangeChange(type, value);
  };

  // Toggle Y-axis mode
  const toggleYAxisMode = () => {
    setYAxisMode(prev => prev === 'mw' ? 'distance' : 'mw');
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
    const files = [...e.target.files];
    await handleFileUpload(files);
  };

  const handleProteinClick = (dot) => {
    setSelectedDot(dot);
    setHoveredDot(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw loading zone indicator when in ready state
      if (simulationState === 'ready') {
        ctx.fillStyle = '#333333';
        ctx.fillRect(30, 280, 40, 40);
      }

      // Draw IEF Gel and pH gradient
      if (simulationState !== 'ready') {
        // Draw IEF band/gel
        ctx.fillStyle = '#222222';
        ctx.fillRect(50, 50, canvas.width - 100, 100); // IEF band area
        
        // Draw pH gradient visualization above IEF band
        const gradient = ctx.createLinearGradient(50, 0, canvas.width - 50, 0);
        gradient.addColorStop(0, '#FF6B6B');   // Acidic
        gradient.addColorStop(0.5, '#4ECDC4'); // Neutral
        gradient.addColorStop(1, '#45B7D1');   // Basic
        
        ctx.fillStyle = gradient;
        ctx.fillRect(50, 30, canvas.width - 100, 10);
        
        // Draw pH labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.fillText(MIN_PH.toFixed(1), 45, 25);
        ctx.fillText(MAX_PH.toFixed(1), canvas.width - 50, 25);
      }

      // Draw Grid
      ctx.strokeStyle = '#444';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';

      // Draw SDS-PAGE area separator
      if (simulationState === 'ief-complete' || simulationState === 'sds-running' || simulationState === 'complete') {
        ctx.fillStyle = '#222222';
        ctx.fillRect(50, 170, canvas.width - 100, canvas.height - 220);
      }

      // Draw axes based on simulation state
      if (simulationState === 'ief-complete' || simulationState === 'sds-running' || simulationState === 'complete') {
        // Y-Axis Labels based on selected mode
        if (yAxisMode === 'mw') {
          // MW Axis Labels
          for (let y = 170; y <= canvas.height - 50; y += 100) {
            ctx.beginPath();
            ctx.moveTo(50, y);
            ctx.lineTo(canvas.width - 50, y);
            ctx.stroke();
            const mwValue = Math.pow(10, Math.log10(1000000) - ((y - 170) / (canvas.height - 220)) * (Math.log10(1000000) - Math.log10(1000)));
            ctx.fillStyle = '#FFFFFF';

            ctx.fillText(`${Math.round(mwValue / 1000) * 1000} Da`, 10, y + 5);
          }
        } else {
          // Distance Traveled Axis Labels
          for (let i = 0; i <= MAX_DISTANCE_TRAVELED; i++) {
            const y = 170 + (i / MAX_DISTANCE_TRAVELED) * (canvas.height - 220);
            ctx.beginPath();
            ctx.moveTo(50, y);
            ctx.lineTo(canvas.width - 50, y);
            ctx.stroke();
            ctx.fillStyle = '#FFFFFF';

            ctx.fillText(`${i} cm`, 25, y + 5);
          }
        }

        // pH Axis Labels
        for (let pH = MIN_PH; pH <= MAX_PH; pH += PH_STEP) {
          const x = getPHPosition(pH, canvas.width);
          ctx.beginPath();
          ctx.moveTo(x, 170);
          ctx.lineTo(x, canvas.height - 50);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';

          ctx.fillText(pH.toFixed(1), x - 10, canvas.height - 30);
        }
      }

      // Draw axis labels
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('pH', canvas.width / 2, canvas.height - 10);
      ctx.fillText(yAxisMode === 'mw' ? 'MW (Da)' : 'Distance (cm)', 10, canvas.height / 2);

      // Draw progress indicator during IEF
      if (simulationState === 'ief-running') {
        ctx.fillStyle = '#666';
        ctx.fillRect(50, canvas.height - 20, canvas.width - 100, 4);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(50, canvas.height - 20, (canvas.width - 100) * simulationProgress, 4);
      }

      // Draw Bands and Dots
      dots.forEach(dot => {
        ctx.fillStyle = dot.color;
        
        if (simulationState === 'ready') {
          // Draw dots in loading zone
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, (dot === hoveredDot || dot === selectedDot) ? 8 : 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (simulationState === 'ief-running' || simulationState === 'ief-complete') {
          if (dot.condensing) {
            // Draw small dot during condensing phase
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Draw vertical bands in IEF
            const bandHeight = 40; // Fixed height for bands
            ctx.fillRect(
              dot.x - dot.bandWidth / 2,
              dot.y - bandHeight / 2,
              dot.bandWidth,
              bandHeight
            );
            
            if (dot === hoveredDot || dot === selectedDot) {
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 2;
              ctx.strokeRect(
                dot.x - dot.bandWidth / 2,
                dot.y - bandHeight / 2,
                dot.bandWidth,
                bandHeight
              );
            }
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
  }, [dots, hoveredDot, selectedDot, simulationState, simulationProgress, phRange, yAxisMode]);

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

  const sliderStyle = {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    outline: 'none',
    opacity: '0.7',
    transition: 'opacity 0.2s',
    WebkitAppearance: 'none',
    backgroundColor: '#555',
    cursor: 'pointer'
  };

  const inputStyle = {
    background: '#2a2a2a',
    border: '1px solid #444',
    color: 'white',
    width: '50px',
    padding: '4px',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center'
  };

  // Circular progress indicator component
  const CircularProgress = ({ progress }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);
    
    return (
      <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle 
            cx="25" 
            cy="25" 
            r={radius} 
            stroke="#333" 
            strokeWidth="4" 
            fill="none" 
          />
          <circle 
            cx="25" 
            cy="25" 
            r={radius} 
            stroke="#4CAF50" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 25 25)"
          />
        </svg>
        <div style={{ position: 'absolute', fontSize: '12px' }}>
          {Math.round(progress)}%
        </div>
      </div>
    );
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
            <path d="M2.5 12a9.5 9.5 0 1 1 9.5 9.5 9.5 9.5 0 0 1-9.5-9.5m9.5-9.5v9.5l5-4.5"/>
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload FASTA
          <input
            type="file"
            accept=".fasta,.fa"
            multiple
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
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
          onClick={toggleYAxisMode}
          onMouseOver={buttonHoverEffect}
          onMouseOut={buttonLeaveEffect}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v18M3 8h10M3 16h10M16 3v18M16 8h5M16 16h5"/>
          </svg>
          {yAxisMode === 'mw' ? 'Show Distance' : 'Show MW'}
        </button>
        </div>

{/* pH Range Slider */}
<div style={{ marginBottom: '20px', padding: '0 20px', maxWidth: '800px', alignSelf: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <label style={{ fontSize: '14px', width: '120px' }}>pH Range:</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
      <input 
        type="number" 
        min="0" 
        max="14" 
        step="0.1" 
        value={phRange.min} 
        onChange={(e) => handlePhRangeChange('min', e.target.value)}
        style={inputStyle}
      />
      <input 
        type="range" 
        id="ph-min-slider"
        min="0" 
        max="14" 
        step="0.1" 
        value={phRange.min}
        onChange={handlePhSliderChange}
        style={{ ...sliderStyle, flex: 1 }}
      />
      <input 
        type="range" 
        id="ph-max-slider"
        min="0" 
        max="14" 
        step="0.1" 
        value={phRange.max}
        onChange={handlePhSliderChange}
        style={{ ...sliderStyle, flex: 1 }}
      />
      <input 
        type="number" 
        min="0" 
        max="14" 
        step="0.1" 
        value={phRange.max} 
        onChange={(e) => handlePhRangeChange('max', e.target.value)}
        style={inputStyle}
      />
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
          }}/>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '14px'
          }}>{dot.name}</span>
        </div>
      ))}
    </div>
    
    {/* Upload Progress Indicator */}
    {isUploading && (
      <div style={{ 
        marginTop: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <div style={{ marginBottom: '8px', fontSize: '14px' }}>Uploading FASTA...</div>
        <CircularProgress progress={uploadProgress} />
      </div>
    )}
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