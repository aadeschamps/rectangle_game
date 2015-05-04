/*


    Currently working on:
    Bug fix: can clip through second rectangle

    soon: adding another level

    adding a boost button (working-needs balance)


*/
var canvas = document.getElementById('the_canvas');
var ctx = canvas.getContext('2d');
// Settings:
var speed = 2;
var level = 1;
var start_x = 300;
var start_y = 25;
var losses = 0;
var fps = 20;
var finish_line;
var max_level = 4;
var boost_bonus = 2;

//test

var boost = 100;

// movement of player box by pushing down keys
var handleKeyDown = function(evt) {
    if (evt.keyCode === 39) {
        // Right arrow was pressed
        player.right = true;
    } else if (evt.keyCode === 37) {
        //Left arrow was pressed
        player.left = true;
    } else if (evt.keyCode === 40) {
        // down key pressed
        player.down = true;
    } else if (evt.keyCode === 38) {
        // up key pressed
        player.up = true;
    }else if (evt.keyCode === 16){
        player.boostOn = true;
    }else if (evt.keyCode === 16){
        player.boostOn = true;
    }
    //Developer Tools
    else if (evt.keyCode === 97){
        speed+=.2;
        console.log(speed);
        console.log(player.speed);
    }else if (evt.keyCode === 98){
        speed-=.2;
        console.log(speed);
        console.log(player.speed);
    }else if (evt.keyCode === 101){
        level+=1;
        master_const();
    }else if (evt.keyCode === 100){
        level-=1;
        master_const();
    }

}
// shuts off movement when releasing keys
var handleKeyUp = function(evt) {
    if (evt.keyCode === 39) {
        // Right arrow was unpressed
        player.right = false;
    } else if (evt.keyCode === 37) {
        //Left arrow was un-pressed
        player.left = false;
    } else if (evt.keyCode === 40) {
        // down key unpressed
        player.down = false;
    } else if (evt.keyCode === 38) {
        // up key unpressed
        player.up = false;
    }else if (evt.keyCode === 16){
        player.boostOn = false;
    }
}


window.addEventListener('keydown', handleKeyDown, true);
window.addEventListener('keyup', handleKeyUp, true);

// Square constructor that will be used with for all objects
var Square = function(x_value, y_value, height, width, ispeed, direction, direction2) {
    this.x = x_value;
    this.y = y_value;
    this.height = height;
    this.width = width;
    this.speed = ispeed;

    //obstacle controllers
    this.positive = direction;
    this.direction = direction2;

    //player controllers
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.boost = boost;
    this.boostOn = false;
}

// Draws square on canvas
Square.prototype.draw = function() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
}
// returns true if whatever square object that is put into
// the function collides with this square
Square.prototype.collision = function(player) {
    if (((player.x >= this.x) && (player.x <= this.x + this.width) && (player.y >= this.y) && (player.y <= this.y + this.height)) //top left corner
        || ((player.x + player.width >= this.x) && (player.x + player.width <= this.x + this.width) && (player.y >= this.y) && (player.y <= this.y + this.height)) // top right corner
        || ((player.x + player.width >= this.x) && (player.x + player.width <= this.x + this.width) && (player.y + player.height >= this.y) && (player.y + player.height <= this.y + this.height)) || // bottom right corner
        ((player.x >= this.x) && (player.x <= this.x + this.height) && // bottom left corner
            (player.y + player.height >= this.y) && (player.y + player.height <= this.y + this.height))) {
        return true;
    } else {
        return false;
    }
}
// changes the location of box depending on intial settings of box when made. Direction controls vertical vs horiontal and positive controls direction within above.
Square.prototype.change = function() {
    if (this.direction) {
        if (this.positive) {
            this.x += this.speed;
            if (this.x >= canvas.width) {
                this.x = 0;
            }
        } else {
            this.x -= this.speed;
            if (this.x <= -20) {
                this.x = canvas.width;
            }
        }
    } else {
        if (this.positive) {
            this.y += this.speed;
            if (this.y >= canvas.height) {
                this.y = 0;
            }
        } else {
            this.y -= speed;
            if (this.y <= -20) {
                this.y = canvas.height;
            }
        }
    }
}
    // updates player position based on changes made by
    // keyboard presses
Square.prototype.changePlayer = function() {
    this.speed = speed;
    if (this.boostOn){
        if(this.boost > 0){
            this.speed = speed + boost_bonus;
            this.boost--;
        }
    }else{
        this.speed = speed;
    }
    if (this.up) {
        this.y -= this.speed;
        if(this.y <= 0){
            this.y = 0;
        }
    } else if (this.down) {
        this.y += this.speed;
        if(this.y >= (canvas.height - 20) ){
            this.y = canvas.height - 20;
        }
    }
    if (this.left) {
        this.x -= this.speed;
        if (this.x <= 0){
            this.x = 0;
        }
    } else if (this.right) {
        this.x += this.speed;
        if (this.x >= canvas.width - 20){
            this.x = canvas.width - 20;
        }
    }
}
    // resets position to starting, only used for player square
Square.prototype.reset = function() {
    this.x = start_x;
    this.y = start_y;
    this.boost = boost;
}
var all_obj = [];
// constructs each square needed for level one:
var level_1_const = function() {
    all_obj = [];
    //create array for the height of each line
    var height = [100, 200, 300, 70, 135, 230];
    // create array for the x value of each block in each line
    // for level 1, level 2, and level 3
    //line 1
    var line_a = [0, 100, 200, 300];
    for (var i = 0; i < line_a.length; i++) {
        var square = new Square(line_a[i], height[0], 20, 20, 1, true, true);
        all_obj.push(square)
    };
    // line 2
    var line_b = [50, 150, 250, 350];
    for (var i = 0; i < line_b.length; i++) {
        var square = new Square(line_b[i], height[1], 20, 20, 1, false, true);
        all_obj.push(square)
    };
    // line 3
    var line_c = [50, 100, 200, 250, 350];
    for (var i = 0; i < line_c.length; i++) {
        var square = new Square(line_c[i], height[2], 20, 20, 1, true, true);
        all_obj.push(square);
    };
    // sets finish line square
    finish_line = new Square(0, 380, 20, 400, 0, true, true);
}
var level_2_const = function() {
    all_obj = []
    level_1_const();
    // makes static barriers
    var bar1 = new Square(160, 70, 20, 240, 0, true, true);
    all_obj.push(bar1);
    var bar2 = new Square(0, 135, 20, 240, 0, true, true);
    all_obj.push(bar2);
    var bar3 = new Square(160, 230, 20, 240, 0, true, true);
    all_obj.push(bar3);
}
var level_3_const = function() {
    all_obj = [];
    //create array for the height of each line
    var height = [100, 200, 300, 70, 135, 230];
    // create array for the x value of each block in each line
    // for level 1, level 2, and level 3
    //line 1
    var line_speed_a = 1;
    var line_a = [0, 100, 200, 300];
    for (var i = 0; i < line_a.length; i++) {
        var square = new Square(line_a[i], height[0], 20, 20, line_speed_a, true, true);
        all_obj.push(square)
    };
    // line 2
    var line_speed_b = 3;
    var line_b = [50, 150, 250, 350];
    for (var i = 0; i < line_b.length; i++) {
        var square = new Square(line_b[i], height[1], 20, 20, line_speed_b, false, true);
        all_obj.push(square)
    };
    // line 3
    var line_speed_c = 2;
    var line_c = [50, 100, 200, 250, 350];
    for (var i = 0; i < line_c.length; i++) {
        var square = new Square(line_c[i], height[2], 20, 20, line_speed_c, true, true);
        all_obj.push(square);
    };
    var bar1 = new Square(160, 70, 20, 240, 0, true, true);
    all_obj.push(bar1);
    var bar2 = new Square(0, 135, 20, 240, 0, true, true);
    all_obj.push(bar2);
    var bar3 = new Square(160, 230, 20, 240, 0, true, true);
    all_obj.push(bar3);
    finish_line = new Square(0, 380, 20, 400, 0, true, true);
}
var level_4_const = function() {
    // creates vertical line squares
    level_3_const();
    var vert_line = [0, 100, 200, 300];
    var line_speed_vert = 1.5;
    for (var i = 0; i < vert_line.length; i++) {
        var square = new Square(200, vert_line[i], 20, 20, line_speed_vert, true, false);
        all_obj.push(square);
    };
    finish_line = new Square(240, 380, 20, 200);
}

var level_5_const = function() {
    // level 3 with modifications to 
    all_obj = [];
    level_3_const();
    // changes the middle line to reverse direction and 
    // reduce speed to 2
    all_obj.forEach(function(elem){
        if (elem.speed === 3){
            elem.speed = 2;
            elem.positive = true;
        } else if (elem.speed ===2){
            elem.speed = 3;
        }
    });

    // adds another line above middle line
    var line_speed = 2;
    var line_b = [50, 150, 250, 350];
    for (var i = 0; i < line_b.length; i++) {
        var square = new Square(line_b[i], 180, 20, 20, line_speed, false, true);
        all_obj.push(square)
    };

    // adds bar on same line as lower bar
    var bar3 = new Square(0, 230, 20, 120, 0, true, true);
    all_obj.push(bar3);
}

var level_6_const = function(){
    level_5_const();
    var vert_line = [0, 100, 200, 300];
    var line_speed_vert = 1.5;
    for (var i = 0; i < vert_line.length; i++) {
        var square = new Square(200, vert_line[i], 20, 20, line_speed_vert, true, false);
        all_obj.push(square);
    };
    finish_line = new Square(240, 380, 20, 200);
}

var level_7_const = function(){
    level_6_const();
    var bar2 = new Square(0, 155, 20, 240, 0, true, true);
    all_obj.push(bar2);
}

// called every "fps" milliseconds, updates location of boxes
// and tests for collision: losses and win collisions
var level_func = function() {
    for (var i = 0; i < all_obj.length; i++) {
        if (all_obj[i].collision(player)) {
            player.reset();
            losses++;
        }
    }
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    finish_line.draw();
    ctx.fillStyle = "red"
    player.changePlayer();
    player.draw();
    ctx.fillStyle = "blue";
    for (var i = 0; i < all_obj.length; i++) {
        all_obj[i].draw();
        all_obj[i].change();
    };
    // draws which level and how many losses
    ctx.font = '10pt Calibri';
    var message = "Level: " + level;
    ctx.fillText(message, 5, 15);
    ctx.font = '10pt Calibri';
    var message = "Losses: " + losses;
    ctx.fillText(message, 320, 15);
    var message = "Boost: " + player.boost;
    ctx.fillText(message, 170, 15);
    // checks if player collides with finish line and updates
    // level and calls the next level constructor
    if (finish_line.collision(player)) {
        player.reset();
        level++;
        master_const();
    }
}
// called when level gets higher than the amount of levels
// made
var win_statement = function() {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.font = '25pt Calibri';
    ctx.fillText("More levels to come!", 25, 200);
}
// calls level constructors based on level counter
// always called when a player "wins", clears timer
// and calls win_statement when no more levels left
var master_const = function() {
    if (level === 1) {
        level_1_const();
    } else if (level === 2) {
        level_2_const();
    } else if (level === 3) {
        level_3_const();
    } else if (level === 4) {
        level_4_const();
    } else if (level === 5){
        level_5_const();
    } else if (level === 6){
        level_6_const();
    } else if (level === 7){
        level_7_const();
    }else {
        clearInterval(timer);
        win_statement();
    }
}
// creates player
var player = new Square(start_x, start_y, 20, 20, speed, true, true);
// if statement and max_level are for debugging purposes
master_const();
if (level <= max_level) {
    var timer = setInterval(level_func, fps);
}