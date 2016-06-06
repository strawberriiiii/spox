angular.module('petGame.storeService', [])
.factory('Store', function($interval) {
	/*
      * Object store
      */
     var o = {
          store: {
          	exercise_bike: {
          		name: 'Exercise bike',
                    pic: 'assets/img/gym/gymcycle.png',
          		neededGoods: {
                         glass: 7,
                         steel: 15,
                         stone: 10
                    },
                    unlockLevel: 1,
                    amount: 0
          	}, 
          	ball_court: {
          		name: 'Ball court',
                    pic: 'assets/img/gym/football.png',
                    neededGoods: {
                         steel: 9,
                         stone: 5,
                         wood: 15
                    },
                    unlockLevel: 1,
                    amount: 0
          	},
          	dance_class: {
          		name: 'Dance class',
                    pic: 'assets/img/gym/radio.png',
                    neededGoods: {
                         glass: 32,
                         steel: 15,
                         stone: 20
                    }, 
                    unlockLevel: 1,
                    amount: 0
          	},
          	weights: {
          		name: 'Weights',
                    pic: 'assets/img/gym/weight.png',
                    neededGoods: {
                         steel: 45,
                         stone: 30,
                         wood: 25
                    },
                    unlockLevel: 2,
                    amount: 0
          	},
               yoga_mat: {
                    name: 'Yoga mat',
                    pic: 'assets/img/gym/yogamat.png',
                    neededGoods: {
                         glass: 55,
                         stone: 30,
                         wood: 40
                    },
                    unlockLevel: 5,
                    amount: 0
               },
               exercise_ball: {
                    name: 'Exercise ball',
                    pic: 'assets/img/gym/gymball.png',
                    neededGoods: {
                         glass: 60,
                         steel: 48,
                         wood: 52
                    },
                    unlockLevel: 7,
                    amount: 0
               },
               treadmill: {
                    name: 'Treadmill',
                    pic: 'assets/img/gym/treadmill.png',
                    neededGoods: {
                         glass: 47,
                         steel: 55,
                         stone: 70
                    },
                    unlockLevel: 10,
                    amount: 0
               }
          },
          isLocked: true,
          hasCurrentlyBought : false,
          boughtItem : null
     };

     // Buys the item
     o.buyItem = function(item) {
          var name = item.name.toLowerCase().replace(" ", "_");
          o.store[name].amount += 1;
          console.log(item.name + ": " + o.store[name].amount);
          //o.hasCurrentlyBought = true;
     };

     // Return the link of the picture for the item
     o.getPicLink = function(itemName) {
          var name = itemName.toLowerCase().replace(" ", "_");
          return o.store[name].pic;
     };

     // Unlocks the store, if a room is bought
     o.unlockStore = function() {
          o.isLocked = false;
          return false;
     };

     // Returns true, if an item was currentlyBought
     o.isItemBought = function(item) {
          if (item != null) {
               o.hasCurrentlyBought = true;
          } else {
               o.hasCurrentlyBought = false;
          }
          o.boughtItem = item;
          var array = [];
          array.push(o.hasCurrentlyBought);
          array.push(o.boughtItem);
          return array;
     };

     return o;
});
	