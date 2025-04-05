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
const lineStyleSelect = document.getElementById('lineStyleSelect');
const paletteSelect = document.getElementById('paletteSelect');
const saveBtn = document.getElementById('saveBtn');



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
if (!lineStyleSelect) console.error("ERROR: Line Style Select not found!");
if (!paletteSelect) console.error("ERROR: Palette Select not found!");
if (!saveBtn) console.error("ERROR: Save Button not found!");


// --- Color Palettes ---
const colorPalettes = {
    'custom': { name: 'Custom', primary: null, secondary: null }, // Placeholder for manual selection
    'default': { name: 'Default', primary: '#FFFFFF', secondary: '#888888' },
    'fire': { name: 'Fire', primary: '#FFA500', secondary: '#FF4500' }, // Orange, OrangeRed
    'ice': { name: 'Ice', primary: '#ADD8E6', secondary: '#00BFFF' }, // LightBlue, DeepSkyBlue
    'forest': { name: 'Forest', primary: '#90EE90', secondary: '#228B22' }, // LightGreen, ForestGreen
    'arcane': { name: 'Arcane', primary: '#DA70D6', secondary: '#8A2BE2' }, // Orchid, BlueViolet
    'shadow': { name: 'Shadow', primary: '#A9A9A9', secondary: '#696969' }, // DarkGray, DimGray
    'gold': { name: 'Gold', primary: '#FFD700', secondary: '#B8860B' }, // Gold, DarkGoldenrod
    'mono': { name: 'Monochrome', primary: '#FFFFFF', secondary: '#CCCCCC' }, // White, LightGray
};

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

function drawLine(x1, y1, x2, y2, color = 'white', lineWidth = 1, style = 'solid') {
    ctx.save(); // Save current context state (including line dash)

    // Set the line dash pattern based on the style
    if (style === 'dashed') {
        ctx.setLineDash([5, 5]); // 5px line, 5px gap
    } else if (style === 'dotted') {
        ctx.setLineDash([1, 3]); // 1px dot, 3px gap (adjust as desired)
    } else {
        ctx.setLineDash([]); // Solid line
    }

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.restore(); // Restore the previous context state (resets line dash)
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

function populatePaletteOptions() {
    if (!paletteSelect) return; // Don't run if element wasn't found

    // Clear existing options except the first 'Custom' one (optional)
    // while (paletteSelect.options.length > 1) {
    //     paletteSelect.remove(1);
    // }

    for (const key in colorPalettes) {
         // Skip adding 'custom' again if it's already there
         if (key === 'custom' && paletteSelect.querySelector('option[value="custom"]')) {
            continue;
         }
         const palette = colorPalettes[key];
         const option = document.createElement('option');
         option.value = key;
         option.textContent = palette.name;
         paletteSelect.appendChild(option);
    }
     // Set initial selection based on picker defaults? Or just default to 'custom'/'default'.
     // Let's explicitly set it to 'default' initially.
     paletteSelect.value = 'default';
     // And also update the pickers to match the initial default palette
     if (primaryColorPicker) primaryColorPicker.value = colorPalettes['default'].primary;
     if (secondaryColorPicker) secondaryColorPicker.value = colorPalettes['default'].secondary;

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

        // --- Define Inner Shapes (Polygon + nested Star) ---
        let innerShapes = []; // Array to hold shape definitions
        const baseShapeStartAngle = Math.random() * Math.PI * 2; // Base rotation for alignment
        const shapeLineWidth = baseLineWidth;
        const minCircleRadius = circles.length > 0 ? circles[circles.length - 1].radius : maxRadius * 0.5;

        let availableRadius = minCircleRadius; // Start with radius available inside circles

        // 1. Define the Polygon (if possible)
        let polygonShape = null;
        const polySides = Math.floor(Math.random() * 4) + 3; // 3-6 sides for polygon
        if (availableRadius > 15) { // Need more space for nested shapes
            const polyRadius = availableRadius * (0.6 + Math.random() * 0.2); // Polygon takes 60-80% of available space
            if (polyRadius > 10) { // Check if polygon itself is large enough
                polygonShape = {
                    type: 'polygon',
                    points: polySides,
                    radius: polyRadius,
                    angle: baseShapeStartAngle, // Use common start angle
                    lineWidth: shapeLineWidth
                };
                innerShapes.push(polygonShape);
                availableRadius = polyRadius * (0.4 + Math.random() * 0.2); // Next shape fits inside 40-60% of polygon radius
                console.log(`Defined polygon: ${polySides} sides, radius ${polyRadius.toFixed(1)}`);
            } else {
                console.log("Skipping polygon definition: Calculated radius too small.");
            }
        } else {
            console.log("Skipping polygon definition: Available radius too small.");
        }


        // 2. Define the Star (nested inside polygon, if polygon exists and space allows)
        let starShape = null;
        const starPoints = Math.floor(Math.random() * 4) + 4; // 4-7 points for star
        if (polygonShape && availableRadius > 10) { // Must have polygon and enough space left inside it
            const starOuterRadius = availableRadius; // Star fills the remaining space calculated earlier
            const starInnerRadius = starOuterRadius * (0.4 + Math.random() * 0.2); // Standard inner ratio

            if (starOuterRadius > 5 && starInnerRadius > 0) {
                starShape = {
                    type: 'star',
                    points: starPoints,
                    outerRadius: starOuterRadius,
                    innerRadius: starInnerRadius,
                    angle: baseShapeStartAngle + (Math.random() * (Math.PI / starPoints)), // Slightly offset angle from polygon
                    lineWidth: shapeLineWidth * 0.8 // Maybe slightly thinner line
                };
                innerShapes.push(starShape);
                console.log(`Defined nested star: ${starPoints} points, R ${starOuterRadius.toFixed(1)}`);
            } else {
                console.log("Skipping star definition: Calculated radii invalid.");
            }
        } else {
            if (!polygonShape) console.log("Skipping star definition: No polygon to nest within.");
            else console.log("Skipping star definition: Available radius inside polygon too small.");
        }
        // --- End Inner Shapes Definition ---


        // --- Adjust Interaction Logic to Use First Shape ---
        const primaryInnerShape = innerShapes.length > 0 ? innerShapes[0] : null; // Get the polygon, if it exists


        // --- Define Vertex Symbols (Based on primaryInnerShape) ---
        let vertexSymbols = [];
        // Only use the FIRST shape (polygon) for vertex symbols for now
        if (primaryInnerShape && primaryInnerShape.type === 'polygon' && Math.random() < 0.7) {
            console.log(`Defining vertex symbols for polygon (${primaryInnerShape.points} points)`);
            const points = primaryInnerShape.points;
            const angleOffset = primaryInnerShape.angle;
            const vertexRadius = primaryInnerShape.radius;
            const symbolSet = symbolSets[selectedSetKey] || symbolSets['geometric'];
            const vertexSymbolSize = () => 18 + Math.random() * 8;

            for (let i = 0; i < points; i++) {
                const currentAngle = angleOffset + i * (Math.PI * 2 / points);
                const x = centerX + vertexRadius * Math.cos(currentAngle);
                const y = centerY + vertexRadius * Math.sin(currentAngle);
                const symbol = symbolSet[Math.floor(Math.random() * symbolSet.length)];
                vertexSymbols.push({ symbol: symbol, x: x, y: y, size: vertexSymbolSize() });
            }
        } else {
            if (!primaryInnerShape) console.log("Skipping vertex symbols: No primary shape defined.");
            else if (primaryInnerShape.type !== 'polygon') console.log("Skipping vertex symbols: Primary shape is not a polygon.");
            else console.log("Skipping vertex symbols: Random chance failed.");
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


    // --- Define Connecting Lines (Based on primaryInnerShape) ---
    let connectingLines = [];
    // Only use the FIRST shape (polygon) for connecting lines
    if (primaryInnerShape && primaryInnerShape.type === 'polygon' && Math.random() < 0.6 && circles.length > 0) {
        console.log(`Defining connecting lines for polygon (${primaryInnerShape.points} points)`);
        const targetRadius = circles[0].radius;
        const points = primaryInnerShape.points;
        const angleOffset = primaryInnerShape.angle;
        const startRadius = primaryInnerShape.radius;
        const connectLineWidth = 0.75;

        for (let i = 0; i < points; i++) {
            const currentAngle = angleOffset + i * (Math.PI * 2 / points);
            const startX = centerX + startRadius * Math.cos(currentAngle);
            const startY = centerY + startRadius * Math.sin(currentAngle);
            const endX = centerX + targetRadius * Math.cos(currentAngle);
            const endY = centerY + targetRadius * Math.sin(currentAngle);
            connectingLines.push({ x1: startX, y1: startY, x2: endX, y2: endY, lineWidth: connectLineWidth });
        }
    } else {
        if (!primaryInnerShape) console.log("Skipping connecting lines: No primary shape defined.");
        else if (primaryInnerShape.type !== 'polygon') console.log("Skipping connecting lines: Primary shape not a polygon.");
        else if (circles.length == 0) console.log("Skipping connecting lines: No outer circles.");
        else console.log("Skipping connecting lines: Random chance failed.");
    }

    // --- Define Radial Lines ---
    let radialLines = [];
    // Check if connecting lines were ALREADY defined OR if no outer circles exist
    if (connectingLines.length === 0 && circles.length > 0) {
        const lineStartRadius = maxRadius * 0.2; // Start lines at 20% radius
        const lineEndRadius = maxRadius;         // End lines at max radius
        const radialLineWidth = 0.75;            // Use thin lines

        // Ensure radii are valid
        if (lineStartRadius < lineEndRadius && lineStartRadius >= 0) {

            // Check if a primary inner shape exists to align to
            if (primaryInnerShape && primaryInnerShape.type === 'polygon') {
                const points = primaryInnerShape.points;
                const angleOffset = primaryInnerShape.angle;
                console.log(`Defining ${points} radial lines aligned with polygon vertices.`);

                for (let i = 0; i < points; i++) {
                    // Calculate the angle of the polygon vertex
                    const vertexAngle = angleOffset + i * (Math.PI * 2 / points);

                    // Calculate start point based on vertexAngle and start radius
                    const startX = centerX + lineStartRadius * Math.cos(vertexAngle);
                    const startY = centerY + lineStartRadius * Math.sin(vertexAngle);

                    // Calculate end point based on vertexAngle and end radius
                    const endX = centerX + lineEndRadius * Math.cos(vertexAngle);
                    const endY = centerY + lineEndRadius * Math.sin(vertexAngle);

                    // Add the line definition to the array
                    radialLines.push({ x1: startX, y1: startY, x2: endX, y2: endY, lineWidth: radialLineWidth });
                }
            } else {
                // No primary shape OR it wasn't a polygon -> Define evenly spaced lines
                const numLines = Math.random() < 0.5 ? 6 : 9; // Random number of lines
                console.log(`Defining ${numLines} evenly spaced radial lines.`);

                for (let i = 0; i < numLines; i++) {
                    // Calculate evenly spaced angle
                    const angle = (Math.PI * 2 / numLines) * i;

                    // Calculate start point based on angle and start radius
                    const startX = centerX + lineStartRadius * Math.cos(angle);
                    const startY = centerY + lineStartRadius * Math.sin(angle);

                    // Calculate end point based on angle and end radius
                    const endX = centerX + lineEndRadius * Math.cos(angle);
                    const endY = centerY + lineEndRadius * Math.sin(angle);

                    // Add the line definition to the array
                    radialLines.push({ x1: startX, y1: startY, x2: endX, y2: endY, lineWidth: radialLineWidth });
                }
            }
        } else {
            console.log("Skipping radial line definition: start/end radius invalid.");
        }
    } else {
        // Log why skipped more clearly
        if (connectingLines.length > 0) console.log("Skipping radial line definition: Connecting lines already defined.");
        else if (circles.length === 0) console.log("Skipping radial line definition: No outer circles defined.");
        // No need for another else here, covered above
    }
    // --- End Radial Lines Definition ---

    // --- Store the definition ---
    currentCircleDef = {
        circles: circles,
        innerShapes: innerShapes,
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
    const selectedLineStyle = lineStyleSelect.value; // <<< READ LINE STYLE
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

    // --- Draw Inner Shapes ---
    if (currentCircleDef.innerShapes && currentCircleDef.innerShapes.length > 0) {
        currentCircleDef.innerShapes.forEach(shape => {
            if (enableGlow) applyGlow(shapeColor, glowAmount); // Apply glow before each shape

            if (shape.type === 'polygon') {
                drawPolygon(centerX, centerY, shape.radius, shape.points, shape.angle, shapeColor, shape.lineWidth);
            } else if (shape.type === 'star') {
                drawStar(centerX, centerY, shape.outerRadius, shape.innerRadius, shape.points, shape.angle, shapeColor, shape.lineWidth);
            }

            if (enableGlow) resetGlow(); // Reset glow after each shape
        });
    }
    // --- End Inner Shapes Drawing ---

     // --- Draw Connecting Lines ---
     currentCircleDef.connectingLines.forEach(line => {
         if (enableGlow) applyGlow(connectColor, glowAmount * 0.5);
         drawLine(line.x1, line.y1, line.x2, line.y2, connectColor, line.lineWidth, selectedLineStyle); // <<< ADDED STYLE
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
        drawLine(line.x1, line.y1, line.x2, line.y2, radialLineColor, line.lineWidth, selectedLineStyle); // <<< ADDED STYLE
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

if (lineStyleSelect) {
    lineStyleSelect.addEventListener('change', () => {
        console.log(`Line style changed to: ${lineStyleSelect.value}`);
        generateMagicCircle(); // Only redraw, don't create new definition
    });
    console.log("Line style select listener attached.");
} else {
    console.error("Could not attach listener to Line Style select!");
}
// Downloads the current drawing
if (saveBtn && canvas) { // Check if both button and canvas exist
    saveBtn.addEventListener('click', () => {
        console.log("Save button clicked.");

        // 1. Get the image data from the canvas as a PNG
        //    toDataURL() returns a base64 encoded string
        const imageDataUrl = canvas.toDataURL('image/png');

        // 2. Create a temporary link element
        const link = document.createElement('a');

        // 3. Set the link's attributes
        link.href = imageDataUrl; // Point to the image data
        link.download = 'magic_circle.png'; // Suggest a filename for the download

        // 4. Simulate a click on the link to trigger the download
        //    We need to append the link to the body, click it, then remove it.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Image download initiated.");
    });
    console.log("Save button listener attached.");
} else {
    console.error("Could not attach listener to Save button or canvas missing!");
}

// VISUAL Controls: ONLY redraw using EXISTING definition
if (primaryColorPicker) {
    primaryColorPicker.addEventListener('input', () => {
        console.log(`Primary color changed to: ${primaryColorPicker.value}`);
        if (paletteSelect) paletteSelect.value = 'custom'; // <<< Set palette to Custom
        generateMagicCircle();
    });
    // console.log("Primary color picker listener attached.");
}

// Modify existing listener for Secondary Color Picker
if (secondaryColorPicker) {
    secondaryColorPicker.addEventListener('input', () => {
        console.log(`Secondary color changed to: ${secondaryColorPicker.value}`);
         if (paletteSelect) paletteSelect.value = 'custom'; // <<< Set palette to Custom
        generateMagicCircle();
    });
     // console.log("Secondary color picker listener attached.");
}

if (glowToggle) {
    glowToggle.addEventListener('change', () => {
        // NO createCircleDefinition() here!
        generateMagicCircle(); // Only redraw
    });
    console.log("Glow toggle listener attached.");
}

if (paletteSelect && primaryColorPicker && secondaryColorPicker) {
    paletteSelect.addEventListener('change', () => {
        const selectedKey = paletteSelect.value;
        console.log(`Palette changed to: ${selectedKey}`);

        if (selectedKey !== 'custom' && colorPalettes[selectedKey]) {
            const palette = colorPalettes[selectedKey];
            // Update the color picker input values
            primaryColorPicker.value = palette.primary;
            secondaryColorPicker.value = palette.secondary;
            // Redraw the circle with the new colors
            generateMagicCircle();
        }
        // If 'custom' is selected, we don't change the pickers,
        // the user will change them manually.
    });
    console.log("Palette select listener attached.");
} else {
    console.error("Could not attach listener to Palette select or color pickers missing!");
}

// --- Initial Setup ---
console.log("Running initial setup...");
// Populate Palette Dropdown FIRST
populatePaletteOptions(); // <<< CALL THE NEW FUNCTION
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