let budget = 150;
let rocket = { engine: null, fuel: null, hull: null };
let rocketCanvas = document.getElementById('rocketCanvas');
let rCtx = rocketCanvas.getContext('2d');
let gameCanvas = document.getElementById('gameCanvas');
let ctx = gameCanvas.getContext('2d');
let rocketX = 400;  // Center of canvas horizontally
let rocketY = 500;  // Starting position above Earth
let velocity = 0;
let fuelRemaining = 0;
let thrust = 0;
let totalWeight = 0;
let backgroundImg = new Image();
backgroundImg.src = 'solar_system.png';  // Your AI-generated solar system image

// Function to select components and update budget
function selectComponent(type, name, cost, stats) {
    if (rocket[type] || budget < cost) return;
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

// Draw the rocket on the preview canvas
function drawRocket() {
    rCtx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
    if (rocket.hull) {
        rCtx.fillStyle = '#666';
        rCtx.fillRect(50, 100, 100, 150);
    }
    if (rocket.fuel) {
        rCtx.fillStyle = '#999';
        rCtx.fillRect(70, 120, 60, 100);
    }
    if (rocket.engine) {
        rCtx.fillStyle = '#ff4444';
        rCtx.beginPath();
        rCtx.moveTo(50, 250);
        rCtx.lineTo(150, 250);
        rCtx.lineTo(100, 280);
        rCtx.fill();
    }
}

// Start the launch phase
function startPhase2() {
    document.getElementById('phase1').style.display = 'none';
    document.getElementById('phase2').style.display = 'block';
    totalWeight = rocket.engine.weight + rocket.fuel.weight + rocket.hull.weight;
    thrust = rocket.engine.thrust;
    fuelRemaining = rocket.fuel.capacity;
    rocketX = 400;  // Center horizontally
    rocketY = 500;  // Start just above Earth
    velocity = 0;
    // Wait for background image to load before starting the loop
    backgroundImg.onload = function() {
        gameLoop();
    };
    if (backgroundImg.complete) {
        gameLoop();  // If image is already loaded
    }
}

// Game loop for the launch phase
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw the solar system background
    ctx.drawImage(backgroundImg, 0, 0, gameCanvas.width, gameCanvas.height);

    // Draw Earth (blue circle at bottom center)
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(400, 550, 50, 0, Math.PI * 2);
    ctx.fill();

    // Update rocket position (vertical movement)
    if (fuelRemaining > 0) {
        let acceleration = (thrust / totalWeight) - 0.1;  // Gravity effect
        velocity += acceleration;
        fuelRemaining -= 0.1;
    } else {
        velocity -= 0.1;  // Gravity pulls down when fuel runs out
    }

    rocketY -= velocity;  // Decrease y to move up (canvas y increases downward)

    // Draw the rocket (simple vertical rectangle)
    ctx.fillStyle = '#666';
    ctx.fillRect(rocketX - 20, rocketY - 40, 40, 80);

    // Win condition: reaches top of screen
    if (rocketY <= 0) {
        document.getElementById('result').textContent = 'Success! You escaped the solar system!';
        return;
    }

    // Lose condition: falls back to Earth
    if (rocketY >= 500 && velocity <= 0) {
        document.getElementById('result').textContent = 'Failed! The rocket crashed back to Earth.';
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
