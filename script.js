// --- Select HTML Elements ---
// Make sure these run *after* the HTML elements exist
const canvas = document.getElementById('magicCircleCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const numCirclesSlider = document.getElementById('numCirclesSlider');
const numCirclesValueSpan = document.getElementById('numCirclesValue');
const symbolSetSelect = document.getElementById('symbolSetSelect');
const innerShapeSelect = document.getElementById('innerShapeSelect');
if (!innerShapeSelect) console.error("ERROR: Inner Shape Select dropdown not found!");
if (!symbolSetSelect) console.error("ERROR: Symbol Set Select dropdown not found!");

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

// --- Check if elements were found ---
// Add these checks right after selecting elements!
if (!canvas) console.error("ERROR: Canvas element not found!");
if (!ctx) console.error("ERROR: Canvas context could not be created!");
if (!generateBtn) console.error("ERROR: Generate button not found!");
if (!numCirclesSlider) console.error("ERROR: Number of Circles Slider not found!");
if (!numCirclesValueSpan) console.error("ERROR: Number of Circles Value Span not found!");


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

// --- Symbol/Glyph Resources ---
const symbols = [
    // --- Basic Geometry & Stars ---
    '◇', '◆', '◈', '◉', '○', '●', '⊕', '⊖', '⊗', '⊘', '⊙', // Circles & Diamonds
    '△', '▲', '▷', '▽', '▼', '◁', // Triangles
    '□', '■', '▢', '▣', // Squares
    '☆', '★', '✶', '✷', '✸', '✹', '✺', '✡', '✨', // Stars & Sparkles

    // --- Astrological ---
    '☉', // Sun
    '☽', // Moon (Crescent)
    '☿', // Mercury
    '♀', // Venus
    '⊕', // Earth (Alternative)
    '♂', // Mars
    '♃', // Jupiter
    '♄', // Saturn
    '♅', // Uranus
    '♆', // Neptune
    '♇', // Pluto
    '♈', // Aries
    '♉', // Taurus
    '♊', // Gemini
    '♋', // Cancer
    '♌', // Leo
    '♍', // Virgo
    '♎', // Libra
    '♏', // Scorpio
    '♐', // Sagittarius
    '♑', // Capricorn
    '♒', // Aquarius
    '♓', // Pisces
    '☌', // Conjunction
    '☍', // Opposition
    '⚹', // Sextile
    '□', // Square aspect (duplicate, but ok)
    '△', // Trine aspect (duplicate, but ok)

    // --- Alchemy & Elements (Selection) ---
    '🜁', // Air
    '🜂', // Fire
    '🜃', // Water
    '🜄', // Earth
    '🜀', // Quintessence / Aether
    '🜇', // Sulfur
    '🜍', // Quicksilver / Mercury
    '☿', // Mercury (duplicate)
    '🜔', // Salt
    '🜚', // Gold / Sol
    '☽', // Silver / Luna (duplicate)
    '♀', // Copper / Venus (duplicate)
    '♂', // Iron / Mars (duplicate)
    '♃', // Tin / Jupiter (duplicate)
    '♄', // Lead / Saturn (duplicate)

    // --- Miscellaneous / Abstract ---
    '♾', // Infinity
    '⚕', // Staff of Hermes
    '⚖', // Scales
    '⚓', // Anchor
    '⚔', // Crossed Swords
    '⚘', // Flower
    '⚡', // Lightning
    '⏳', // Hourglass
    '🗝', // Key
    '🌀', // Cyclone / Spiral
    '⌘', // Command Key Symbol (looks cool)
    '࿊', // Tibetan Symbol Nor Bu Nyis -Khyil
    '࿋', // Tibetan Symbol Nor Bu Gsum -Khyil
    '࿌', // Tibetan Symbol Nor Bu Bzhi -Khyil
    // Add Runes here if you find a font that supports them well, e.g., 'ᚠ', 'ᚢ', 'ᚦ'...
];
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

// --- The Main Generation Function ---
function generateMagicCircle() {
    console.log("--- generateMagicCircle START ---"); // Log start
    // Check if slider exists *inside* the function too (belt and suspenders)
    if (!numCirclesSlider) {
        console.error("Slider not accessible inside generateMagicCircle!");
        return; // Stop if slider isn't found
    }

    // 1. Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // 2. Read Controls & Define Parameters
    // **** THIS IS THE CRUCIAL LINE ****
    const numOuterCircles = parseInt(numCirclesSlider.value);
    // **** **** **** **** **** **** ****

    console.log(`Slider value read: ${numCirclesSlider.value}, Parsed value: ${numOuterCircles}`); // Detailed log

    if (isNaN(numOuterCircles)) {
        console.error("ERROR: numOuterCircles is NaN! Slider value might be invalid.");
        // Optionally default to a value if parsing fails
        // numOuterCircles = 3;
    }

    // Inside generateMagicCircle function, near the top
    let drawnShapeInfo = null; // To store details of the polygon/star drawn
    let shouldDrawRandomSymbolRing = true; // Keep this flag too

    const maxRadius = Math.min(width, height) / 2 - 15;
    const baseLineWidth = 1.5;
    const primaryColor = `hsl(${Math.random() * 360}, 80%, 70%)`;
    const secondaryColor = 'rgba(200, 200, 200, 0.7)';
    const symbolColor = primaryColor;

    // Inside generateMagicCircle, after reading slider value, before drawing loops:
    const selectedSetKey = symbolSetSelect.value;
    currentSymbols = symbolSets[selectedSetKey] || symbolSets['geometric']; // Use selected set, fallback to geometric if key is invalid
    console.log(`Using symbol set: ${selectedSetKey}`); // Log which set is active

    // 3. Draw Base Elements

    // Draw Outer Circles (Deterministic Radius)
    const circleSpacing = 0.15;
    console.log(`Attempting to draw ${numOuterCircles} circles...`);
    for (let i = 0; i < numOuterCircles; i++) {
        const radius = maxRadius * (1 - i * circleSpacing);
        const lineWidth = Math.max(1, baseLineWidth - i * 0.2);
        console.log(`Drawing circle ${i}: radius ${radius.toFixed(1)}`);
        drawCircle(centerX, centerY, radius, primaryColor, lineWidth);
    }

    // --- Draw ONE inner shape (Polygon or Star) ---
    const selectedShape = innerShapeSelect.value; // Read the dropdown value
    console.log("Selected inner shape:", selectedShape);
    let shapeInfo = null; // Will hold {type: 'polygon'/'star', points: N} or null

    if (selectedShape !== 'none' && selectedShape !== 'random') {
        const parts = selectedShape.split('_'); // e.g., ['polygon', '5']
        if (parts.length === 2) {
            shapeInfo = { type: parts[0], points: parseInt(parts[1]) };
        }
    } else if (selectedShape === 'random') {
        // Keep the old random logic if 'random' is selected
        if (Math.random() < 0.5) { // 50% chance Polygon
             shapeInfo = { type: 'polygon', points: Math.floor(Math.random() * 4) + 3 }; // 3-6 sides
        } else { // 50% chance Star
             shapeInfo = { type: 'star', points: Math.floor(Math.random() * 4) + 4 }; // 4-7 points
        }
    }
    // If selectedShape is 'none', shapeInfo remains null

    // Now, use shapeInfo to decide what to draw
    const shapeStartAngle = Math.random() * Math.PI * 2; // Keep random rotation
    const shapeColor = secondaryColor;
    const shapeLineWidth = baseLineWidth;
    const minCircleRadius = numOuterCircles > 0 ? maxRadius * (1 - (numOuterCircles - 1) * circleSpacing) : maxRadius * 0.5;

    // Make sure drawnShapeInfo is reset from previous run
    drawnShapeInfo = null; // Reset here before potentially drawing

    if (shapeInfo && minCircleRadius > 10) { // Check if shapeInfo exists and there's space
        if (shapeInfo.type === 'polygon') {
            const polySides = shapeInfo.points;
            const polyRadius = minCircleRadius * (0.4 + Math.random() * 0.4);
            if (polyRadius > 5) {
                console.log(`Drawing selected polygon: ${polySides} sides, radius ${polyRadius.toFixed(1)}`);
                drawPolygon(centerX, centerY, polyRadius, polySides, shapeStartAngle, shapeColor, shapeLineWidth);
                drawnShapeInfo = { type: 'polygon', points: polySides, radius: polyRadius, angle: shapeStartAngle }; // Store info

                // --- Place symbols on Polygon Vertices (Example: 70% chance) ---
                if (Math.random() < 0.7) { // Check the random chance FIRST
                    console.log(`Placing symbols on ${polySides} polygon vertices`);
                    shouldDrawRandomSymbolRing = false; // <<< SET FLAG **INSIDE** THE IF

                    const angleStep = (Math.PI * 2) / polySides;
                    const symbolSize = 15 + Math.random() * 5;
                    for (let i = 0; i < polySides; i++) {
                        // ... (calculate vertexX, vertexY) ...
                        const randomSymbol = currentSymbols[Math.floor(Math.random() * currentSymbols.length)];
                        drawSymbol(randomSymbol, vertexX, vertexY, symbolSize, symbolColor);
                    }
                } // <<< END of the 70% chance block
                // --- End symbol placement on vertices ---
                
            } else { /* log skip */ console.log("Skipping polygon: calculated radius too small"); }
        } else if (shapeInfo.type === 'star') {
            const starPoints = shapeInfo.points;
            const starOuterRadius = minCircleRadius * (0.5 + Math.random() * 0.4);
            const starInnerRadius = starOuterRadius * (0.4 + Math.random() * 0.2);
            if (starOuterRadius > 5 && starInnerRadius > 0) {
                console.log(`Drawing selected star: ${starPoints} points, R ${starOuterRadius.toFixed(1)}, r ${starInnerRadius.toFixed(1)}`);
                drawStar(centerX, centerY, starOuterRadius, starInnerRadius, starPoints, shapeStartAngle, shapeColor, shapeLineWidth);
                drawnShapeInfo = { type: 'star', points: starPoints, radius: starOuterRadius, innerRadius: starInnerRadius, angle: shapeStartAngle }; // Store info

                // --- Place symbols on Star Vertices (Example: Outer points only, 70% chance) ---
                if (Math.random() < 0.7) { // Check the random chance FIRST
                    console.log(`Placing symbols on ${starPoints} star outer vertices`);
                    shouldDrawRandomSymbolRing = false; // <<< SET FLAG **INSIDE** THE IF

                    const angleStep = (Math.PI * 2) / starPoints;
                    const symbolSize = 15 + Math.random() * 5;
                    for (let i = 0; i < starPoints; i++) {
                    // ... (calculate vertexX, vertexY for outer point) ...
                        const randomSymbol = currentSymbols[Math.floor(Math.random() * currentSymbols.length)];
                        drawSymbol(randomSymbol, vertexX, vertexY, symbolSize, symbolColor);
                    }
                } // <<< END of the 70% chance block
                // --- End symbol placement on vertices ---

            } else { /* log skip */ console.log("Skipping star: calculated radii invalid"); }
        }
    } else {
        if (!shapeInfo) console.log("Skipping inner shape: 'None' selected or invalid value.");
        else console.log("Skipping inner shape: minCircleRadius too small.");
    }
    // --- END OF SHAPE DRAWING BLOCK ---

    // --- Draw Connecting Lines (Vertices to Outer Circle, 60% chance) ---
    if (drawnShapeInfo && Math.random() < 0.6 && numOuterCircles > 0) { // Check if shape info exists, random chance, and circles exist
        console.log("Drawing connecting lines: vertices to outer circle");

        const targetCircleRadius = maxRadius; // Use the largest radius
        const connectColor = secondaryColor; // Or primaryColor, or a new one
        const connectLineWidth = 0.75; // Typically thin

        const { type, points, radius, angle } = drawnShapeInfo; // Get stored info
        const isStar = (type === 'star');
        const angleOffset = angle;

        for (let i = 0; i < points; i++) {
            let currentAngle;
            let startRadius = radius; // This is polyRadius or starOuterRadius

            if (isStar) {
                // Angle for the *outer* point of the star
                currentAngle = angleOffset + (2 * i) * (Math.PI / points);
            } else {
                // Angle for the polygon vertex
                const angleStep = (Math.PI * 2) / points;
                currentAngle = angleOffset + i * angleStep;
            }

            // Calculate start point (vertex of inner shape)
            const startX = centerX + startRadius * Math.cos(currentAngle);
            const startY = centerY + startRadius * Math.sin(currentAngle);

            // Calculate end point (on the target outer circle at the same angle)
            const endX = centerX + targetCircleRadius * Math.cos(currentAngle);
            const endY = centerY + targetCircleRadius * Math.sin(currentAngle);

            // Draw the line
            drawLine(startX, startY, endX, endY, connectColor, connectLineWidth);
        }
    } else {
        // Log why we skipped, checking each condition
        if (!drawnShapeInfo) console.log("Skipping connecting lines: No inner shape info was stored.");
        else if (numOuterCircles <= 0) console.log("Skipping connecting lines: No outer circles to connect to.");
        else console.log("Skipping connecting lines: Random chance failed."); // Only remaining reason
    }
    // --- End Connecting Lines --- 

    // --- Place some symbols on a random ring ---
    if (shouldDrawRandomSymbolRing) { // <--- START of the conditional block
        // Make symbol ring radius relative to maxRadius, ensure it's inside the outermost circle
        const symbolRadiusFactor = 0.6 + Math.random() * 0.25; // Place symbols between 60% and 85% of maxRadius
        const symbolRadius = maxRadius * symbolRadiusFactor;
        const numSymbols = Math.floor(Math.random() * 7) + 4; // 4 to 10 symbols
        const symbolStartAngle = Math.random() * Math.PI * 2; // Give symbols their own random start angle

        if (symbolRadius > 0 && numOuterCircles > 0) { // Only draw symbols if there's space and circles
            console.log(`Drawing ${numSymbols} symbols at random radius ${symbolRadius.toFixed(1)}`);
            for (let i = 0; i < numSymbols; i++) {
                const angle = symbolStartAngle + (Math.PI * 2 / numSymbols) * i; // Distribute evenly
                const symX = centerX + symbolRadius * Math.cos(angle);
                const symY = centerY + symbolRadius * Math.sin(angle);
                // const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]; // OLD
                const randomSymbol = currentSymbols[Math.floor(Math.random() * currentSymbols.length)]; // NEW
                // Make symbol size slightly random too
                const symbolSize = 18 + Math.random() * 8;
                drawSymbol(randomSymbol, symX, symY, symbolSize, symbolColor);
            }
        } else {
            console.log("Skipping random symbols (radius or circle count too low)");
        }
    } else { // <--- ELSE block (runs if shouldDrawRandomSymbolRing is false)
        console.log("Skipping random symbol ring because symbols were placed on vertices.");
    } // <--- END of the conditional block

    // Add some radial lines
    const numLines = Math.random() < 0.5 ? 8 : 12;
    const lineStartRadius = maxRadius * 0.2;
    const lineEndRadius = maxRadius;

    if (lineStartRadius < lineEndRadius && numOuterCircles > 0) { // Only draw lines if circles exist
        console.log(`Drawing ${numLines} radial lines`);
        for (let i = 0; i < numLines; i++) {
            const angle = (Math.PI * 2 / numLines) * i;
            const lineStartX = centerX + lineStartRadius * Math.cos(angle);
            const lineStartY = centerY + lineStartRadius * Math.sin(angle);
            const lineEndX = centerX + lineEndRadius * Math.cos(angle);
            const lineEndY = centerY + lineEndRadius * Math.sin(angle);
            drawLine(lineStartX, lineStartY, lineEndX, lineEndY, secondaryColor, 1);
        }
    } else {
         console.log("Skipping radial lines (circle count too low)");
    }

    console.log("--- generateMagicCircle END ---");
}

// --- Event Listeners ---
// Ensure listeners are attached only if elements exist
if (generateBtn) {
    generateBtn.addEventListener('click', generateMagicCircle);
    console.log("Generate button listener attached.");
} else {
    console.error("Could not attach listener to Generate button!");
}

if (numCirclesSlider && numCirclesValueSpan) {
    numCirclesSlider.addEventListener('input', () => {
        console.log(`Slider input event fired! New value: ${numCirclesSlider.value}`); // Log slider move
        numCirclesValueSpan.textContent = numCirclesSlider.value; // Update text display
        generateMagicCircle(); // Regenerate circle when slider changes
    });
    console.log("Slider input listener attached.");

    // --- Initial Setup ---
    console.log("Setting initial slider text value.");
    numCirclesValueSpan.textContent = numCirclesSlider.value; // Set initial text for the slider value
    generateMagicCircle(); // Generate one when the page loads

} else {
    console.error("Could not attach listener or set initial value for Slider/Span!");
}

if (symbolSetSelect) {
    symbolSetSelect.addEventListener('change', () => { // 'change' is better for select elements
        console.log(`Symbol set dropdown changed to: ${symbolSetSelect.value}`);
        generateMagicCircle(); // Regenerate the circle with the new set
    });
    console.log("Symbol set select listener attached.");
} else {
    console.error("Could not attach listener to Symbol Set select!");
}

if (innerShapeSelect) {
    innerShapeSelect.addEventListener('change', () => {
        console.log(`Inner shape dropdown changed to: ${innerShapeSelect.value}`);
        generateMagicCircle(); // Regenerate when selection changes
    });
    console.log("Inner shape select listener attached.");
} else {
    console.error("Could not attach listener to Inner Shape select!");
}