/*
 * Controller for the game page
 */
angular.module('petGame.controllers', ['ionic', 'petGame.gameService', 'petGame.trackingService', 'petGame.storeService', 'petGame.backpackService', 'petGame.friendsService', 'petGame.gymService'])
.controller('GameCtrl', function($scope, $location, $state, $stateParams, $interval, Game, Store, Backpack, Gym, Tracking, Friends) {
	
    /* 
     * VARIABLES
     */

    //First Use
    $scope.petNameLabel = "The Pet's Name";
    $scope.petGenderLabel = "The Pet's Gender";
	$scope.createPetButton = "Create Pet";
    $scope.startActivity = "Start Activity";
    $scope.pets = Game.pets;
    $scope.currentPet = $scope.pets.bird;

    //Mainscreen
    $scope.game = Game.game;
    $scope.happy = false;
    $scope.notMsg = "";

    //Tracking
    $scope.startTrackingButton = "START";
    $scope.pauseTrackingButton = "PAUSE";
    $scope.stopTrackingButton = "STOP";
    $scope.sports = Tracking.sports;
    $scope.currentTracking = Tracking.currentTracking;
    $scope.activityStarted = false;
    $scope.trackingFinished = false;
    $scope.showSlider = true;
    $scope.beg = 0;
    $scope.end = 2;
    $scope.sliderPics = getCurrentSlidePicDisplay();
    $scope.currentSelectedSport = $scope.sliderPics[1];
    $scope.msgText = null;
    $scope.timer = null;
    $scope.repTimer = null;
    $scope.message = "";
    var count = 0;
    $scope.repCount = 0;
    $scope.tracking = false;

    //Gym
    $scope.gymLabel = "'s Gym";
    $scope.gym = Gym.gym;
    $scope.buyRoomLabel = "Buy Room";
    $scope.unlockRoomLabel = "Unlock Room in Level ";
    $scope.requiredGoodsForRoomLabel = "Room costs:";
    $scope.constructionLabel = "Room Under Construction";
    $scope.timeLabel = "Done in ";

    //Store
    $scope.storeLabel = "Store";
    $scope.buy = "Buy";
    $scope.unlockLabel = "Unlock Level ";
    $scope.store = Store.store;
    $scope.itemCurrentlyBought = Store.hasCurrentlyBought;
    $scope.boughtItem = Store.boughtItem;
    $scope.isLocked = Store.isLocked;
    
    //Backpack
    $scope.backpackLabel = "Backpack";
    $scope.trade = "Trade";
    $scope.tradeDialogButton = "Trade Item";
    $scope.backpack = Backpack.backpack;
    $scope.tradeDialog = false;
    $scope.tradeItem = null;
    $scope.tradeItemAmount = 2;
    $scope.otherItem = null;
    $scope.otherItemAmount = $scope.tradeItemAmount / 2;
    $scope.backPathBackpack = Backpack.backPath;

    //Friends
    $scope.friendsLabel = "Friends";
    $scope.myFriendsLabel = "My Friends";
    $scope.teamUp = "Team Up";
    $scope.detach = "Detach";
    $scope.inviteFriends = "Invite Friends";
    $scope.connectWithFacebookLabel = "Connect with Facebook";
    $scope.disconnectWithFacebookLabel = "Disconnect with Facebook";
    $scope.allUsersLabel = "All Users";
    $scope.connectedFriends = Friends.connectedFriends;
    $scope.allUsers = Friends.allUsers;
    $scope.connectedFriend = Friends.friend;
    $scope.connectedWithFacebook = Friends.connectedWithFacebook;


    $('.spriteSheet').animateSprite({
    	columns: 3,
        fps: 6,
        loop: true,
        animations: {
            happy: [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 
                    3, 6, 3, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 3, 6, 3, 0],
            sad: [3, 6, 3]
        }
    });

    /*
     * METHODS
     */

    // Creates a new game 
    $scope.newGame = function (petName, petGender) {
        Game.newGame(petName, petGender, $scope.currentPet);
        console.log("Name: " + $scope.game.petName + ", Sex: " + $scope.game.petGender + ", Type: " + $scope.game.petType.name);
        $('#pet').animateSprite('play', 'normal');
    };

    // Changes page 
    $scope.go = function(path) {
        if (path == '#/gym/') {
            $state.go('gym', {boughtItem: $scope.boughtItem.name}, {reload: true});
        } else if (path == 'home') {
            $scope.trackingFinished = true;
            $location.path('#/');
        }
    };

    // Chances back path for the backpack mode
    $scope.changePath = function(path) {
        Backpack.backPath = path;
    }

    // Unlockes the store
    $scope.unlockStore = function() {
        $scope.isLocked = Store.unlockStore();
    };

    // Retrieves the next animal
    $scope.nextAnimal = function(currentPet) {
        $scope.currentPet = Game.nextAnimal(currentPet);

    };

    // Retrieves the previous animal
    $scope.previousAnimal = function(currentPet) {
        $scope.currentPet = Game.previousAnimal(currentPet);
    };

    // Returns true if the amount of a good is 0
    $scope.tradeButtonIsDisabled = function(item) {
        return Backpack.tradeButtonIsDisabled(item);
    };

    // Returns the pic link for the checkmark or x, if there are enough goods to buy the item
    $scope.isEnoughGood = function(good, amount) {
        return Backpack.isEnoughGood(good, amount);
    };

    // Return true, if there is enough good for the item to buy
    $scope.buyButtonIsDisabled = function(neededGoods) {
        return Backpack.buyButtonIsDisabled(neededGoods);
    };

    // Buys a room
    $scope.buyRoom = function(room) {
        Gym.buyRoom(room);
        Gym.increaseUserSatisfaction(20);
    };

    // Returns true, if there are not enough goods to buy a room
    $scope.isBuyRoomDisabled = function(room) {
        return Gym.isBuyRoomDisabled(room);
    };

    // Returns the timer for the construction room
    $scope.getTimer = function(room) {
        return Gym.getTimer(room);
    }

    // Opens the trade window
    $scope.openTrade = function(item) {
        $scope.tradeDialog = true;
        $scope.tradeItem = item;

        for (otherItem in Backpack.backpack) {
            if (Backpack.backpack[otherItem]!= $scope.tradeItem) {
                $scope.otherItem = Backpack.backpack[otherItem];
                break;
            }
        }

        /*if ($scope.tradeItem.amount % 2 === 0) {
            $scope.tradeItemAmount = $scope.tradeItem.amount;
        } else {
            $scope.tradeItemAmount = $scope.tradeItem.amount - 1;
        }*/
        $scope.tradeItemAmount = 2;
        $scope.otherItemAmount = $scope.tradeItemAmount / 2;

        console.log(item);
        console.log($scope.otherItem);
    };

    // Closes the trade window
    $scope.closeTrade = function() {
        $scope.tradeDialog = false;
        $scope.tradeItemAmount = 0;
        $scope.otherItemAmount = $scope.tradeItemAmount / 2;
    };

    // Adds two items 
    $scope.addItem = function(item) {
        $scope.tradeItemAmount += 2;
        $scope.otherItemAmount = $scope.tradeItemAmount / 2;
    };

    // Subtracts two items
    $scope.subItem = function(item) {
        $scope.tradeItemAmount -= 2;
        $scope.otherItemAmount = $scope.tradeItemAmount / 2;
    };

    // Changes the trade item backwards
    $scope.changeItemBackwards = function(item) {
        // Get position of item in backpack
        var i = 0;
        var z = 0;
        var array = [];
        for (good in Backpack.backpack) {
            if (good == item.name.toLowerCase()) {
                z = i;
            }
            i++;
            array.push(Backpack.backpack[good]);
        }

        // If it is the first item, it shall return the last one
        if (z == 0) {
            if ($scope.tradeItem != Backpack.backpack.wood) {
                $scope.otherItem = Backpack.backpack.wood;
            } else {
                $scope.otherItem = Backpack.backpack.water;
            }
            return;
        }

        // Go to the previous item before the current one
        var x = 0;
        array = array.reverse();
        for (x = 0; x < array.length; x++) {
            if (array[x] == item && array[x+1] == $scope.tradeItem) {
                if (array[x+1] == Backpack.backpack.berries) {
                    $scope.otherItem = Backpack.backpack.wood;
                } else {
                    $scope.otherItem = array[x+2];
                }
                break;
            } else if (array[x] == item) {
                $scope.otherItem = array[x+1];
                break;
            }
        }
    };

    //Changes the trade item forwards
    $scope.changeItemForwards = function(item) {
        // Get position of item in backpack
        var i = 0;
        for (good in Backpack.backpack) {
            if (good == item.name.toLowerCase()) {
                break;
            }
            i++;
        }

        // If it is the last item, it shall return the first one
        if (i == 7) {
            if ($scope.tradeItem != Backpack.backpack.berries) {
                $scope.otherItem = Backpack.backpack.berries;
            } else {
                $scope.otherItem = Backpack.backpack.glass;
            }
            return;
        }

        // Go to the next item after the current one
        var x = 0;
        for (good in Backpack.backpack) {
            if (x > i && good != $scope.tradeItem.name.toLowerCase()) {
                $scope.otherItem = Backpack.backpack[good];
                break;
            } else if (x == i && good == Backpack.backpack.water.name.toLowerCase() && $scope.tradeItem == Backpack.backpack.wood) {
                $scope.otherItem = Backpack.backpack.berries;
                break;
            }
            x++;
        }
    };

    // Trades an item in the relation 2:1
    $scope.tradeItems = function (item, otherItem) {
        Backpack.decreaseAmount(item.name.toLowerCase(), $scope.tradeItemAmount);
        Backpack.increaseAmount(otherItem.name.toLowerCase(), $scope.otherItemAmount);
        $scope.tradeDialog = false;
    };

    // Buys the item 
    $scope.buyItem = function(item) {
        //$scope.boughtItem = item;
        Store.buyItem(item);
        for (good in item.neededGoods) {
            Backpack.decreaseAmount(good, item.neededGoods[good]);
        }
        Gym.increaseUserSatisfaction(10);
    };

    $scope.isItemBought = function(item) {
        var obj = Store.isItemBought(item);
        $scope.itemCurrentlyBought = obj[0];
        $scope.boughtItem = obj[1];
    };

    // Places the bought item in the dropzone
    $scope.onDropComplete = function(data, evt) {
       var pos = $scope.getPicPosition(data[1], data[2], data[3]);
        Gym.gym.rooms[data[3]].itemPlaced[pos] = data[0];
        $scope.isItemBought(null);
        console.log(Gym.gym.rooms[data[3]].itemPlaced);
        console.log(pos);
    };

    $scope.hideDropzone = function(i, j, room) {
        if (Gym.gym.rooms[room].itemPlaced[$scope.getPicPosition(i, j, room)] != null) {
            return true;
        }
        return false;
    };

    $scope.getPicPosition = function(i, j, room) {
        var pos = 0;
        if (room == 'room1') { 
            if (i == 0) {
                pos = j;
            } else if (i == 1) {
                pos = 3 + j;
            } else if (i == 2) {
                pos = 6 + j;
            } else {
                pos = 9 + j;
            }
        } else if (room == 'room2') {
            if (i == 0) {
                pos = j;
            } else if (i == 1) {
                pos = 4 + j;
            } else {
                pos = 8 + j;
            } 
        } else if (room == 'room3') {
            if (i == 0) {
                pos = j;
            } else if (i == 1) {
                pos = 5 + j;
            } else if (i == 2) {
                pos = 10 + j;
            } else if (i == 3) {
                pos = 15 + j;
            } else {
                pos = 20 + j;
            }
        } else if (room == 'room4') {
            if (i == 0) {
                pos = j;
            } else if (i == 1) {
                pos = 2 + j;
            } else if (i == 2) {
                pos = 4 + j;
            } else if (i == 3) {
                pos = 6 + j;
            } else {
                pos = 8 + j;
            }
        } else {
            if (i == 0) {
                pos = j;
            } else {
                pos = 7 + j;
            }
        }

        return pos;
    };

    // Returns the link for the picture of the user satisfaction
    $scope.getUserSatisfactionPic = function() {
        return Gym.getUserSatisfactionPic();
    };

    // Draws the graph for the user satisfaction in the gym
    $scope.drawUserSat = function() {
        return Gym.drawUserSat();
    };

    // Returns true, if the item is unlocked
    $scope.isUnlockedItem = function(item) {
        if (Game.game.level >= item.unlockLevel) {
            return true;
        }
        return false;
    };

    // Starts the tracking of a specific activity
    $scope.startTracking = function(sport) {
        $scope.activityStarted = true;
        $scope.showSlider = false;
        $scope.msgText = "You're on a good way!";

        if (Tracking.isTimer(sport)) {      
            //Initialize the Timer to run every 1000 milliseconds i.e. one second.
            $scope.timer = $interval(function () {
                count++;
                $scope.message = toHHMMSS(count);
            }, 1000);
        }

        if (Tracking.isRepetition(sport)) {      
            //Initialize the Timer to run every 1000 milliseconds i.e. one second.
            $scope.repTimer = $interval(function () {
                $scope.repCount++;
            }, 5000);
        }

        if (Tracking.isKm(sport)) {
            $scope.tracking = true;
            Tracking.startTracking(sport);
        }
    };

    // Pauses the tracking of a specific activity
    $scope.pauseTracking = function(sport) {
        $scope.activityStarted = false;
        console.log($scope.currentTracking.time);

        if (Tracking.isTimer(sport)) {
            $interval.cancel($scope.timer);
        }

        if (Tracking.isRepetition(sport)) { 
            $interval.cancel($scope.repTimer);
        }

        if (Tracking.isKm(sport)) {
            Tracking.pauseTracking(sport);
        }
    };

    // Stops the tracking of a specific activity
    $scope.stopTracking = function(sport) {
        $scope.activityStarted = false;
        $scope.showSlider = true;
        $scope.msgText = null;

        if (Tracking.isTimer(sport)) {
            Tracking.currentTracking.time = $scope.message;
            $scope.message = "";
            $scope.count = 0;
            $interval.cancel($scope.timer);
            $scope.timer = null;
        }

        if (Tracking.isRepetition(sport)) { 
            Tracking.currentTracking.repetitions = $scope.repCount;
            $scope.repCount = 0;
            $interval.cancel($scope.repTimer);
            $scope.repTimer = null;
        }

        if (Tracking.isKm(sport)) {
            $scope.tracking = false;
            Tracking.stopTracking(sport);
        }

        if ($scope.game.petType != null) {
            Backpack.increaseAmount($scope.game.petType.good1, 5);
            Backpack.increaseAmount($scope.game.petType.good2, 4);
        }
    };

    function toHHMMSS(sec) {
        var hours = Math.floor(sec / 3600);
        var minutes = Math.floor((sec - (hours * 3600)) / 60);
        var seconds = sec - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return hours + ":" + minutes + ":" + seconds; 
    };

    // Returns notification string for received goods after tracking
    $scope.receiveNotificationMsg = function() {
        return Tracking.receiveNotificationMsg();  
    };

    // Shifts the elements of the sport bar to the right
    $scope.previousSport = function(sport) {
        if ($scope.beg == -2) {
            $scope.beg = 2;
            $scope.end = 4;
        } else {
            $scope.beg--;
            $scope.end--;
        }
        $scope.sliderPics = getCurrentSlidePicDisplay();
        $scope.currentSelectedSport = $scope.sliderPics[1];

        if ($scope.sliderPics[1].notification != "") {
            $scope.msgText = $scope.sliderPics[1].notification;
        } else {
            $scope.msgText = null;
        }
    };

    // Shifts the elements of the sport bar to the left
    $scope.nextSport = function(sport) {      
        if ($scope.end == 6) {
            $scope.beg = 0;
            $scope.end = 2;
        } else {
            $scope.beg++;
            $scope.end++;
        }
        $scope.sliderPics = getCurrentSlidePicDisplay();
        $scope.currentSelectedSport = $scope.sliderPics[1];

        if ($scope.sliderPics[1].notification != "") {
            $scope.msgText = $scope.sliderPics[1].notification;
        } else {
            $scope.msgText = null;
        }
    };

    // Returns the current display of the sport bar
    function getCurrentSlidePicDisplay() {
        return Tracking.getCurrentSlidePicDisplay($scope.beg, $scope.end);
    };

    $scope.closeFeedback = function() {
        $scope.currentTracking.time = 0; 
        $scope.currentTracking.km = 0; 
        $scope.currentTracking.repetitions = 0; 
        $scope.currentTracking.text = '';
    }

    // Teams up with the friend
    $scope.teamUpWithFriend = function(friend) {
        $scope.connectedFriend = Friends.teamUpWithFriend(friend);
        Gym.buyRoom('room5');
        Gym.increaseUserSatisfaction(20);
        $scope.unlockStore();
        console.log($scope.isLocked);
    };

    // Detaches the current friend
    $scope.detachFriend = function() {
        $scope.connectedFriend = Friends.detachFriend();
        Gym.lockFriendRoom();
        Gym.decreaseUserSatisfaction(20);
    };

    // Connects with Facebook
    $scope.connectWithFacebook = function() {
        $scope.connectedWithFacebook = Friends.connectWithFacebook();
    };

    // Disconnects with Facebook
    $scope.disconnectWithFacebook = function() {
        var obj = Friends.disconnectWithFacebook();
        $scope.connectedWithFacebook = obj[0];
        $scope.connectedFriend = obj[1];
    };
 
    $scope.makeHappy = function(thing) {
    	Game.updateScores(thing);
    	$('#pet').animateSprite('play', 'happy');
    	console.log(thing);
    	setTimeout(function() {
			$('#pet').animateSprite('play', 'normal');
		}, 1000);
	};

});