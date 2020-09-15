(function () {
    drawTable();

    var level = [
        '**************',
        '**************',
        '**************',
        '**************'
    ];

    var gameLoop;
    var userLive = 3;
    var gameSpeed = 20;
    var ballMovementSpeed = 3;

    var bricks = [];
    var bricksMargin = 1;
    var bricksWidth = 0;
    var bricksHeight = 18;
    var leftArrow = false;
    var rightArrow = false;
    var ball = {
        width: 6,
        height: 6,
        left: 0,
        top: 0,
        speedLeft: 0,
        speedTop: 0
    };

    var paddle = {
        width: 100,
        height: 6,
        left: (document.getElementById('breakout').offsetWidth / 2) - 30,
        top: document.getElementById('breakout').offsetHeight - 40
    };

    function startGame() {
        resetBall();
        buildLevel();
        createBricks();
        updateObjects();
    }

    function drawTable() {
        document.body.style.background = '#0E5CAD';
        document.body.style.font = '18px Orbitron';
        document.body.style.color = '#FFF';

        var breakout = document.createElement('div');
        var paddle = document.createElement('div');
        var ball = document.createElement('div');

        breakout.id = 'breakout';
        breakout.style.width = '800px';
        breakout.style.height = '600px';
        breakout.style.position = 'fixed';
        breakout.style.left = '50%';
        breakout.style.top = '50%';
        breakout.style.transform = 'translate(-50%, -50%)';
        breakout.style.background = '#000000';

        paddle.id = 'paddle';
        paddle.style.background = '#E80505';
        paddle.style.position = 'absolute';
        paddle.style.boxShadow = '0 15px 6px -2px rgba(0,0,0,.6)';

        ball.className = 'ball';
        ball.style.position = 'absolute';
        ball.style.background = '#FFF';
        ball.style.boxShadow = '0 15px 6px -1px rgba(0,0,0,.6)';
        ball.style.borderRadius = '50%';
        ball.style.zIndex = '9';

        breakout.appendChild(paddle);
        breakout.appendChild(ball);

        document.body.appendChild(breakout);
    }

    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    function buildLevel() {
        var arena = document.getElementById('breakout');

        bricks = [];

        for (var row = 0; row < level.length; row++) {
            for (var column = 0; column <= level[row].length; column++) {

                if (!level[row][column] || level[row][column] === ' ') {
                    continue;
                }

                bricksWidth = (arena.offsetWidth - bricksMargin * 2) / level[row].length;

                bricks.push({
                    left: bricksMargin * 2 + (bricksWidth * column),
                    top: bricksHeight * row + 60,
                    width: bricksWidth - bricksMargin * 2,
                    height: bricksHeight - bricksMargin * 2

                });
            }
        }
    }

    function removeBricks() {
        document.querySelectorAll('.brick').forEach(function (brick) {
            removeElement(brick);
        });
    }

    function createBricks() {
        removeBricks();

        var arena = document.getElementById('breakout');

        bricks.forEach(function (brick, index) {
            var element = document.createElement('div');

            element.id = 'brick-' + index;
            element.className = 'brick';
            element.style.left = brick.left + 'px';
            element.style.top = brick.top + 'px';
            element.style.width = brick.width + 'px';
            element.style.height = brick.height + 'px';
            element.style.background = '#FFFFFF';
            element.style.position = 'absolute';
            element.style.boxShadow = '0 15px 20px 0px rgba(0,0,0,.4)';

            arena.appendChild(element)
        });
    }

    function updateObjects() {
        document.getElementById('paddle').style.width = paddle.width + 'px';
        document.getElementById('paddle').style.height = paddle.height + 'px';
        document.getElementById('paddle').style.left = paddle.left + 'px';
        document.getElementById('paddle').style.top = paddle.top + 'px';

        document.querySelector('.ball').style.width = ball.width + 'px';
        document.querySelector('.ball').style.height = ball.height + 'px';
        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';
    }

    function resetBall() {
        var arena = document.getElementById('breakout');

        ball.left = (arena.offsetWidth / 2) - (ball.width / 2);
        ball.top = (arena.offsetHeight / 1.6) - (ball.height / 2);
        ball.speedTop = ballMovementSpeed;
        ball.speedLeft = ballMovementSpeed;

        if (Math.round(Math.random() * 1) == 0) {
            ball.speedLeft = -ballMovementSpeed;
        }

        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';
    }

    function movePaddle(clientX) {
        var arena = document.getElementById('breakout');
        var arenaRect = arena.getBoundingClientRect();
        var arenaWidth = arena.offsetWidth;
        var mouseX = clientX - arenaRect.x;
        var halfOfPaddle = document.getElementById('paddle').offsetWidth / 2;

        if (mouseX <= halfOfPaddle) {
            mouseX = halfOfPaddle;
        }
        if (mouseX >= arenaWidth - halfOfPaddle) {
            mouseX = arenaWidth - halfOfPaddle;
        }
        paddle.left = mouseX - halfOfPaddle;


    }

    function moveBall() {

        detectCollision();

        var arena = document.getElementById('breakout');

        ball.top += ball.speedTop;
        ball.left += ball.speedLeft;

        if (ball.left <= 0 || ball.left + ball.width >= arena.offsetWidth) {
            ball.speedLeft = -ball.speedLeft;
        }

        if (ball.top <= 0 || ball.top + ball.height >= arena.offsetHeight) {
            ball.speedTop = -ball.speedTop;
        }

        if (ball.top + ball.height >= arena.offsetHeight) {
            resetBall();
        }
    }

    function detectCollision() {
        if (ball.top + ball.height >= paddle.top
            && ball.top + ball.height <= paddle.top + paddle.height
            && ball.left >= paddle.left
            && ball.left <= paddle.left + paddle.width
        ) {
            //ball.speedLeft = ball.speedLeft * Math.cos(25);
            //ball.speedTop = -ball.speedTop * Math.sin(40);
            ball.speedLeft = ball.speedLeft
            ball.speedTop = -ball.speedTop
        }

        if (ball.top + ball.height > paddle.top + paddle.height) {
            userLive -= 1;
            if (userLive >= 0) {

                console.log(userLive);
                console.log("can gitti");
                resetBall();
            }
            else {
                console.log("Oyun Bitti")
                stop();  /// OYUNU BİTİR
            }
        }

        for (var i = 0; i < bricks.length; i++) {
            var brick = bricks[i];

            if (ball.top + ball.height >= brick.top
                && ball.top <= brick.top + brick.height
                && ball.left + ball.width >= brick.left
                && ball.left <= brick.left + brick.width
                && !brick.removed
            ) {

                ball.speedTop = -ball.speedTop;
                brick.top = "-100"
                brick.left = "-100";
                ball.speedTop += 1;
                ball.speedLeft += 1;

                createBricks();
                console.log(bricks[i]);
                break;
            }
        }
    }



    function setEvents() {
        document.addEventListener('mousemove', function (event) {
            movePaddle(event.clientX);
        });
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 37) {
                leftArrow = true;
                console.log("left true")
            }
            else if (event.keyCode = 40) {
                rightArrow = true;
                console.log("right true")
            }
            movePaddleWithKeyboard();
        });
        document.addEventListener('keyup', function (event) {
            if (event.keyCode == 37) {
                leftArrow = false;
            }
            else if (event.keyCode = 40) {
                rightArrow = false;
            }

        });

    }
    function movePaddleWithKeyboard() {

        if (rightArrow) {
            if (paddle.left + paddle.width <= 800) {
                paddle.left += 20;
            }
        }
        if (leftArrow) {
            if (paddle.left >= 0) {
                paddle.left -= 20;
            }

        }
    }
    function startGameLoop() {
        gameLoop = setInterval(function () {
            moveBall();
            updateObjects();
        }, gameSpeed);
    }

    setEvents();
    startGame();
    startGameLoop();
})();