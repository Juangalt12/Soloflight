let budget = 150; // Increased budget for more options
let rocket = { engine: null, fuel: null, hull: null };
let phase = 1;

// Rocket preview canvas
let rocketCanvas = document.getElementById('rocketCanvas');
let rCtx = rocketCanvas.getContext('2d');

// Component selection
function selectComponent(type, name, cost, stats) {
    if (budget < cost || rocket[type]) return;
    budget -= cost;
    rocket[type] = { name, cost, ...stats };
    document.getElementById('budget').textContent = budget;
    updateSelectionDisplay();
    drawRocket();
    if (rocket.engine && rocket.fuel && rocket.hull) {
        document.getElementById('launchBtn').disabled = false;
    }
}

function updateSelectionDisplay() {
    const parts = [
        rocket.engine ? rocket.engine.name : 'No Engine',
        rocket.fuel ? rocket.fuel.name : 'No Fuel',
        rocket.hull ? rocket.hull.name : 'No Hull'
    ];
    document.getElementById('selection').textContent = parts.join(' | ');
}

function drawRocket() {
    rCtx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
    rCtx.fillStyle = '#333';
    rCtx.fillRect(0, 0, rocketCanvas.width, rocketCanvas.height);

    let yOffset = 50;
    // Hull (base body)
    if (rocket.hull) {
        rCtx.fillStyle = '#666';
        rCtx.fillRect(80, yOffset, 40, 150); // Tall rectangle for hull
        yOffset += 150;
    }
    // Fuel Tank (middle section)
    if (rocket.fuel) {
        rCtx.fillStyle = '#999';
        rCtx.fillRect(90, yOffset - 100, 20, 80); // Smaller section inside hull
    }
    // Engine (bottom exhaust)
    if (rocket.engine) {
        rCtx.fillStyle = '#ff4444';
        rCtx.beginPath();
        rCtx.moveTo(90, yOffset);
        rCtx.lineTo(110, yOffset);
        rCtx.lineTo(100, yOffset + 30);
        rCtx.fill(); // Triangle for exhaust
    }
}

// Phase 2: Launch & Trajectory
let gameCanvas = document.getElementById('gameCanvas');
let ctx = gameCanvas.getContext('2d');
let rocketX = 50, rocketY = 200, velocity = 0, distance = 0;
let fuelRemaining, totalWeight, thrust;

function startPhase2() {
    document.getElementById('phase1').style.display = 'none';
    document.getElementById('phase2').style.display = 'block';
    phase = 2;

    thrust = rocket.engine.thrust;
    fuelRemaining = rocket.fuel.fuel;
    totalWeight = rocket.engine.weight + rocket.fuel.weight + rocket.hull.weight;
    velocity = thrust / totalWeight;

    gameLoop();
}

function gameLoop() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw Sun
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(50, 200, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw Rocket (same design as preview)
    if (rocket.hull) {
        ctx.fillStyle = '#666';
        ctx.fillRect(rocketX, rocketY - 75, 40, 150);
    }
    if (rocket.fuel) {
        ctx.fillStyle = '#999';
        ctx.fillRect(rocketX + 10, rocketY - 25, 20, 80);
    }
    if (rocket.engine && fuelRemaining > 0) {
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(rocketX + 10, rocketY + 75);
        ctx.lineTo(rocketX + 30, rocketY + 75);
        ctx.lineTo(rocketX + 20, rocketY + 105);
        ctx.fill();
    }

    // Physics
    if (fuelRemaining > 0) {
        rocketX += velocity;
        distance += velocity;
        fuelRemaining -= 1;
        let gravity = 1000 / (rocketX * rocketX);
        velocity -= gravity;
        if (velocity < 0) velocity = 0;
    } else {
        let gravity = 1000 / (rocketX * rocketX);
        velocity -= gravity;
        if (velocity > 0) {
            rocketX += velocity;
            distance += velocity;
        }
    }

    // Win/Lose
    if (rocketX > gameCanvas.width) {
        document.getElementById('result').textContent = `Victory! You soared ${Math.round(distance)} light-years!`;
        return;
    }
    if (fuelRemaining <= 0 && velocity <= 0) {
        document.getElementById('result').textContent = `Stranded! Reached ${Math.round(distance)} light-years.`;
        return;
    }

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    budget = 150;
    rocket = { engine: null, fuel: null, hull: null };
    rocketX = 50;
    distance = 0;
    phase = 1;
    document.getElementById('budget').textContent = budget;
    updateSelectionDisplay();
    drawRocket();
    document.getElementById('launchBtn').disabled = true;
    document.getElementById('phase1').style.display = 'block';
    document.getElementById('phase2').style.display = 'none';
    document.getElementById('result').textContent = '';
}
