// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    
    //refers to the Text.js file
    this.text = new Text(this.root, `${GAME_WIDTH/2.5}`, `${GAME_HEIGHT/2}`);

    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);
  }
  
  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    
    // document.getElementById('audio-here').play();

    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // console.log(timeDiff);

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
      // console.log(spot);
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      document.getElementById('audio-here').pause();
      document.getElementById('game-over').play();
      document.removeEventListener('keydown', keydownHandler);
      this.player.domElement.src ='images/rick_roll.gif';
      this.player.domElement.style.width = '100px';
      this.player.domElement.style.height = '100px';
      
      // window.alert('Game over boy!! Get yo ass out of the chair!!!! ????????');
      clearInterval(scoreHere);

      this.text.domElement.fontSize = '100px'
      this.text.update('??????Game over??????');
      // console.log(this.text.domElement);

      // this.player.domElement.innerText = "I am Dead";
      // this.player.domElement.style.color = 'white';
      // this.player.domElement.style.textAlign = 'center';
      return;
    }
    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };
  
  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    // console.log(this.player);
    // console.log(this.enemies)

    // i took the values and put it in a variable for my convienience
    let myEnemies = this.enemies;
    let myPlayer = this.player;
    
    // use this to iterate through the array to get the x-coordinate
    let winOrLose = myEnemies.find((item) => {
      if (item.x === myPlayer.x && item.y + ENEMY_HEIGHT >= GAME_HEIGHT - PLAYER_HEIGHT) {
        return true;
      } else {
        return false;
      }
      // console.log(item.x);
    });

    // console.log(winOrLose);
    return winOrLose;
  };

}
