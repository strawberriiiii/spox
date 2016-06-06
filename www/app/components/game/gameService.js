angular.module('petGame.gameService', ['petGame.storeService'])
.factory('Game', function($interval, Store) {
	
	// Object game 
	var o = {
		game: {
			health: 0,
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
		
	// Creates a new game
	o.newGame = function(petName, petGender, petType) {
		o.game.petName = petName;
		o.game.petGender = petGender;
		o.game.petType = petType;
		setSpritesheetLink(petType);
		resetHealth();
		resetLevel();
		o.game.gameOver = false;
		startInt();
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
	
	// Reduces both scores after setted time
	o.reduceScores = function() {
		o.game.health -= 10;
		
		if (o.game.health == 0) {
			$('#pet').animateSprite('play', 'dead');
			setTimeout(function() {
				o.game.gameOver = true;
				o.game.petName = "";
				o.game.petGender = "n";
				o.game.level = 1;
				o.game.petType = null;
				o.game.petSpritesheetLink = "";
			}, 10);
		} 
		console.log("Health: " + o.game.health);
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

	return o;

	/* 
	 * Support functions
	 */

	// Resets health score
	function resetHealth() {
		o.game.health = 100;
	};
	
	// Resets level
	function resetLevel() {
		o.game.level = 1;
	};

	// Starts the timer
	function startInt() {
        /*var gameInv = $interval(function() {
            o.reduceScores();
            }, 10000);*/
    };
    
    // Starts the timer for checking, if the game is already over to cancel the other timer
    function startProv() {
    	var proveInv = $interval(function() {
	        if (o.game.gameOver == true) {
	            $interval.cancel(gameInv);
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