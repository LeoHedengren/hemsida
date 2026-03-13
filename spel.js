const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const Image1 = document.getElementById("emil1");
const Image2 = document.getElementById("emil");
const Image3 = document.getElementById("vilgot");

let spelare = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    direction : {
        up: false,
        down: false,
        left: false,
        right: false
    }
}

let spelKör = false;

let poäng = 0;

let farligtBlock = [];

let spelareLever = true;

let block = [];

function skapaBlock() {
    return {
        x: Math.random() *(canvas.width -30),
        y: Math.random() * (canvas.height -30),
        width: 30,
        height: 30,
        dx: (Math.random() - 0.5) *6,
        dy: (Math.random() - 0.5) *6
    };
}

for (let i = 0; i < 5; i++) {
    block.push(skapaBlock());
}

function skapaFarligtBlock() {
    return{
        x: Math.random() * (canvas.width -30),
        y: Math.random() * (canvas.height -30),
        width: 30,
        height: 30,
        dx: (Math.random() -0.5) *10,
        dy: (Math.random() -0.5) *10
    };
}

for (let i = 0; i < 3; i++) {
    farligtBlock.push(skapaFarligtBlock());
}



function kollision(a, b) {
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}




document.addEventListener("keydown", function(event) {
    if (event.code === "KeyW") {
        spelare.direction.up = true;
    } else if (event.code === "KeyS") {
        spelare.direction.down = true;
    } else if (event.code === "KeyA") {
        spelare.direction.left = true;
    } else if (event.code === "KeyD") {
        spelare.direction.right = true;
    } else if (event.code === "KeyR" && (spelareLever === false || poäng >= 25)) {
        spelKör =false;
        poäng = 0;
        spelareLever = true;
        spelare.x = canvas.width / 2;
        spelare.y = canvas.height / 2;
        farligtBlock = [];
        for (let i = 0; i < 3; i++) {
            farligtBlock.push(skapaFarligtBlock());
        }
        block = [];
        for (let i = 0; i < 5; i++) {
            block.push(skapaBlock());
        }
        spelKör = true;
        gameLoop();
    }
});

document.addEventListener("keyup", function(event) {
    if (event.code === "KeyW") {
        spelare.direction.up = false;
    } else if (event.code === "KeyS") {
        spelare.direction.down = false;
    } else if (event.code === "KeyA") {
        spelare.direction.left = false;
    } else if (event.code === "KeyD") {
        spelare.direction.right = false;
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";

    if (spelare.x + spelare.width > canvas.width) {
        spelare.x = canvas.width - spelare.width;
    }
    if (spelare.y + spelare.height > canvas.height) {
        spelare.y = canvas.height - spelare.height;
    }   
    if (spelare.x < 0) {
        spelare.x += spelare.speed;
    }
    if (spelare.y < 0) {
        spelare.y += spelare.speed;     
    }    
   
    ctx.drawImage(Image3, spelare.x, spelare.y, spelare.width, spelare.height);

    
    for (let i = 0; i < block.length; i++) {
        let b = block[i];

        b.x += b.dx;
        b.y += b.dy;

        if (b.x < 0 || b.x + b.width > canvas.width) {
            b.dx = -b.dx;
        }
        if ( b.y < 0 || b.y + b.height > canvas.height) {
            b.dy = -b.dy;
        }
    

        ctx.fillStyle = "green";
        ctx.drawImage(Image1, b.x, b.y, b.width, b.height);

        if (kollision(spelare, b)) {
            poäng++;
            block.splice(i, 1);
            block.push(skapaBlock());
            i--;
        }
    }

    for (let i = 0; i < farligtBlock.length; i++) {
        let fb = farligtBlock[i];

        fb.x += fb.dx;
        fb.y += fb.dy;

        if (fb.x < 0 || fb.x + fb.width > canvas.width) {
            fb.dx = -fb.dx;
        }
        if (fb.y < 0 || fb.y + fb.height > canvas.height) {
            fb.dy = -fb.dy;
        }

        ctx.fillStyle = "red";
        ctx.drawImage(Image2, fb.x, fb.y, fb.width, fb.height);

        if (kollision(spelare, fb)) {
            spelareLever = false;
        }
    }

    if (spelare.direction.up) {
        spelare.y -= spelare.speed;
    }
    if (spelare.direction.down) {
        spelare.y += spelare.speed;
    }
    if (spelare.direction.left) {
        spelare.x -= spelare.speed;
    }  
    if (spelare.direction.right) {
        spelare.x += spelare.speed;
    }

    ctx.fillStyle = "black";
    ctx.font = "20px bold";
    ctx.fillText("poäng: " + poäng, 10, 30);

    if (spelareLever === false) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px bold";
        ctx.fillText("Game Over!!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "24px bold";
        ctx.fillText("Tryck R för att starta om", canvas.width / 2 - 100, canvas.height / 2 + 40);
        return;
    }

    if (poäng >= 25) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "gold";
        ctx.font = "40px bold";
        ctx.fillText("Du vann!!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "24px bold";
        ctx.fillText("Tryck R för att starta om", canvas.width / 2 - 100, canvas.height / 2 + 40);
        return;
    }

    if (spelKör) {
        requestAnimationFrame(gameLoop);
    }

}

window.onload = function() {
    spelKör = true;
    gameLoop();
}