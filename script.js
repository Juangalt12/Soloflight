let budget = 150;
let rocket = { engine: null, fuel: null, hull: null };
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

// Draw the rocket on the canvas
function drawRocket() {
    rCtx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
    // Draw hull
    if (rocket.hull) {
        rCtx.fillStyle = '#666';
        rCtx.fillRect(50, 100, 100, 150); // Hull
    }
    // Draw fuel tank
    if (rocket.fuel) {
        rCtx.fillStyle = '#999';
        rCtx.fillRect(70, 120, 60, 100); // Fuel tank inside hull
    }
    // Draw engine
    if (rocket.engine) {
        rCtx.fillStyle = '#ff4444';
        rCtx.beginPath();
        rCtx.moveTo(50, 250);
        rCtx.lineTo(150, 250);
        rCtx.lineTo(100, 280);
        rCtx.fill(); // Engine exhaust
    }
}

// Launch phase variables
let gameCanvas = document.getElementById('gameCanvas');
let ctx = gameCanvas.getContext('2d');
let rocketX = 100; // Starting position
let velocity = 0;
let distance = 0;
let fuelRemaining = 0;
let thrust = 0;
let totalWeight = 0;

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

function gameLoop() {
    let distanceFromSun = rocketX - 50;
    if (distanceFromSun < 1) distanceFromSun = 1; // Prevent division by zero
    let gravity = 1000 / (distanceFromSun * distanceFromSun);
    if (fuelRemaining > 0) {
        let acceleration = (thrust / totalWeight) - gravity;
        velocity += acceleration;
        fuelRemaining -= 1;
    } else {
        velocity -= gravity;
    }
    if (velocity > 0) {
        rocketX += velocity;
        distance += velocity;
    }
    // Draw the scene
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw sun
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(50, 200, 20, 0, Math.PI * 2);
    ctx.fill();
    // Draw rocket
    ctx.fillStyle = '#666';
    ctx.fillRect(rocketX, 180, 40, 40);
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
