/** Main Application file app.js and used with the provided files such as engine.js, resources.js, index.html
/** http://jsbeautifier.org/; this assists proper indents
/** http://usejsdoc.org/  - Using the Javascript Documentation for referenced
/**
 * @description Location function provides x and y coordinates based on row and column. The row and column are found in Engine.js when drawing the canvas col * 101 & row * 83
 *              This is called and used in Enemy and Player functions
 * @param x - number of rows that make x location
 * @param y - number of columns that make y location
 * @returns  while this is not returned this.x, this.y, this.col, this.row are outputs that are used when other functions calls the location function
 */
var Location = function (col, row) {
    this.row = row;
    this.col = col;
    this.x = this.col * 101; //The col or column is referenced in Engine.js when drawing the canvas such that col * 101
    this.y = this.row * 83; //The row is referenced in Engine.js when drawing the canvas such that row * 83
    this.row = (this.y / 83);
    this.col = (this.x / 101);
};
/**
 * @description Provides random number based on min and max and taken from this reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param min - Minimum number
 * @param max - Maximum number
 * @returns No
 */
var RandomNo = function (min, max) {
     return Math.random() * (max - min) + min;
 }

/**
 * @description These are the Enemies our player must avoid and function provides its location and image  as well as various methods update, checkCollisions, reset,render
 * @param x - number of rows that make x location used in Location function
 * @param y - number of columns that make y location used in Location function
 * @param speed - Enemy speed
 * @returns Num - outputs a whole number
 */
var Enemy = function (col, row) {
    Location.call(this, col, row); // This makes a call to Location function and places the Enemy on the convas based on canvas row and column
    this.speed = RandomNo.call(this,50,250);  // set random speed
    this.sprite = 'images/enemy-bug.png'; // image for the enemy bug
    this.width = 101;  // Estimate the width of the Enemy bug on the canvas
    this.height = 42;  // Estimate the height of the Enemy bug on the canvas
};
/**
 * @description Method for Update the enemy's position, required method for game
 * @param dt - a time delta between ticks
 */
Enemy.prototype.update = function (dt) {
    // Update the enemy location on x axis and  this random number generator from 1 to 150
    this.x += dt * this.speed; // Calculates the x coordinates based on dt, speed and current x location
    if (this.x >= 505) { // if Enemy x position reachs the end of screen, 4 * 101 or 404 ; however since we want the enemy body to pass the screen, 404 + 100 = 505
        this.reset(); // Reset Enemy x position to beginning of the screen
    }
};
/**
 * @description Method for checking Collisions of the Enemy with player and resets the player to its' beginning position
 * @returns outputs player reset position if collides with the enemy
 */
Enemy.prototype.checkCollisions = function () {
    // Collision detection using this method https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if ( (this.x + this.width/2 >= player.x ) && (this.x  <= player.x + player.width/2 ) &&
          (this.y + this.height/2 >= player.y) && (this.y <= player.y + player.height/2) ){ //Checks if Enemy has collided with the player
        player.reset();    // Resets the player to initial position
        player.score -= 10;  //subtracts 10 from score
        player.life -= 1;    // Remove a life from player
    }

    if ( (this.x + this.width >= star.x ) && (this.x  <= star.x + star.width) &&
          (this.y + this.height >= star.y) && (this.y <= star.y + star.height) ){ //Checks if Enemy has collided with the star
        this.reset();    // Reset enemy position
        star.reset();    // Reset star position
    }
};
/**
 * @description Method for Reseting the Enemy to the beginning of the screen
 * @returns - outputs the x cordinate as 0 - note its from left to right so far left is the beginning of the screen
 */
Enemy.prototype.reset = function () {
    this.x = 0; //reset x position to the beginning or 0. However y axis should remain on same level
    this.speed = RandomNo.call(this,50,250);
};
/**
 * @description  Draw the enemy on the screen, required method for game
 *
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
/**
 * @description Player function that sets reset position and what image to display, there are methods for update, reset. updateY, updateX, render and handleInput
 *
 */
var Player = function () {
    this.reset(); // Provide the initial Position
    this.sprite = 'images/char-cat-girl.png'; //image for your player
    this.width = 90;   // Provide Width Measurements for your player
    this.height = 60;  // Provide Height Measurements for your player
    this.score = 0;    // initial Score
    this.life = 3;     // # lives
};
/**
 * @description Player update method, updates location and checks if players reaches the objective and no. of life determines the game ends or not.
 */
Player.prototype.update = function () {
    this.x = this.col * 101;    // set x position
    this.y = this.row * 83;     // set y position

    if  (this.row === 0) { //Checks if the player wins i.e reachs the water by checking the row count is 0
        this.score += 10;    //  + 10 to your Score
        star.reset();       // Reset star position
        this.reset();       // Reset position to beginning
    }

    if (this.life == 0) {    // Check if life score is 0
        gameOver = 'true';   // Set gameOver to true
    }

    $('#score').html(this.score);     // Update ID Score uses Jquery Script
    $('#life').html(this.life);      // Update Life
};

/**
 * @description Player reset method, updates location to its initial position
 */
Player.prototype.reset = function () {
    Location.call(this, 2, 5);     // Set position at col, row position
};
/**
 * @description Player method for Horizontal Movement - left or right
 */
Player.prototype.Xpos = function (x) {
    this.col += x;
};
/**
 * @description Player method for Vertical Movement - up or down
 */
Player.prototype.Ypos = function (y) {
    this.row += y;
};
/**
 * @description  Draw the Player on the screen, required method for game
 *
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};
/**
 * @description  Player method for handleInput for movement
 *
 */
Player.prototype.handleInput = function (keyCode) {
    // Just to echo the player movement on the console
    console.log("Player moves " + keyCode + " at location " + this.x + "," + this.y);

    switch (keyCode) {
    case 'left':
        if (this.col > 0) //Check if the end of left screen boundary
        {
            this.Xpos(-1); // Move Left
        }
        break;

    case 'right':
        if (this.col < 4) //Check if the end of right screen boundary
        {
            this.Xpos(1); // Move Right
        }
        break;

    case 'up':
        if (this.row > 0) // Check if at the top screen boundary
        {
            this.Ypos(-1); //Move up
        }
        break;

    case 'down':
        if (this.row < 5) // Check if at the bottom screen bondary
        {
            this.Ypos(1); //Move Down
        }
        break;

    default:
        // default Do nothing - i.e don't move
    }
};
/**
 * @description Star function with methods for update, reset. checkCollisions and render.
 *
 */
var Star = function () {
     Location.call(this, 2, 0);   // Call Location function to set its initial position
     this.sprite = 'images/Star.png';
     this.width = 101;
     this.height = 83;
};
/**
* @description Star update method for position x, y
*
*/
Star.prototype.update = function() {
   this.x = this.col * 101;
   this.y = this.row * 83;
};
/**
* @description Star reset method for reseting position x, y
*
*/
Star.prototype.reset = function () {
    var x = RandomNo.call(this,0,4);  // Call a Random No for x
    var y = RandomNo.call(this,1,4);  // Call a Random No for y
    Location.call(this, x, y);  //Appear randomly on the canvas
};
/**
* @description Star checkCollisions method for checking collisions with player
*
*/
Star.prototype.checkCollisions = function () { //check if star collides with player
    if ( (this.x + this.width >= player.x ) && (this.x <= player.x + player.width ) &&
         (this.y + this.height >= player.y) && (this.y <= player.y + player.height) ){
        this.reset();      // Reset star position
        player.score += 5; //Add score +5
        player.reset();    // Reset player
       }
};
/**
* @description Star render method
*
*/
Star.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

var allEnemies = [new Enemy(4, 1),
                  new Enemy(2, 2),
                  new Enemy(0, 3)];

// Place the player object in a variable called player
var player = new Player();

// Place Bonus star
var star = new Star();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
