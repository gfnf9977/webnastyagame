document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load images
    const playerImage = new Image();
    playerImage.src = 'нст1.png';

    const bulletImage = new Image();
    bulletImage.src = 'кава.jpg';

    const enemyImage = new Image();
    enemyImage.src = '985.png';

    const backgroundImage = new Image();
    backgroundImage.src = 'нау.jpg';

    // Player
    let player = {
        x: canvas.width / 2 - 45,
        y: canvas.height - 120,
        width: 90,
        height: 90,
        speed: 25 // Default speed
    };

    // Bullets
    let bullets = [];

    // Enemy
    let enemies = [];
    let initialEnemySpeed = 3; // Default speed

    // Game state flag
    let gameActive = false;

    // Levels configuration
    const levels = {
        easy: {
            enemySpeed: 3, // Easy level enemy speed
        },
        medium: {
            enemySpeed: 4, // Medium level enemy speed
        },
        hard: {
            enemySpeed: 6.5, // Hard level enemy speed
        }
    };

    let startTime; // Start time variable
    let elapsedTime; // Elapsed time variable

    function drawPlayer() {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }

    function drawBullets() {
        bullets.forEach(bullet => {
            ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    function updateBullets() {
        bullets.forEach(bullet => {
            bullet.y -= 15;
        });
        bullets = bullets.filter(bullet => bullet.y > 0);
    }

    function spawnEnemy() {
        if (Math.random() < 0.05) {
            let enemy = {
                x: Math.random() * (canvas.width - 70),
                y: -70,
                width: 70,
                height: 70,
                speed: initialEnemySpeed // Set enemy speed based on selected level
            };
            enemies.push(enemy);
        }
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function updateEnemies() {
        enemies.forEach(enemy => {
            enemy.y += enemy.speed;
        });
    }

    function checkCollisions() {
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    bullets.splice(bulletIndex, 1);
                    enemies.splice(enemyIndex, 1);
                }
            });
        });

        enemies.forEach(enemy => {
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                gameOver();
            }
        });
    }

    function gameOver() {
        gameActive = false; // Set game state to inactive

        // Calculate elapsed time
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);

        Swal.fire({
            title: 'Вот так попадос!)',
            text: 'В этот раз ты прожила ' + elapsedTime + ' секунд перед тем, как попала в руки зловещего 081 Право. Но у тебя есть ещё один шанс ↓↓↓',
            icon: 'info',
            confirmButtonText: 'Попробовать ещё раз'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload(); // Reload the page after user clicks OK
            }
        });
    }

    function draw() {
        if (!gameActive) return; // Stop game if inactive

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawBullets();
        drawEnemies();
        updateBullets();
        spawnEnemy();
        updateEnemies();
        checkCollisions();
        requestAnimationFrame(draw);
    }

    // Key events
    window.addEventListener('keydown', function (event) {
        if (!gameActive) return; // Stop handling events if game is inactive

        if (event.key === 'ArrowLeft' && player.x > 0) {
            player.x -= player.speed;
        } else if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
            player.x += player.speed;
        } else if (event.key === ' ') {
            bullets.push({ x: player.x + player.width / 2 - 25 / 2, y: player.y });
        } else if (event.key === 'r') {
            location.reload();
        }
    });

    // Resize canvas when window resizes
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        location.reload();
    });

    // Function to start the game with selected difficulty level
    window.startGame = function (difficulty) {
        // Set enemy speed based on selected difficulty level
        initialEnemySpeed = levels[difficulty].enemySpeed;

        // Reset game state and start the game
        gameActive = true;
        player.x = canvas.width / 2 - 45;
        player.y = canvas.height - 120;
        bullets = [];
        enemies = [];
        startTime = Date.now(); // Record the start time
        canvas.style.display = 'block'; // Show game canvas
        document.getElementById('difficultyMenu').style.display = 'none'; // Hide difficulty menu
        draw();
    };

});
// Отримайте елемент audio
const backgroundMusic = document.getElementById('backgroundMusic');

// Запустіть аудіо
function playBackgroundMusic() {
    backgroundMusic.play();
}

// Зупиніть аудіо
function stopBackgroundMusic() {
    backgroundMusic.pause();
}

// Викличте функцію playBackgroundMusic() для початку відтворення музики, наприклад, після початку гри
playBackgroundMusic();
