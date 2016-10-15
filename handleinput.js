function handleInput(dt) {
  // var playerRoadSpeed = 5;
    if(input.isDown('DOWN') || input.isDown('s')) {
       increaseSpeed(false, 0.5);
    }

    if(input.isDown('UP') || input.isDown('w')) {
          increaseSpeed(true, 0.5);      
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        // player.pos[0] -= playerSpeed * 2 * dt;
        player.pos[0] -= 10;
        
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        // player.pos[0] += playerSpeed * 2 * dt;
        player.pos[0] += 10;
       
    }

    document.addEventListener('click', function () {
      player.pos[0] += 10;
    });

    document.addEventListener('dblclick', function () {
      // alert("yy");
      player.pos[0] -= 10;   
    });

    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastFire > 100) {
        var x = player.pos[0] + player.sprite.size[0] / 2;
        var y = player.pos[1] + player.sprite.size[1] / 2;

        bullets.push({ pos: [x, y],
                       dir: 'forward',
                       sprite: new Sprite('./sprites.png', [0, 39], [18, 8]) });
        bullets.push({ pos: [x, y],
                       dir: 'up',
                       sprite: new Sprite('./sprites.png', [0, 50], [9, 5]) });
        bullets.push({ pos: [x, y],
                       dir: 'down',
                       sprite: new Sprite('./sprites.png', [0, 60], [9, 5]) });
        lastFire = Date.now();
    }
}