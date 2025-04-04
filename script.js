// --- Select HTML Elements ---
// Make sure these run *after* the HTML elements exist
const canvas = document.getElementById('magicCircleCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const numCirclesSlider = document.getElementById('numCirclesSlider');
const numCirclesValueSpan = document.getElementById('numCirclesValue');
const symbolSetSelect = document.getElementById('symbolSetSelect');
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
    const shapeType = Math.random(); // Random number to decide shape
    const shapeStartAngle = Math.random() * Math.PI * 2; // Random rotation
    const shapeColor = secondaryColor;
    const shapeLineWidth = baseLineWidth;
    const minCircleRadius = numOuterCircles > 0 ? maxRadius * (1 - (numOuterCircles - 1) * circleSpacing) : maxRadius * 0.5; // Recalculate innermost radius

    if (minCircleRadius > 10) { // Only draw if there's reasonable space
        if (shapeType < 0.5) { // 50% chance for Polygon
            const polySides = Math.floor(Math.random() * 4) + 3; // 3 to 6 sides
            const polyRadius = minCircleRadius * (0.4 + Math.random() * 0.4); // Size relative to inner circle
            if (polyRadius > 5) {
                console.log(`Drawing polygon: ${polySides} sides, radius ${polyRadius.toFixed(1)}`);
                drawPolygon(centerX, centerY, polyRadius, polySides, shapeStartAngle, shapeColor, shapeLineWidth);
            } else {
                console.log("Skipping polygon: calculated radius too small");
            }
        } else { // 50% chance for Star
            const starPoints = Math.floor(Math.random() * 4) + 4; // 4 to 7 points
            const starOuterRadius = minCircleRadius * (0.5 + Math.random() * 0.4); // Outer radius relative to inner circle
            const starInnerRadius = starOuterRadius * (0.4 + Math.random() * 0.2); // Inner radius relative to outer (e.g., 40-60%)

            if (starOuterRadius > 5 && starInnerRadius > 0) {
                console.log(`Drawing star: ${starPoints} points, R ${starOuterRadius.toFixed(1)}, r ${starInnerRadius.toFixed(1)}`);
                drawStar(centerX, centerY, starOuterRadius, starInnerRadius, starPoints, shapeStartAngle, shapeColor, shapeLineWidth);
            } else {
                console.log("Skipping star: calculated radii invalid");
            }
        }
    } else {
        console.log("Skipping inner shape: minCircleRadius too small");
    }

    // Place some symbols on a ring
    const symbolRadiusFactor = 0.6 + Math.random() * 0.25;
    const symbolRadius = maxRadius * symbolRadiusFactor;
    const numSymbols = Math.floor(Math.random() * 7) + 4;
    const symbolStartAngle = Math.random() * Math.PI * 2;

    if (symbolRadius > 0 && numOuterCircles > 0) { // Only draw symbols if there's space and circles
        console.log(`Drawing ${numSymbols} symbols at radius ${symbolRadius.toFixed(1)}`);
        for (let i = 0; i < numSymbols; i++) {
            const angle = symbolStartAngle + (Math.PI * 2 / numSymbols) * i;
            const symX = centerX + symbolRadius * Math.cos(angle);
            const symY = centerY + symbolRadius * Math.sin(angle);
            // const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]; OLD
            const randomSymbol = currentSymbols[Math.floor(Math.random() * currentSymbols.length)]; // NEW LINE - Use the active set
            const symbolSize = 18 + Math.random() * 8;
            drawSymbol(randomSymbol, symX, symY, symbolSize, symbolColor);
        }
    } else {
        console.log("Skipping symbols (radius or circle count too low)");
    }

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