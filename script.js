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
    if (sides < 3) return; // Need at least 3 sides

    ctx.beginPath();
    // Calculate the angle between vertices
    const angleStep = (Math.PI * 2) / sides;

    // Move to the first vertex
    let startX = cx + radius * Math.cos(startAngle);
    let startY = cy + radius * Math.sin(startAngle);
    ctx.moveTo(startX, startY);

    // Draw lines to subsequent vertices
    for (let i = 1; i <= sides; i++) {
        const currentAngle = startAngle + i * angleStep;
        const nextX = cx + radius * Math.cos(currentAngle);
        const nextY = cy + radius * Math.sin(currentAngle);
        ctx.lineTo(nextX, nextY);
    }

    // ctx.closePath(); // Connects the last vertex back to the first

    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    // Always stroke after potential fill to ensure outline is visible
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

// Add more helpers: drawPolygon, drawTextOnArc, drawSymbol...

// --- Symbol/Glyph Resources (Example) ---
// You'll need actual symbols. These could be:
// 1. Unicode characters from specific blocks
// 2. Pre-loaded images (use ctx.drawImage)
// 3. SVG paths drawn onto the canvas
// 4. Procedurally generated shapes
const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '룬', '★', '✡']; // Example symbols

function drawSymbol(symbol, x, y, size = 20, color = 'white') {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`; // Use a specific symbol font if you have one
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, y);
}

 // --- Text on Arc Helper (More Complex) ---
function drawTextOnArc(text, x, y, radius, startAngle, angularDistance, color = 'white', fontSize = 15) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px 'Times New Roman'`; // Or a more thematic font
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const angleStep = angularDistance / text.length;
    ctx.save(); // Save context state
    ctx.translate(x, y); // Move origin to circle center

    for (let i = 0; i < text.length; i++) {
        const charAngle = startAngle + i * angleStep + angleStep / 2; // Center char on its segment

        ctx.save();
        ctx.rotate(charAngle); // Rotate context for the character
        // Adjust y position slightly outwards if needed, and flip if drawing on bottom half
        // This simple version places the base of the text on the radius
        ctx.fillText(text[i], 0, -radius);
        ctx.restore();
    }
    ctx.restore(); // Restore original context state
}


// --- The Main Generation Function ---

function generateMagicCircle() {
    // 1. Clear the canvas
    ctx.clearRect(0, 0, width, height); // Clear previous drawing

    // 2. Define Parameters (Randomly for now)
    const numOuterCircles = parseInt(numCirclesSlider.value); // NEW
    const maxRadius = Math.min(width, height) / 2 - 20; // Max radius with padding
    const baseLineWidth = Math.random() * 2 + 1; // 1 to 3
    const primaryColor = `hsl(${Math.random() * 360}, 80%, 70%)`; // Random vibrant color
    const secondaryColor = 'rgba(200, 200, 200, 0.7)';

    // 3. Draw Base Elements (Example Logic)

    // Draw Outer Circles
    for (let i = 0; i < numOuterCircles; i++) {
        const radius = maxRadius * (1 - i * 0.1 * Math.random());
        drawCircle(centerX, centerY, radius, primaryColor, baseLineWidth + i);
    }

    // Draw an inner polygon (e.g., pentagram or hexagram)
    const numSides = Math.random() < 0.5 ? 5 : 6; // 5 or 6 sides
    const startAngle = Math.random() * Math.PI * 2;
    
    // --- Draw an inner polygon ---
    const polySides = Math.floor(Math.random() * 4) + 3; // 3 to 6 sides (tri, sq, pent, hex)
    const polyRadius = maxRadius * (0.4 + Math.random() * 0.3); // Place it somewhere inside
    const polyAngle = Math.random() * Math.PI * 2; // Random rotation
    const polyColor = secondaryColor; // Use one of your existing colors
    const polyLineWidth = baseLineWidth;

    console.log(`Drawing polygon: ${polySides} sides, radius ${polyRadius.toFixed(1)}`); // Debug log
    drawPolygon(centerX, centerY, polyRadius, polySides, polyAngle, polyColor, polyLineWidth);
    drawPolygon(centerX, centerY, polyRadius, numSides, startAngle, secondaryColor, baseLineWidth); // Need to implement drawPolygon

    // Place some symbols on a ring
    const symbolRadius = maxRadius * (0.7 + Math.random() * 0.1);
    const numSymbols = Math.floor(Math.random() * 7) + 4; // 4 to 10 symbols
    for (let i = 0; i < numSymbols; i++) {
        const angle = (Math.PI * 2 / numSymbols) * i + startAngle / 2; // Distribute evenly
        const symX = centerX + symbolRadius * Math.cos(angle);
        const symY = centerY + symbolRadius * Math.sin(angle);
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        drawSymbol(randomSymbol, symX, symY, 20 + Math.random() * 10, primaryColor);
    }

    // Add some radial lines
    const numLines = numSymbols * (Math.random() < 0.5 ? 1 : 2); // Same or double symbols
    for (let i = 0; i < numLines; i++) {
        const angle = (Math.PI * 2 / numLines) * i;
        const lineEndX = centerX + maxRadius * Math.cos(angle);
        const lineEndY = centerY + maxRadius * Math.sin(angle);
        const lineStartX = centerX + maxRadius * 0.2 * Math.cos(angle); // Start lines from an inner radius
        const lineStartY = centerY + maxRadius * 0.2 * Math.sin(angle);
         drawLine(lineStartX, lineStartY, lineEndX, lineEndY, secondaryColor, 1);
    }

    // Add some text (Example)
    // const textRadius = maxRadius * 0.9;
    // drawTextOnArc("SOMETHING MYSTICAL", centerX, centerY, textRadius, -Math.PI / 2, Math.PI, primaryColor, 16); // Top half

    console.log("Generated a new circle!");
}

// --- Event Listener ---
generateBtn.addEventListener('click', generateMagicCircle);
// Add an event listener to update the display and regenerate (optional auto-regen)
numCirclesSlider.addEventListener('input', () => {
    numCirclesValueSpan.textContent = numCirclesSlider.value;
    // Optional: automatically regenerate when slider moves
    generateMagicCircle();
});

// --- Initial Generation ---
generateMagicCircle(); // Generate one when the page loads