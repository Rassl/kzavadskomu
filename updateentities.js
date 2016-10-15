function updateEntities(dt) {
    // Update the player sprite animation
    console.log("playerRoad");
    // playerRoadSpeed = gameAccelerationTime*gameTime;
    // playerRoadSpeed = 3;
    // playerRoadSpeed  = gameTime/5;

    playerRoadSpeed = Math.min(Math.max(3, gameTime/5), 7);
    console.log('playerRoadSpeed'+playerRoadSpeed);
  
    if (!isGameOver) {
      

        increaseSpeed(true, playerRoadSpeed);

          //Enemies
          for (var j = 0; j<enemies.length; j++) {
             enemies[j].move(playerRoadSpeed);
             if(player.pos[1]<enemies[j].pos[1] & enemies[j].scored === true) {
                score -= enemies[j].weight;
                enemies[j].scored = false;
              }

              if (enemies[j].pos[1]>height) {
                enemies.splice(j, 1);
                j--;
              }
          } 

          //Bonuses
          for (var b = 0; b<bonuses.length; b++) {
            bonuses[b].pos[1]+=5;
            bonuses[b].rotation+=0.1;
            if (bonuses[b].pos[1]>height) {
              bonuses.splice(b, 1);
              b--;
            }       
          } 


        player.sprite.update(dt);
      }

    // Update all the explosions
    for(var i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

//increase==true or increase==false to reduce
function increaseSpeed(increase, step) {
    if (increase) {
        player.sprite.speed = playerRoadSpeed + step;
        for (var i=0; i<playerRoad.length; i++) {
            playerRoad[i].pos[1] += playerRoadSpeed + step;
            if (playerRoad[i].pos[1] >= 400) {
                playerRoad[i].pos[1] = -200;
            }
        }
    } else {
        console.log('down');
        player.sprite.speed = playerRoadSpeed - step;
        console.log(playerRoadSpeed + "asdf" + player.sprite.speed);
         for (var i=0; i<playerRoad.length; i++) {
            playerRoad[i].pos[1] -= playerRoadSpeed + step;
            // playerRoad[i].sprite.update(dt);
            if (playerRoad[i].pos[1] >= 400) {
                playerRoad[i].pos[1] = -200;
            }
        }
    }
};