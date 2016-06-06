angular.module('petGame.trackingService', [])
.factory('Tracking', function($interval, Game) {
	
	var o = {
		sports: {
			bicycling: {
				url: 'assets/img/gym/bike_side.png',
				notification: "Don't forget the helmet!",
				tracking: ['km', 'time'],
				name: "Bicycling"
			},
			football: {
				url: 'assets/img/gym/football.png',
				notification: "",
				tracking: ['time'],
				name: "Football"
			},
			running: {
				url: 'assets/img/gym/running_shoes.png',
				notification: "",
				tracking: ['km', 'time'],
				name: "Running"
			},
			lifting: {
				url: 'assets/img/gym/weight.png', 
				notification: "Don't take too much weight!",
				tracking: ['repetitions'],
				name: "Lifting"
			},
			yoga: {
				url: 'assets/img/gym/yogamat.png',
				notification: "",
				tracking: ['time'],
				name: "Yoga"
			}
		},
		currentTracking: {
			km: 0,
			time: 0,
			repetitions: 0,
			text: ""
		} 
	};

	var watchID, watchCallback = null;
	var distance = 0;
	var coords = [];
	var sportArray = getArrayOfSports();

	// Starts the tracking of a specific activity
    o.startTracking = function(sport, callback) {
		if (navigator.geolocation) {
			console.log("Geolocation is supported!");
			
			// Watches the position updates
			watchCallback = callback;

			// Watches for updates
			watchID = navigator.geolocation.watchPosition(function(position) {
				appendPosition(position);
			}, function(error) {
				alert("Error occured. Error code: " + error.code);
			});
		} else {
			console.log("Geolocation is not supported for this Browser/OS version yet.");
		}
    };

    // Pauses the tracking of a specific activity
    o.pauseTracking = function(sport) {
        if (navigator.geolocation) {
        	navigator.geolocation.clearWatch(watchID);
        }
    };

    // Stops the tracking of a specific activity
    o.stopTracking = function(sport) {
        if (navigator.geolocation) {
        	navigator.geolocation.clearWatch(watchID);
        	o.currentTracking.km = Math.round((distance * 100) / 100).toFixed(2);
        	distance = 0;
        	coords = [];
        }
    };

    // Returns notification string for receiving goods after tracking
    o.receiveNotificationMsg = function() {
        var pet = null;
        if (Game.game.petType != null) {
            pet = Game.game.petType;
        }
    	var string = "You've received ";

        if (pet != null) {
            string += "5 " + pet.good1 + " and 4 " + pet.good2 + " ";
        } else {
            string += "nothing ";
        }       

    	string += "in ";
        if (o.currentTracking.km != 0) {
			string += o.currentTracking.km + " km and";
		}

        if (o.currentTracking.time != 0) {
			string += o.currentTracking.time;
		}

        if (o.currentTracking.repetitions != 0) {
			string += o.currentTracking.repetitions + " repetitions";
        }
    	return string + ".";
    };

    // Returns the current display of the sport bar
    o.getCurrentSlidePicDisplay = function(beg, end) {
    	var array = [];
    	for (i = beg; i < end + 1; i++) {
    		if (sportArray[i] == null) {
    			if (i > 0) {
    				break;
    			}
    		} else {
	        	array.push(sportArray[i]);
	        }
	    }

    	if (beg == -1) {
    		array.splice(0, 0, sportArray[4]);
    	} else if (beg == -2) {
			array.splice(0, 0, sportArray[4]);
			array.splice(0, 0, sportArray[3]);
    	} else if (end == 5) {
    		array.push(sportArray[0]);
    	} else if (end == 6) {
    		array.push(sportArray[0]);
    		array.push(sportArray[1]);
    	}
	    
        return array;
    };

    // Returns the score text for the tracking mode
    o.getScoreText = function() {
    	return o.currentTracking.km + "km in " + o.currentTracking.time;
    };

    // Returns true, if it shall clock
    o.isTimer = function(sport) {
        if (o.sports[sport].tracking.indexOf('time') != -1) {
            return true;
        }
        return false;
    }

    // Returns true, if it shall count the repetitions
    o.isRepetition = function(sport) {
        if (o.sports[sport].tracking.indexOf('repetitions') != -1) {
            return true;
        }
        return false;
    }

    // Returns true, if it shall track the distance
    o.isKm = function(sport) {
        if (o.sports[sport].tracking.indexOf('km') != -1) {
            return true;
        }
        return false;
    }



    /*
     * HELP FUNCTIONS
     */

    function calculateDistance(fromPos, toPos) {
    	//console.log(lat1 + ":" + lon1 + ":" + lat2 + ":" + lon2);
    	var R = 6371; // earth radius in km
		var latDistance = (toPos.latitude - fromPos.latitude).toRadians();
		var lonDistance = (toPos.longitude - fromPos.longitude).toRadians(); 
		var a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
		    	Math.cos(fromPos.latitude.toRadians()) * Math.cos(toPos.latitude.toRadians()) * 
		    	Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
		var distance = R * c;
		console.log(distance + ":" + fromPos.latitude + "," + fromPos.longitude + ":" + toPos.latitude + "," + toPos.longitude);
		return distance;
    };

    Number.prototype.toRadians = function() {
    	return this * Math.PI / 180;
    };

    function appendPosition(position) {
    	// Calculates the distance from the last position, if it is available
    	var lastPos = coords[coords.length - 1];
    	if (lastPos) {
    		distance += calculateDistance(lastPos, position.coords);
    	}
    	
    	// Adds new coordinates to the array
    	coords.push(position.coords);
    	
    	// Calls custom callback
    	if (watchCallback) {
    		watchCallback(position, distance, watchID);
    	}

        o.currentTracking.km = Math.round((distance * 100) / 100).toFixed(2);
    };

    function getArrayOfSports() {
    	var array = [];
        for (sport in o.sports) {
            array.push(o.sports[sport]);
        }
        return array;
    };

  	return o;
});