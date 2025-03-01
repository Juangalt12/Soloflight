let budget = 100;
let rocket = { engine: null, fuel: null, hull: null };
let phase = 1;

// Phase 1: Component Selection
function selectComponent(type, name, cost, stats) {
    if (budget < cost || rocket[type]) return; // Already selected or insufficient funds
    budget -= cost;
    rocket[type] = { name, cost, ...stats };
    document.getElementById('budget').textContent = budget;
    updateSelectionDisplay();
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

// Phase 2: Launch & Trajectory
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let rocketX = 50, rocketY = 200, velocity = 0, distance = 0;
let fuelRemaining, totalWeight, thrust;

function startPhase2() {
    document.getElementById('phase1').style.display = 'none';
    document.getElementById('phase2').style.display = 'block';
    phase = 2;

    // Calculate rocket stats
    thrust = rocket.engine.thrust;
    fuelRemaining = rocket.fuel.fuel;
    totalWeight = rocket.engine.weight + rocket.fuel.weight + rocket.hull.weight;
    velocity = thrust / totalWeight; // Simple thrust-to-weight ratio

    gameLoop();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Sun (center-left)
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(50, 200, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw Rocket
    ctx.fillStyle = 'silver';
    ctx.fillRect(rocketX, rocketY - 10, 20, 20);

    // Simple physics
    if (fuelRemaining > 0) {
        rocketX += velocity;
        distance += velocity;
        fuelRemaining -= 1; // Fuel burn rate
        let gravity = 1000 / (rocketX * rocketX); // Inverse-square gravity from Sun
        velocity -= gravity; // Slowed by gravity
        if (velocity < 0) velocity = 0; // Can't go backward
    } else {
        // Out of fuel, coasting
        let gravity = 1000 / (rocketX * rocketX);
        velocity -= gravity;
        if (velocity > 0) {
            rocketX += velocity;
            distance += velocity;
        }
    }

    // Check win condition (escape solar system)
    if (rocketX > canvas.width) {
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
    budget = 100;
    rocket = { engine: null, fuel: null, hull: null };
    rocketX = 50;
    distance = 0;
    phase = 1;
    document.getElementById('budget').textContent = budget;
    updateSelectionDisplay();
    document.getElementById('launchBtn').disabled = true;
    document.getElementById('phase1').style.display = 'block';
    document.getElementById('phase2').style.display = 'none';
    document.getElementById('result').textContent = '';
}
