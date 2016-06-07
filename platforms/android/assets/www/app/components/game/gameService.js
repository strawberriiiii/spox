angular.module('petGame.gameService', ['petGame.storeService'])
.factory('Game', function($interval, $location, Store, Backpack, Gym, Friends) {
	
	// Object game 
	var o = {
		game: {
			health: 30,
			petName: "",
			petGender: "n",
			petType: null,
			petSpritesheetLink: "",
			level: 1,
			gameOver: true
		},
		pets: {
			bird: {
				name: "Bird",
				good1: "berries",
				good2: "wood",
				pic: "assets/img/pet/bird.png"
			},
			penguin: {
				name: "Penguin",
				good1: "ice",
				good2: "steel",
				pic: "assets/img/pet/penguin.png"	
			},
			tiger: {
				name: "Tiger",
				good1: "meat",
				good2: "stone",
				pic: "assets/img/pet/tiger.png"
			},
			turtle: {
				name: "Turtle",
				good1: "water",
				good2: "glass",
				pic: "assets/img/pet/turtle.png"
			}
		}
	};

	var gameInv = null;	
		
	// Creates a new game
	o.newGame = function(petName, petGender, petType) {
		o.game.petName = petName;
		o.game.petGender = petGender;
		o.game.petType = petType;
		setSpritesheetLink(petType);
		resetLevel();
		resetHealth();
		o.game.gameOver = false;
		o.startInt();
		startProv();
	};
	
	// Updates both scores, when an object is taken
	o.updateScores = function(thing) {
		for (x in Store) {
			if (x == thing) {
				o.game.health += Store[x].health;
			}
		}
		
	};
	
	// Reduces the health of the pet after setted time
	o.reduceHealth = function() {
		o.game.health -= 10;
		
		if (o.game.health < 60 && o.game.health > 30) {
			$('.spriteSheet').animateSprite('play', 'normal');
		}

		if (o.game.health <= 30 && o.game.health > 0) {
			$('.spriteSheet').animateSprite('play', 'sad');
		}

		if (o.game.health == 0) {
			$('.spriteSheet').animateSprite('play', 'dead');
			setTimeout(function() {
				o.game.gameOver = true;
				o.game.petName = "";
				o.game.petGender = "n";
				o.game.level = 1;
				o.game.health = 30;
				o.game.petType = null;
				o.game.petSpritesheetLink = "";
				Gym.resetGym();
				Backpack.resetBackpack();
				Friends.friend = null;
          		Friends.connectedWithFacebook = false;
          		Store.resetStore();
				$location.path('#/');
			}, 10);
		} 

		var c = document.getElementById('healthGraph');
		if (c != null) {
			var canvas = c.getContext("2d");
			var yPos = 135 - o.game.health * 1.1;
		  	var yLength = (15 + o.game.health) * 2.2;
			canvas.clearRect(0, 0, 400, 500);
			o.drawHealth();
		}

		console.log("Health: " + o.game.health);
	};

	// Increases the health of the pet after a completed activity
	o.increaseHealth = function() {
		o.game.health += 100;

		if (o.game.health > 100) {
			o.game.health = 100;
		}
	};

	// Level up
	o.levelUp = function() {
		o.game.level += 1;
	};

	// Retrieves the next animal
	o.nextAnimal = function(currentPet) {
		var i = 0;
        for (animal in o.pets) {
            if (animal == currentPet.name.toLowerCase()) {
                break;
            }
            i++;
        }

        // If it is the last pet, it shall return the first one
        if (i == 3) {
        	return o.pets.bird;
        }

        // Go to the next pet after the current one
        var x = 0;
        for (animal in o.pets) {
            if (x > i) {
            	return o.pets[animal]; 

            }
            x++;
        }
	};

	// Retrieves the previous animal
	o.previousAnimal = function(currentPet) {
		// Get position of item in backpack
        var i = 0;
        var z = 0;
        var array = [];
        for (animal in o.pets) {
            if (animal == currentPet.name.toLowerCase()) {
                z = i;
            }
            i++;
            array.push(o.pets[animal]);
        }

        // If it is the first pet, it shall return the last one
        if (z == 0) {
            return o.pets.turtle;
        }

        // Go to the previous pet before the current one
        var x = 0;
        array = array.reverse();
        for (x = 0; x < array.length; x++) {
            if (array[x] == currentPet) {
                return array[x+1];
            }
        }
	};

	// Draws the health state bar
	o.drawHealth = function() {
		var c = document.getElementById('healthGraph');
		var canvas = c.getContext("2d");
		canvas.beginPath();

		if (o.game.health < 25) {
	    	canvas.fillStyle = "#ed1111";
	  	} else if (o.game.health >= 25 && o.game.health < 75) {
	        canvas.fillStyle = "#ffee00";
	  	} else {
	       canvas.fillStyle = "#66cc66";
	  	}
	  	
	  	var yPos = 135 - o.game.health * 1.1;
	  	var yLength = (15 + o.game.health) * 2.2;

	  	if (o.game.health > 95) {
	    	canvas.rect(0, 0, 400, yLength);
	  	} else {
	       	canvas.rect(0, yPos, 400, yLength);
	  	}
	  	canvas.fill();
	};


	// Starts the timer
	o.startInt = function() {
        gameInv = $interval(function() {
            o.reduceHealth();
            }, 30000);
    };

    // Stops the timer
    o.stopInt = function() {
    	$interval.cancel(gameInv);
    };

	return o;

	/* 
	 * Support functions
	 */

	function resetHealth() {
		o.game.health = 30;
	}; 
	
	// Resets level
	function resetLevel() {
		o.game.level = 1;
	};
    
    // Starts the timer for checking, if the game is already over to cancel the other timer
    function startProv() {
    	var proveInv = $interval(function() {
	        if (o.game.gameOver == true) {
	            o.stopInt();
	            $interval.cancel(proveInv);
	            console.log("game over");
	        }
    	}, 5000);
    };

    function setSpritesheetLink(petType) {
    	if (petType.name.toLowerCase() == 'bird') {
    		o.game.petSpritesheetLink = 'assets/img/pet/bird_spritesheet.png';
    	} else if (petType.name.toLowerCase() == 'penguin') {
    		o.game.petSpritesheetLink = 'assets/img/pet/penguin_spritesheet.png';
    	} else if (petType.name.toLowerCase() == 'tiger') {
    		o.game.petSpritesheetLink = 'assets/img/pet/tiger_spritesheet.png';
    	} else if (petType.name.toLowerCase() == 'turtle') {
    		o.game.petSpritesheetLink = 'assets/img/pet/turtle_spritesheet.png';
    	}
    };
});