// --- Select HTML Elements ---
// Make sure these run *after* the HTML elements exist
const canvas = document.getElementById('magicCircleCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const numRingsSlider = document.getElementById('numRingsSlider');
const numRingsValueSpan = document.getElementById('numRingsValue');
const symbolSetSelect = document.getElementById('symbolSetSelect');
const innerShapeSelect = document.getElementById('innerShapeSelect');
const numSymbolsSlider = document.getElementById('numSymbolsSlider');
const numSymbolsValueSpan = document.getElementById('numSymbolsValue');
const primaryColorPicker = document.getElementById('primaryColorPicker');
const secondaryColorPicker = document.getElementById('secondaryColorPicker');
const glowToggle = document.getElementById('glowToggle');

// --- Check if elements were found (Check ALL essential ones) ---
if (!canvas) console.error("ERROR: Canvas element not found!");
if (!ctx) console.error("ERROR: Canvas context could not be created!");
if (!generateBtn) console.error("ERROR: Generate button not found!");
// *** USE CORRECTED VARIABLE NAMES IN CHECKS ***
if (!numRingsSlider) console.error("ERROR: Number of Rings Slider not found!");
if (!numRingsValueSpan) console.error("ERROR: Number of Rings Value Span not found!");
if (!symbolSetSelect) console.error("ERROR: Symbol Set Select dropdown not found!");
if (!innerShapeSelect) console.error("ERROR: Inner Shape Select dropdown not found!");
if (!numSymbolsSlider) console.error("ERROR: Number of Symbols Slider not found!");
if (!numSymbolsValueSpan) console.error("ERROR: Number of Symbols Value Span not found!");
if (!primaryColorPicker) console.error("ERROR: Primary Color Picker not found!");
if (!secondaryColorPicker) console.error("ERROR: Secondary Color Picker not found!");
if (!glowToggle) console.error("ERROR: Glow Toggle checkbox not found!");



// --- Thematic Symbol Sets ---

const geometricSymbols = [
    '◇', '◆', '◈', '◉', '○', '●', '⊕', '⊖', '⊗', '⊘', '⊙',
    '△', '▲', '▷', '▽', '▼', '◁', ' M', ' M',
    '□', '■', '▢', '▣', ' M', ' M',
    '☆', '★', '✶', '✷', '✸', '✹', '✺', '✡', '✨',
    '🌀', '⌘', '♾', // Spiral, Command, Infinity
];

const astrologySymbols = [
    '☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇', // Sun, Moon, Planets
    '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', // Zodiac
    '☌', '☍', '⚹', '□', '△', // Aspects (Conjunction, Opposition, Sextile, Square, Trine)
    ' M', ' M' // Nodes (Ascending, Descending - Placeholders if font lacks them)
];

const alchemySymbols = [
    '🜁', '🜂', '🜃', '🜄', // Elements: Air, Fire, Water, Earth
    '🜀', // Quintessence / Aether
    '🜇', // Sulfur
    '🜍', // Quicksilver / Mercury
    '🜔', // Salt
    '🜚', // Gold / Sol
    ' M', // Silver / Luna (using Moon symbol as fallback)
    '♀', // Copper / Venus
    '♂', // Iron / Mars
    '♃', // Tin / Jupiter
    '♄', // Lead / Saturn
    ' M', // Antimony (Placeholder)
    ' M', // Arsenic (Placeholder)
    ' M', // Bismuth (Placeholder)
    ' M', // Platinum (Placeholder)
    ' M', ' M', ' M', // Vitriol, Nitre, etc. (Placeholders)
];

// --- RUNES (Elder Futhark Example) ---
// IMPORTANT: These will ONLY display correctly if the user's browser/system
// has a font that includes the Runic Unicode block (U+16A0 to U+16FF).
// Common system fonts like Segoe UI Symbol (Windows) or fonts installed
// by default on Mac/Linux might work. Otherwise, they'll appear as boxes '□'.
// We'll discuss loading a specific web font for them later if needed.
const runeSymbols = [
    'ᚠ', // Fehu
    'ᚢ', // Uruz
    'ᚦ', // Thurisaz
    'ᚨ', // Ansuz
    'ᚱ', // Raidho
    'ᚲ', // Kauna
    'ᚷ', // Gebo
    'ᚹ', // Wunjo
    'ᚺ', // Hagalaz
    'ᚾ', // Naudiz
    'ᛁ', // Isa
    'ᛃ', // Jera
    'ᛇ', // Eihwaz
    'ᛈ', // Pertho
    'ᛉ', // Algiz
    'ᛊ', // Sowilo
    'ᛏ', // Tiwaz
    'ᛒ', // Berkano
    'ᛖ', // Ehwaz
    'ᛗ', // Mannaz
    'ᛚ', // Laguz
    'ᛜ', // Ingwaz
    'ᛟ', // Othala
    'ᛞ'  // Dagaz
];

// --- Mapping for Selection ---
// This object maps the value we'll use in the HTML dropdown
// to the actual JavaScript array defined above.
const symbolSets = {
    'geometric': geometricSymbols,
    'astrology': astrologySymbols,
    'alchemy': alchemySymbols,
    'runes': runeSymbols,
    'all': [...geometricSymbols, ...astrologySymbols, ...alchemySymbols, ...runeSymbols] // Combine all sets
};

// Default starting set (we'll link this to the dropdown later)
// let currentSymbols = symbolSets['geometric']; // Start with geometric
// Near top where arrays are defined:
let currentSymbols; // Declare it, but don't assign a default here anymore.
let currentCircleDef = null; // Will hold the definition of the current circle
// --- Check if elements were found ---
// Add these checks right after selecting elements!
if (!canvas) console.error("ERROR: Canvas element not found!");
if (!ctx) console.error("ERROR: Canvas context could not be created!");
if (!generateBtn) console.error("ERROR: Generate button not found!");
if (!numRingsSlider) console.error("ERROR: Number of Circles Slider not found!");
if (!numRingsValueSpan) console.error("ERROR: Number of Circles Value Span not found!");


// --- Canvas Setup ---
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

// --- Drawing Helper Functions ---

function drawCircle(x, y, radius, color = 'white', lineWidth = 2) {
    if (radius <= 0) return;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function drawPolygon(cx, cy, radius, sides, startAngle, color = 'white', lineWidth = 2, fill = false, fillColor = 'grey') {
    if (sides < 3 || radius <= 0) return;

    ctx.beginPath();
    const angleStep = (Math.PI * 2) / sides;
    let startX = cx + radius * Math.cos(startAngle);
    let startY = cy + radius * Math.sin(startAngle);
    ctx.moveTo(startX, startY);

    for (let i = 1; i <= sides; i++) {
        const currentAngle = startAngle + i * angleStep;
        const nextX = cx + radius * Math.cos(currentAngle);
        const nextY = cy + radius * Math.sin(currentAngle);
        ctx.lineTo(nextX, nextY);
    }
    // ctx.closePath(); // Uncomment if you want explicit closing for filling

    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, color = 'white', lineWidth = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function drawSymbol(symbol, x, y, size = 20, color = 'white') {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, y);
}

/**
 * Draws a star shape on the canvas.
 * @param {number} cx - Center X coordinate.
 * @param {number} cy - Center Y coordinate.
 * @param {number} outerRadius - Distance from center to the outer points (tips).
 * @param {number} innerRadius - Distance from center to the inner points (valleys).
 * @param {number} points - Number of points the star should have (e.g., 5 for a pentagram).
 * @param {number} startAngle - Rotation offset in radians (0 = first outer point typically upwards or right).
 * @param {string} [color='white'] - Stroke color.
 * @param {number} [lineWidth=2] - Line width.
 * @param {boolean} [fill=false] - Whether to fill the star.
 * @param {string} [fillColor='grey'] - Fill color if fill is true.
 */
function drawStar(cx, cy, outerRadius, innerRadius, points, startAngle, color = 'white', lineWidth = 2, fill = false, fillColor = 'grey') {
    if (points < 2 || outerRadius <= 0 || innerRadius < 0) return; // Need at least 2 points and positive radii

    ctx.beginPath();
    // Calculate the angle between each point (outer and inner combined)
    const angleStep = Math.PI / points; // Half the step of a polygon with the same points

    for (let i = 0; i < 2 * points; i++) {
        const radius = (i % 2 === 0) ? outerRadius : innerRadius; // Alternate radius
        const currentAngle = startAngle + i * angleStep;
        const currentX = cx + radius * Math.cos(currentAngle);
        const currentY = cy + radius * Math.sin(currentAngle);

        if (i === 0) {
            ctx.moveTo(currentX, currentY); // Move to the first point
        } else {
            ctx.lineTo(currentX, currentY); // Draw line to the next point
        }
    }

    ctx.closePath(); // Connect the last point back to the first

    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    // Always stroke after potential fill
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

/**
 * Applies a glow effect using canvas shadow properties.
 * @param {string} color - The color of the glow (usually matches the drawing color).
 * @param {number} blurAmount - The amount of blur (e.g., 5, 10, 15).
 */
function applyGlow(color = 'white', blurAmount = 10) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blurAmount;
    // Optional: Add small offsets if needed
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 0;
}

/**
 * Resets canvas shadow properties to disable glow.
 */
function resetGlow() {
    ctx.shadowColor = 'transparent'; // Or 'rgba(0,0,0,0)'
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function createCircleDefinition() {
    console.log("--- Creating new circle definition ---");

    // Read STRUCTURAL controls
    const numOuterCircles = parseInt(numRingsSlider.value);
    const selectedShapeValue = innerShapeSelect.value;
    const selectedSetKey = symbolSetSelect.value;
    const numRingSymbols = parseInt(numSymbolsSlider.value);

    // Basic parameters (could be made controllable later)
    const maxRadius = Math.min(width, height) / 2 - 15;
    const baseLineWidth = 1.5;
    const circleSpacing = 0.15;

    // --- Define Outer Circles ---
    const circles = [];
    for (let i = 0; i < numOuterCircles; i++) {
        // Make radius slightly random IF desired, otherwise deterministic
        // const randomFactor = 0.95 + Math.random() * 0.1; // Example randomness
        // const radius = maxRadius * (1 - i * circleSpacing) * randomFactor;
        const radius = maxRadius * (1 - i * circleSpacing); // Deterministic
        const lineWidth = Math.max(1, baseLineWidth - i * 0.2);
        if (radius > 0) {
             circles.push({ radius: radius, lineWidth: lineWidth });
        }
    }

    // --- Define Inner Shape ---
    let innerShape = null;
    let shapeInfo = null; // Determine type and points based on dropdown
    if (selectedShapeValue !== 'none' && selectedShapeValue !== 'random') {
        const parts = selectedShapeValue.split('_');
        if (parts.length === 2) shapeInfo = { type: parts[0], points: parseInt(parts[1]) };
    } else if (selectedShapeValue === 'random') {
        if (Math.random() < 0.5) shapeInfo = { type: 'polygon', points: Math.floor(Math.random() * 4) + 3 };
        else shapeInfo = { type: 'star', points: Math.floor(Math.random() * 4) + 4 };
    }

    if (shapeInfo) {
        const minCircleRadius = circles.length > 0 ? circles[circles.length - 1].radius : maxRadius * 0.5;
        const shapeStartAngle = Math.random() * Math.PI * 2;
        const shapeLineWidth = baseLineWidth;

        if (minCircleRadius > 10) {
            if (shapeInfo.type === 'polygon') {
                const polyRadius = minCircleRadius * (0.4 + Math.random() * 0.4);
                if (polyRadius > 5) {
                    innerShape = { type: 'polygon', points: shapeInfo.points, radius: polyRadius, angle: shapeStartAngle, lineWidth: shapeLineWidth };
                }
            } else if (shapeInfo.type === 'star') {
                const starOuterRadius = minCircleRadius * (0.5 + Math.random() * 0.4);
                const starInnerRadius = starOuterRadius * (0.4 + Math.random() * 0.2);
                if (starOuterRadius > 5 && starInnerRadius > 0) {
                    innerShape = { type: 'star', points: shapeInfo.points, outerRadius: starOuterRadius, innerRadius: starInnerRadius, angle: shapeStartAngle, lineWidth: shapeLineWidth };
                }
            }
        }
    }

    // --- Define Vertex Symbols ---
    let vertexSymbols = [];
    if (innerShape && Math.random() < 0.7) { // 70% chance
        const points = innerShape.points;
        const angleOffset = innerShape.angle;
        const vertexSymbolSize = () => 18 + Math.random() * 8; // Keep size random per symbol for now
        const symbolSet = symbolSets[selectedSetKey] || symbolSets['geometric'];

        for (let i = 0; i < points; i++) {
             let currentAngle, vertexRadius;
             if (innerShape.type === 'star') {
                 vertexRadius = innerShape.outerRadius;
                 currentAngle = angleOffset + (2 * i) * (Math.PI / points);
             } else { // polygon
                 vertexRadius = innerShape.radius;
                 currentAngle = angleOffset + i * (Math.PI * 2 / points);
             }
             const x = centerX + vertexRadius * Math.cos(currentAngle);
             const y = centerY + vertexRadius * Math.sin(currentAngle);
             const symbol = symbolSet[Math.floor(Math.random() * symbolSet.length)];
             vertexSymbols.push({ symbol: symbol, x: x, y: y, size: vertexSymbolSize() });
        }
    }

    // --- Define Ring Symbols ---
    let ringSymbols = [];
    // Only generate ring symbols if vertex symbols were NOT generated
    if (vertexSymbols.length === 0 && numRingSymbols > 0 && circles.length > 0) {
        const symbolRadiusFactor = 0.6 + Math.random() * 0.25;
        const symbolRadius = maxRadius * symbolRadiusFactor;
        const symbolStartAngle = Math.random() * Math.PI * 2;
        const symbolSet = symbolSets[selectedSetKey] || symbolSets['geometric'];
        const ringSymbolSize = () => 18 + Math.random() * 8;

        if (symbolRadius > 5) {
            for (let i = 0; i < numRingSymbols; i++) {
                const angle = symbolStartAngle + (Math.PI * 2 / numRingSymbols) * i;
                const x = centerX + symbolRadius * Math.cos(angle);
                const y = centerY + symbolRadius * Math.sin(angle);
                const symbol = symbolSet[Math.floor(Math.random() * symbolSet.length)];
                ringSymbols.push({ symbol: symbol, x: x, y: y, size: ringSymbolSize() });
            }
        }
    }


    // --- Define Connecting Lines ---
    let connectingLines = [];
    if (innerShape && Math.random() < 0.6 && circles.length > 0) {
        const targetRadius = circles[0].radius; // Connect to outermost circle
        const points = innerShape.points;
        const angleOffset = innerShape.angle;
        const connectLineWidth = 0.75;

         for (let i = 0; i < points; i++) {
             let currentAngle, startRadius;
             if (innerShape.type === 'star') {
                 startRadius = innerShape.outerRadius;
                 currentAngle = angleOffset + (2 * i) * (Math.PI / points);
             } else {
                 startRadius = innerShape.radius;
                 currentAngle = angleOffset + i * (Math.PI * 2 / points);
             }
             const startX = centerX + startRadius * Math.cos(currentAngle);
             const startY = centerY + startRadius * Math.sin(currentAngle);
             const endX = centerX + targetRadius * Math.cos(currentAngle);
             const endY = centerY + targetRadius * Math.sin(currentAngle);
             connectingLines.push({ x1: startX, y1: startY, x2: endX, y2: endY, lineWidth: connectLineWidth });
         }
    }

    // --- Define Radial Lines ---
    let radialLines = [];
    if (connectingLines.length === 0 && circles.length > 0) { // Only if connecting lines weren't drawn
        const numLines = Math.random() < 0.5 ? 6 : 9;
        const lineStartRadius = maxRadius * 0.2;
        const lineEndRadius = maxRadius;
        const radialLineWidth = 0.75;

        if (lineStartRadius < lineEndRadius) {
            for (let i = 0; i < numLines; i++) {
                const angle = (Math.PI * 2 / numLines) * i;
                const startX = centerX + lineStartRadius * Math.cos(angle);
                const startY = centerY + lineStartRadius * Math.sin(angle);
                const endX = centerX + lineEndRadius * Math.cos(angle);
                const endY = centerY + lineEndRadius * Math.sin(angle);
                radialLines.push({ x1: startX, y1: startY, x2: endX, y2: endY, lineWidth: radialLineWidth });
            }
        }
    }

    // --- Store the definition ---
    currentCircleDef = {
        circles: circles,
        innerShape: innerShape,
        vertexSymbols: vertexSymbols,
        ringSymbols: ringSymbols,
        connectingLines: connectingLines,
        radialLines: radialLines,
        symbolSetKey: selectedSetKey // Store which set was used
        // Store other non-random parameters if needed later
    };

    console.log("New circle definition created:", currentCircleDef);
}

// --- The Main Generation Function ---
function generateMagicCircle() {
    console.log("--- generateMagicCircle DRAWING ---");

    if (!ctx) { console.error("Cannot draw: No canvas context!"); return; }
    if (!currentCircleDef) { console.log("Cannot draw: No circle definition exists yet."); return; }

    // Read VISUAL controls
    const primaryColor = primaryColorPicker.value;
    const secondaryColor = secondaryColorPicker.value;
    const enableGlow = glowToggle.checked;
    const glowAmount = 10;

    // Assign colors based on definition (can be customized more later)
    const symbolColor = primaryColor;
    const connectColor = secondaryColor;
    const radialLineColor = secondaryColor;
    const shapeColor = secondaryColor; // Color for polygon/star itself

    // Get current symbols based on stored key (important if set changes but redraw happens before re-gen)
    currentSymbols = symbolSets[currentCircleDef.symbolSetKey] || symbolSets['geometric'];


    // 1. Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // --- Draw Outer Circles ---
    currentCircleDef.circles.forEach(circle => {
        if (enableGlow) applyGlow(primaryColor, glowAmount);
        drawCircle(centerX, centerY, circle.radius, primaryColor, circle.lineWidth);
        if (enableGlow) resetGlow();
    });

    // --- Draw Inner Shape ---
    const shape = currentCircleDef.innerShape;
    if (shape) {
         if (enableGlow) applyGlow(shapeColor, glowAmount);
         if (shape.type === 'polygon') {
             drawPolygon(centerX, centerY, shape.radius, shape.points, shape.angle, shapeColor, shape.lineWidth);
         } else if (shape.type === 'star') {
             drawStar(centerX, centerY, shape.outerRadius, shape.innerRadius, shape.points, shape.angle, shapeColor, shape.lineWidth);
         }
         if (enableGlow) resetGlow();
    }

     // --- Draw Connecting Lines ---
     currentCircleDef.connectingLines.forEach(line => {
         if (enableGlow) applyGlow(connectColor, glowAmount * 0.5);
         drawLine(line.x1, line.y1, line.x2, line.y2, connectColor, line.lineWidth);
         if (enableGlow) resetGlow();
     });

    // --- Draw Vertex Symbols ---
    currentCircleDef.vertexSymbols.forEach(sym => {
        if (enableGlow) applyGlow(symbolColor, glowAmount * 0.7);
        drawSymbol(sym.symbol, sym.x, sym.y, sym.size, symbolColor);
         if (enableGlow) resetGlow();
    });

    // --- Draw Ring Symbols ---
    currentCircleDef.ringSymbols.forEach(sym => {
         if (enableGlow) applyGlow(symbolColor, glowAmount * 0.7);
         drawSymbol(sym.symbol, sym.x, sym.y, sym.size, symbolColor);
         if (enableGlow) resetGlow();
    });

    // --- Draw Radial Lines ---
    currentCircleDef.radialLines.forEach(line => {
        if (enableGlow) applyGlow(radialLineColor, glowAmount * 0.5);
        drawLine(line.x1, line.y1, line.x2, line.y2, radialLineColor, line.lineWidth);
        if (enableGlow) resetGlow();
    });


    console.log("--- Drawing complete ---");
} // End of generateMagicCircle

// --- Event Listeners ---
// Ensure listeners are attached only if elements exist
// --- Event Listeners ---

// Button: Creates NEW definition AND draws
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        createCircleDefinition(); // Create new structure
        generateMagicCircle(); // Draw it
    });
    console.log("Generate button listener attached.");
}

// STRUCTURAL Controls: Create NEW definition AND draw
if (numRingsSlider && numRingsValueSpan) {
    numRingsSlider.addEventListener('input', () => {
        numRingsValueSpan.textContent = numRingsSlider.value;
        createCircleDefinition(); // Create new structure
        generateMagicCircle(); // Draw it
    });
    console.log("Rings slider listener attached.");
}
if (innerShapeSelect) {
    innerShapeSelect.addEventListener('change', () => {
        createCircleDefinition(); // Create new structure
        generateMagicCircle(); // Draw it
    });
    console.log("Inner shape select listener attached.");
}
if (symbolSetSelect) {
    symbolSetSelect.addEventListener('change', () => {
        createCircleDefinition(); // Create new structure
        generateMagicCircle(); // Draw it
    });
    console.log("Symbol set select listener attached.");
}
if (numSymbolsSlider && numSymbolsValueSpan) {
    numSymbolsSlider.addEventListener('input', () => {
        numSymbolsValueSpan.textContent = numSymbolsSlider.value;
        createCircleDefinition(); // Create new structure
        generateMagicCircle(); // Draw it
    });
    console.log("Symbols slider listener attached.");
}


// VISUAL Controls: ONLY redraw using EXISTING definition
if (primaryColorPicker) {
    primaryColorPicker.addEventListener('input', () => {
        // NO createCircleDefinition() here!
        generateMagicCircle(); // Only redraw
    });
    console.log("Primary color picker listener attached.");
}
if (secondaryColorPicker) {
    secondaryColorPicker.addEventListener('input', () => {
        // NO createCircleDefinition() here!
        generateMagicCircle(); // Only redraw
    });
    console.log("Secondary color picker listener attached.");
}
if (glowToggle) {
    glowToggle.addEventListener('change', () => {
        // NO createCircleDefinition() here!
        generateMagicCircle(); // Only redraw
    });
    console.log("Glow toggle listener attached.");
}


// --- Initial Setup ---
console.log("Running initial setup...");

// Set initial text for sliders
if (numRingsSlider && numRingsValueSpan) { /* ... set text ... */ }
if (numSymbolsSlider && numSymbolsValueSpan) { /* ... set text ... */ }

// *** Create the FIRST definition AND draw it ***
if (ctx && numRingsSlider && symbolSetSelect && innerShapeSelect && numSymbolsSlider) {
    createCircleDefinition(); // Create the first definition
    generateMagicCircle(); // Draw the first circle
    console.log("Script loaded and initial circle generated.");
} else {
    console.error("INITIAL GENERATION SKIPPED due to missing essential elements!");
}