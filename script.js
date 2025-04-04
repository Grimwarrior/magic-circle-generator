const canvas = document.getElementById('magicCircleCanvas');
const ctx = canvas.getContext('2d'); // Get the 2D drawing context
const generateBtn = document.getElementById('generateBtn');
const numCirclesSlider = document.getElementById('numCirclesSlider');
const numCirclesValueSpan = document.getElementById('numCirclesValue');

const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

// --- Drawing Helper Functions ---

function drawCircle(x, y, radius, color = 'white', lineWidth = 2) {
    // Prevent drawing circles with negative radius, which can cause errors
    if (radius <= 0) return;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2); // Full circle
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}


/**
 * Draws a regular polygon on the canvas.
 * @param {number} cx - Center X coordinate.
 * @param {number} cy - Center Y coordinate.
 * @param {number} radius - Distance from center to vertices.
 * @param {number} sides - Number of sides (e.g., 3 for triangle, 5 for pentagon).
 * @param {number} startAngle - Rotation offset in radians (0 = first point is typically to the right).
 * @param {string} [color='white'] - Stroke color.
 * @param {number} [lineWidth=2] - Line width.
 * @param {boolean} [fill=false] - Whether to fill the polygon.
 * @param {string} [fillColor='grey'] - Fill color if fill is true.
 */
function drawPolygon(cx, cy, radius, sides, startAngle, color = 'white', lineWidth = 2, fill = false, fillColor = 'grey') {
    if (sides < 3 || radius <= 0) return; // Need at least 3 sides and positive radius

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

    // ctx.closePath(); // Use this if you want the shape explicitly closed, good for filling

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
const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '✨', '★', '✡', '⚪', '⚫', '△', '▽', '☐']; // Added a few more

function drawSymbol(symbol, x, y, size = 20, color = 'white') {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, y);
}

 // --- Text on Arc Helper (Keep as is for now) ---
function drawTextOnArc(/* ... parameters ... */) {
    // ... (existing code) ...
}


// --- The Main Generation Function ---

function generateMagicCircle() {
    // 1. Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // 2. Read Controls & Define Parameters
    const numOuterCircles = parseInt(numCirclesSlider.value); // Read slider value
    console.log("Generating with numOuterCircles:", numOuterCircles); // Debug log

    const maxRadius = Math.min(width, height) / 2 - 15; // Slightly smaller padding
    const baseLineWidth = 1.5; // Let's use a fixed base width for now
    const primaryColor = `hsl(${Math.random() * 360}, 80%, 70%)`;
    const secondaryColor = 'rgba(200, 200, 200, 0.7)';
    const symbolColor = primaryColor; // Use primary color for symbols too

    // 3. Draw Base Elements

    // Draw Outer Circles (Deterministic Radius)
    const circleSpacing = 0.15; // Fixed spacing factor (adjust as needed)
    for (let i = 0; i < numOuterCircles; i++) {
        // Calculate radius more predictably: start from maxRadius and decrease
        const radius = maxRadius * (1 - i * circleSpacing);
        // Make inner circles slightly thinner or same width
        const lineWidth = Math.max(1, baseLineWidth - i * 0.2);
        console.log(`Drawing circle ${i}: radius ${radius.toFixed(1)}, lineWidth ${lineWidth.toFixed(1)}`) // Debug log
        drawCircle(centerX, centerY, radius, primaryColor, lineWidth);
    }

    // --- Draw ONE inner polygon ---
    // Decide if we even draw a polygon (let's make it random for now)
    if (Math.random() > 0.3) { // 70% chance to draw a polygon
        const polySides = Math.floor(Math.random() * 4) + 3; // 3 to 6 sides
        // Ensure polygon radius is smaller than the innermost circle drawn
        // The innermost circle's radius is roughly maxRadius * (1 - (numOuterCircles-1) * circleSpacing)
        const minCircleRadius = maxRadius * (1 - (numOuterCircles - 1) * circleSpacing);
        // Place polygon radius somewhere between 30% and 70% of the innermost circle radius
        const polyRadius = minCircleRadius * (0.3 + Math.random() * 0.4);

        if (polyRadius > 5) { // Only draw if it's not too tiny
            const polyAngle = Math.random() * Math.PI * 2;
            const polyColor = secondaryColor;
            const polyLineWidth = baseLineWidth;
            console.log(`Drawing polygon: ${polySides} sides, radius ${polyRadius.toFixed(1)}`);
            drawPolygon(centerX, centerY, polyRadius, polySides, polyAngle, polyColor, polyLineWidth);
        } else {
            console.log("Skipping polygon: calculated radius too small");
        }
    } else {
         console.log("Skipping polygon: random chance");
    }
    // REMOVED the second, duplicate drawPolygon call here


    // --- Place some symbols on a ring ---
    // Make symbol ring radius relative to maxRadius, ensure it's inside the outermost circle
    const symbolRadiusFactor = 0.6 + Math.random() * 0.25; // Place symbols between 60% and 85% of maxRadius
    const symbolRadius = maxRadius * symbolRadiusFactor;
    const numSymbols = Math.floor(Math.random() * 7) + 4; // 4 to 10 symbols
    const symbolStartAngle = Math.random() * Math.PI * 2; // Give symbols their own random start angle

    if (symbolRadius > 0) {
        console.log(`Drawing ${numSymbols} symbols at radius ${symbolRadius.toFixed(1)}`);
        for (let i = 0; i < numSymbols; i++) {
            const angle = symbolStartAngle + (Math.PI * 2 / numSymbols) * i; // Distribute evenly
            const symX = centerX + symbolRadius * Math.cos(angle);
            const symY = centerY + symbolRadius * Math.sin(angle);
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            // Make symbol size slightly random too
            const symbolSize = 18 + Math.random() * 8;
            drawSymbol(randomSymbol, symX, symY, symbolSize, symbolColor);
        }
    }

    // --- Add some radial lines ---
    // Let's base the number of lines on something fixed or random, not symbols
    const numLines = Math.random() < 0.5 ? 8 : 12; // Draw 8 or 12 radial lines
    const lineStartRadius = maxRadius * 0.2; // Start lines from 20% radius
    const lineEndRadius = maxRadius; // End lines at max radius

    if (lineStartRadius < lineEndRadius) { // Only draw if there's space
        console.log(`Drawing ${numLines} radial lines`);
        for (let i = 0; i < numLines; i++) {
            const angle = (Math.PI * 2 / numLines) * i;
            const lineStartX = centerX + lineStartRadius * Math.cos(angle);
            const lineStartY = centerY + lineStartRadius * Math.sin(angle);
            const lineEndX = centerX + lineEndRadius * Math.cos(angle);
            const lineEndY = centerY + lineEndRadius * Math.sin(angle);
            drawLine(lineStartX, lineStartY, lineEndX, lineEndY, secondaryColor, 1); // Thin lines
        }
    }

    console.log("Generated a new circle!");
    console.log("---"); // Separator for logs
}

// --- Event Listeners ---
generateBtn.addEventListener('click', generateMagicCircle);

numCirclesSlider.addEventListener('input', () => {
    numCirclesValueSpan.textContent = numCirclesSlider.value; // Update text display
    generateMagicCircle(); // Regenerate circle when slider changes
});


// --- Initial Setup ---
numCirclesValueSpan.textContent = numCirclesSlider.value; // <<< FIX 1: Set initial text for the slider value
generateMagicCircle(); // Generate one when the page loads