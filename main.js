const canvas = document.getElementById("myGame");       // Select the canvas id
const context = canvas.getContext("2d");                // get the context

// create a function to draw rectangle
function drawRectangle(x, y, h, w, color) 
{
    context.fillStyle = color;
    context.fillRect(x, y, h, w);
}


// declare position of first paddle
const first_paddle = {
    x : canvas.width/2 - 80/2,
    y : 10,
    width : 80,
    height : 10,
    color : "white",
    sccore : 0
}


// declare position of second paddle
const second_paddle = {
    x : canvas.width/2 - 80/2,
    y : canvas.height - 10 - 10,
    width : 80,
    height : 10,
    color : "white",
    sccore : 0
}


// Declare the drawCircle function
function drawCircle(x, y, r, color)
{
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, r, 0, Math.PI * 2, false)
    context.closePath()
    context.fill()    
}
// declare position of ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 1,
    velocityX : 5,
    velocityY : 5,
    color : "white"
}


// Display text function
function displayText(text, x, y, color) 
{
    context.fillStyle = color
    context.font = "32px josefin sans"
    context.fillText(text, x, y)    
}


// ############### utility function ###############
function render() 
{
    // make canvas by using function
    drawRectangle(0, 0, 800, 500, "lightgreen")

    //  draw  first paddle
    drawRectangle(first_paddle.x, first_paddle.y, first_paddle.width, 
        first_paddle.height, first_paddle.color)

    //  draw  second paddle
    drawRectangle(second_paddle.x, second_paddle.y,
        second_paddle.width, second_paddle.height, second_paddle.color)

    // call the drawcircle function to create a ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color)

    // display score using displayText function
    // for first paddle score
    displayText(`Paddle 1: ${first_paddle.sccore}`, 20, canvas.height/2 - 40, "black")
    // for second paddle score
    displayText(`Paddle 2: ${second_paddle.sccore}`, 20, canvas.height/2 + 40, "black")
}

// ################################################################################

// collision detection
function collision(b, player) 
{
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius

    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    return player.right > b.left && player.left < b.right && b.bottom > player.top && b.top < player.bottom;
}


// Control paddles
canvas.addEventListener('mousemove', movePaddles);
function movePaddles(e) 
{
    let rectangle = canvas.getBoundingClientRect();
    second_paddle.x = e.clientX - rectangle.left - first_paddle.width/2;    
    first_paddle.x = e.clientX - rectangle.left - second_paddle.width/2;    
}


// reset ball
function resetBall() 
{
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 1;
    ball.velocityY = -ball.velocityY;    
}


//  game over function
function showGameOver() 
{
    // hide canvas
    canvas.style.display = "none";
    const can = document.getElementById("can")
    can.style.display = "none";

    // container
    const result = document.getElementById("result")
    result.style.display = "block"
}

// move ball
function update_ball() 
{
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // reflect from wall
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
    {
        ball.velocityX = -ball.velocityX;
    }
    // if (ball.y + ball.radius > canvas.height || ball.x - ball.radius < 0)
    // {
    //     ball.velocityY = -ball.velocityY;
    // }

    // if collision happen
    let player = (ball.y < canvas.height/2) ? first_paddle : second_paddle;
    if(collision(ball, player))
    {
        ball.velocityY = -ball.velocityY;
        ball.speed += 0.1;
    }

    // update score
    if (ball.y - ball.radius < 0)
    {
        second_paddle.sccore++;
        resetBall()
    }
    else if (ball.y + ball.radius > canvas.height) {
        first_paddle.sccore++;
        resetBall()
    }


    // Game over function call
    if(second_paddle.sccore > 5 || first_paddle.sccore > 5)
    {
        clearInterval(loop);
        showGameOver();
    }

}

// start game
function start() 
{
    // call the render function
    render();

    // call update function
    update_ball()
}

// loop
const loop = setInterval(start, 1000/50);