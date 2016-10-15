
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var preloader = document.getElementById("page-preloader");

// Create the canvas
var isGameOver;
var terrainPattern;
var lastTime;
var secondsLeft2=0;
var gameAccelerationTime = 0.4;
var playerRoadSpeed = 0;
var playerFramesChangeSpeed;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width = 400;
var height = canvas.height = 500;
document.body.appendChild(canvas);
var lastTimeEnemyAdded = 0;
var lastTimeBonusAdded = 0;
var lastFire = Date.now();
var gameTime = 0;
var score = 1001;
var ciggareteScore = 0;
var scoreEl = document.getElementById('score');
var ciggareteScoreEl = document.getElementById('ciggaretescore');
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 100;
var playerSpeedChangeStep = 1;
var maxPlayerSpeed = 50;
var lastRoad = 0;
var roadStartY = -400;
var bullets = [];
var enemies = [];
var explosions = [];
var bonuses = [
    {
        taken: false,
        pos: [ 40, -30],
        size: [20, 80],
        rotation: 0,
        sprite: new Sprite('images/sprites.png', [175, 0], [20, 80]),
    }
];
var player = {
        size: [80, 101],
        pos: [0, 610],
        sprite: new Sprite('images/pl.png', [0, 0], [80, 101], playerFramesChangeSpeed, [ 5,4, 3, 2,1, 3], 'vertical')
        // move: function (jumpStep) {
        //     this.pos[0] += jumpStep;
        // }
};
var playerRoad = [
        {
            pos: [0, -400],
            sprite: new Sprite('images/kafel.png', [0, 0], [500, 400])
        },  
        {
            pos: [0, 0],
            sprite: new Sprite('images/kafel.png', [0, 100], [500, 400])
        },
        {
            pos: [0,  400],
            sprite: new Sprite('images/kafel.png', [0, 0], [500, 400])
        }
];

//girl
var enemie_1 = {
    scored: true,
    pos: [width - 85, 0],
    sprite: new Sprite('images/sprites.png', [0, 0], [83, 80]),
    weight: 1,
    move: function(speed) {
        this.pos[1] += speed;
    }   
};

var enemie_2 = {
    scored: true,
    pos: [0, -200],
    weight: 2,
    sprite: new Sprite('images/skameyka.png', [0, 0], [90, 222]),
    move: function(speed) {
        this.pos[1] += speed;
    }   
};

function init() {

    setTimeout(function(){preloader.style.display ='none'}, 3500);
    terrainPattern = ctx.createPattern(resources.get('images/terrain1.png'), 'repeat');

    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    reset();
    lastTime = Date.now();
    setTimeout(main(), 2000);
}
// The main game loop
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    console.log("now is" + dt);
    console.log("enemies" + enemies);
    render();
    lastTime = now;
    requestAnimFrame(main);
};

resources.load([
    'images/sprites.png',
    'images/terrain1.png',
    'images/mansprite.png',
    'images/kafel.png',
    'images/kafel1.png',
    'images/penguin.png',
    'images/pl.png',
    'images/enemies.jpg',
    'images/skameyka.png'
]);
resources.onReady(init);

// Game state
function update(dt) {
    // console.log('enemies.length'+enemies.length);
    gameTime += dt;
    console.log("dt" + dt);
    timer();
    console.log('gameTime'+gameTime);
    player.sprite.speed = 0;

    handleInput(dt);
    
    updateEntities(dt);

    //adding enemies
    addEnemies();
    addBonus();

    checkCollisions();
   
    scoreEl.innerHTML = score;
    // ciggareteScoreEl.innerHTML = ciggareteScore;
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    checkPlayerBounds();
    
    
    // Run collision detection for all enemies and bullets
    for(var i=0; i<enemies.length; i++) {
        var pos = enemies[i].pos;
        var size = enemies[i].sprite.size;
      

      

        if(boxCollides(pos, size, player.pos, player.sprite.size)) {
            gameOver();
        }

       
    }

    //collision with bonus
    for(var j=0; j<bonuses.length; j++) {
        var posCiggarete = bonuses[j].pos;
        var sizeCiggarete = bonuses[j].size;

        if(boxCollides(posCiggarete, sizeCiggarete, player.pos, player.sprite.size) & bonuses[j].taken == false) {
            ciggareteScore++;
            secondsLeft2+=5;
            bonuses[j].taken = true;
            bonuses.splice(j, 1);
        }
    }
}
// добавляем сиги и бороду
function addBonus () {
    var now = Date.now();
    // console.log("bonus");
    // debugger;
    if (now >= lastTimeBonusAdded + 3000) {

        bonuses.push({
            taken: false,
            pos: [ 40, 0],
            size: [20, 80],
            rotation: 0,
            sprite: new Sprite('images/sprites.png', [175, 0], [20, 80]),
        })
     lastTimeBonusAdded = Date.now();
    }

}

function addEnemies() {
    console.log('enemies.length:'+enemies.length);
        var xPos,
            xPos2,
            xPos3,
            enemySprite,
            now = Date.now(),
            enemyAddTime = 1500,
            mathRandom1 = Math.random(),
            mathRandom2 = Math.random();
            console.log("mathRandom1"+mathRandom1 +'mathRandom2' + mathRandom2)

        //randomnoye dobavleniye vragov

        if(Math.random()>=0 & Math.random()<0.3) {
            xPos2 = 0;
        }
        else if(Math.random()>=0.3 & Math.random()<0.7) {
            xPos2 = width/2 - 30;
        }
        else {
            xPos2 = width - 60; 
        }
        if(Math.random()>=0 & Math.random()<0.3) {
            xPos = 0;
        }
        else if(Math.random()>=0.3 & Math.random()<0.7) {
            xPos = width/2 - 30;
        }
        else {
            xPos = width - 60; 
        }
        if(Math.random() < 1 - Math.pow(.993, gameTime)) {
            if(now>lastTimeEnemyAdded + enemyAddTime) {
                if(mathRandom2<0.4) {
                    enemies.push({
                        scored: true,
                        pos: [xPos, -90],
                        sprite: new Sprite('images/sprites.png', [87, 0], [73, 80]),
                        weight: 1,
                        move: function(speed) {
                            this.pos[1] += speed-2;
                        }   
                    }, enemie_1)
                    lastTimeEnemyAdded = Date.now();
                } else if(mathRandom2<0.5 ) {

                    if(xPos===0) {
                        xPos= + width - 80; 
                    }

                    enemies.push({
                        scored: true,
                        pos: [xPos, -90],
                        sprite: new Sprite('images/sprites.png', [185, 0], [83, 80]),
                        weight: 1,
                        move: function(speed) {
                            this.pos[1] += speed;//dvijetsya
                        }   
                    });

                    enemie_2.pos[1] = -200;//na4alnaya poziciya posle sdviga
                    lastTimeEnemyAdded = Date.now();

                } else {
                    if(xPos===0) {
                        xPos= + width - 80; 
                    }
                    enemies.push({
                        scored: true,
                        pos: [xPos, -90],
                        sprite: new Sprite('images/sprites.png', [185, 0], [83, 80]),
                        weight: 1,
                        move: function(speed) {
                            this.pos[1] += speed;//dvijetsya
                        }   
                    }, enemie_2);
                    // enemie_2.pos[1] = -200;//na4alnaya poziciya posle sdviga
                    lastTimeEnemyAdded = Date.now();
                }
            }; 
        }
}

function checkPlayerBounds() {
   // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

// Draw everything
//Zdes zadayetsya poryadok sloyev
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderEntities(playerRoad);
    renderEntities(enemies);
    renderEntities(bonuses);
    renderEntity(player);
    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);      
    }

    renderEntities(kafel);
    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);  
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    if(entity.rotation!=undefined) {
        ctx.translate(entity.size[0]/2, entity.size[1]/2);
        ctx.rotate(entity.rotation);
        entity.sprite.render(ctx, -entity.size[0]/2, -entity.size[1]/2); 
        ctx.restore();

    }
    else {
        entity.sprite.render(ctx, 0, 0); 
        ctx.restore();
    }
}

// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    player.pos[0] = canvas.width;
    isGameOver = true;
}

// Reset game to original state
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = score;
    secondsPassed = 0;
    secondsLeft2 = 0;
    enemies = [];
    bullets = [];
    kafel = [];
    score = 1001;
    player.pos = [width/2 - player.size[0]/2, height - player.size[1]];
};

function timer () {
  var minutes = 3,
      seconds,
      secondsPassed = Math.floor(gameTime);
      secondsLeft = 100 - secondsPassed + secondsLeft2;
      if (secondsLeft <= 0) {
        secondsLeft =0;
        gameOver();
        
      }
      document.getElementById('timer').innerHTML = secondsLeft;
}

