// script.js

// Initial game state
let budget = 150;
let rocket = { engine: null, fuel: null, hull: null };

// Canvas for rocket preview (Phase 1)
let rocketCanvas = document.getElementById('rocketCanvas');
let rCtx = rocketCanvas.getContext('2d');

// Select a component and update budget
function selectComponent(type, name, cost, stats) {
    if (rocket[type] || budget < cost) return; // Prevent multiple selections or overspending
    budget -= cost;
    rocket[type] = { name, cost, ...stats };
    document.getElementById('budget').textContent = budget;
    updateSelectionDisplay();
    drawRocket();
    if (rocket.engine && rocket.fuel && rocket.hull) {
        document.getElementById('launchBtn').disabled = false;
    }
}

// Update the display of selected parts
function updateSelectionDisplay() {
    const parts = [
        rocket.engine ? rocket.engine.name : 'No Engine',
        rocket.fuel ? rocket.fuel.name : 'No Fuel',
        rocket.hull ? rocket.hull.name : 'No Hull'
    ];
    document.getElementById('selection').textContent = parts.join(' | ');
}

// Draw the rocket on the canvas with distinct assets
function drawRocket() {
    rCtx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);

    // Draw hull based on weight
    if (rocket.hull) {
        let hullWeight = rocket.hull.weight;
        rCtx.fillStyle = '#666'; // Gray hull
        if (hullWeight <= 25) {
            rCtx.fillRect(60, 100, 80, 150); // Light hull
        } else if (hullWeight <= 55) {
            rCtx.fillRect(50, 100, 100, 150); // Medium hull
            rCtx.beginPath();
            rCtx.moveTo(50, 150); rCtx.lineTo(30, 180); rCtx.lineTo(50, 180); rCtx.fill(); // Left fin
            rCtx.beginPath();
            rCtx.moveTo(150, 150); rCtx.lineTo(170, 180); rCtx.lineTo(150, 180); rCtx.fill(); // Right fin
        } else {
            rCtx.fillRect(40, 100, 120, 150); // Heavy hull
            rCtx.fillRect(40, 120, 120, 10); // Plating 1
            rCtx.fillRect(40, 140, 120, 10); // Plating 2
        }
    }

    // Draw fuel tank based on capacity
    if (rocket.fuel) {
        let fuelCapacity = rocket.fuel.capacity;
        rCtx.fillStyle = fuelCapacity <= 100 ? 'blue' : fuelCapacity <= 350 ? 'green' : 'purple';
        rCtx.fillRect(70, 120, 60, 100);
    }

    // Draw engine based on thrust
    if (rocket.engine) {
        let engineThrust = rocket.engine.thrust;
        if (engineThrust <= 50) {
            rCtx.fillStyle = 'red';
            rCtx.beginPath();
            rCtx.moveTo(80, 250); rCtx.lineTo(120, 250); rCtx.lineTo(100, 270); rCtx.fill(); // Small flame
        } else if (engineThrust <= 120) {
            rCtx.fillStyle = 'orange';
            rCtx.beginPath();
            rCtx.moveTo(70, 250); rCtx.lineTo(130, 250); rCtx.lineTo(100, 290); rCtx.fill(); // Medium flame
        } else {
            rCtx.fillStyle = 'yellow';
            rCtx.beginPath();
            rCtx.moveTo(60, 250); rCtx.lineTo(140, 250); rCtx.lineTo(100, 310); rCtx.fill(); // Large flame
        }
    }
}

// Launch phase variables (Phase 2)
let gameCanvas = document.getElementById('gameCanvas');
let ctx = gameCanvas.getContext('2d');
let rocketX = 100; // Starting position
let velocity = 0;
let distance = 0;
let fuelRemaining = 0;
let thrust = 0;
let totalWeight = 0;

// Start the launch phase
function startPhase2() {
    document.getElementById('phase1').style.display = 'none';
    document.getElementById('phase2').style.display = 'block';
    totalWeight = rocket.engine.weight + rocket.fuel.weight + rocket.hull.weight;
    thrust = rocket.engine.thrust;
    fuelRemaining = rocket.fuel.capacity;
    rocketX = 100;
    velocity = 0;
    distance = 0;
    gameLoop();
}

// Game loop for the launch phase
function gameLoop() {
    let distanceFromSun = rocketX - 50;
    if (distanceFromSun < 1) distanceFromSun = 1; // Avoid division by zero
    let gravity = 100 / (distanceFromSun * distanceFromSun); // Weaker gravity for feasible escape

    if (fuelRemaining > 0) {
        let acceleration = (thrust / totalWeight) - gravity;
        velocity += acceleration;
        fuelRemaining -= 0.5; // Slower fuel burn rate
    } else {
        velocity -= gravity;
    }

    if (velocity > 0) {
        rocketX += velocity;
        distance += velocity;
    }

    // Draw the launch scene
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(50, 200, 20, 0, Math.PI * 2);
    ctx.fill(); // Sun
    ctx.fillStyle = '#666';
    ctx.fillRect(rocketX, 180, 40, 40); // Rocket

    // Check win/lose conditions
    if (rocketX >= 800) {
        document.getElementById('result').textContent = `Success! Distance: ${Math.round(distance)} units`;
        return;
    }
    if (fuelRemaining <= 0 && velocity <= 0) {
        document.getElementById('result').textContent = `Failed! Distance: ${Math.round(distance)} units`;
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Reset the game to start over
function resetGame() {
    budget = 150;
    rocket = { engine: null, fuel: null, hull: null };
    document.getElementById('budget').textContent = budget;
    updateSelectionDisplay();
    drawRocket();
    document.getElementById('launchBtn').disabled = true;
    document.getElementById('phase1').style.display = 'block';
    document.getElementById('phase2').style.display = 'none';
    document.getElementById('result').textContent = '';
}
