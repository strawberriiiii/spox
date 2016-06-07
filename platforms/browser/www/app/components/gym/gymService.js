angular.module('petGame.gymService', ['petGame.backpackService'])
.factory('Gym', function(Backpack) {
	/*
     * Object gym
     */
     var o = {
     	gym : {
               userSatisfaction: 0,
               rooms : {
                    room1: {
                         status: "forSale",
                         unlockLevel: 1,
                         requiredGoods: {
                              glass: 5,
                              steel: 10,
                              stone: 7,
                              wood: 12
                         }, 
                         constructionTime: "03h",
                         itemPlaced: [null, null, null, 
                                        null, null, null, 
                                        null, null, null, 
                                        null, null, null]
                    },
                    room2: {
                         status: "locked",
                         unlockLevel: 2,
                         requiredGoods: {
                              glass: 10,
                              steel: 18,
                              stone: 21,
                              wood: 9
                         }, 
                         constructionTime: "12h",
                         itemPlaced: [null, null, null, null,
                                        null, null, null, null,
                                        null, null, null, null]
                    },
                    room3: {
                         status: "locked",
                         unlockLevel: 4,
                         requiredGoods: {
                              glass: 40,
                              steel: 20,
                              stone: 25,
                              wood: 30
                         }, 
                         constructionTime: "28h",
                         itemPlaced: [null, null, null, null, null,
                                        null, null, null, null, null,
                                        null, null, null, null, null,
                                        null, null, null, null, null,
                                        null, null, null, null, null]
                    },
                    room4: {
                         status: "locked",
                         unlockLevel: 6,
                         requiredGoods: {
                              glass: 15,
                              steel: 30,
                              stone: 20,
                              wood: 15
                         }, 
                         constructionTime: "42h",
                         itemPlaced: [null, null,
                                        null, null,
                                        null, null,
                                        null, null,
                                        null, null]
                    }, 
                    room5: {
                         status: "locked",
                         unlockLevel: 100,
                         requiredGoods: {
                              glass: 0,
                              steel: 0,
                              stone: 0,
                              wood: 0
                         }, 
                         constructionTime: "00h",
                         itemPlaced: [null, null, null, null, null, null, null,
                                        null, null, null, null, null, null, null]
                    }
               }
          }
     };

     // Returns the picture of the smiley depending on the user satisfaction
     o.getUserSatisfactionPic = function() {
          if (o.gym.userSatisfaction < 25) {
               return "assets/img/gym/sadSmiley.png";
          } else if (o.gym.userSatisfaction >= 25 && o.gym.userSatisfaction < 75) {
               return "assets/img/gym/middleSmiley.png";
          } else {
               return "assets/img/gym/happySmiley.png";
          }
     };

     // Increases the user satisfaction by a certain amount until it has reached its limit 100
     o.increaseUserSatisfaction = function(amount) {
          if (o.gym.userSatisfaction <= 100) {
               o.gym.userSatisfaction += amount;
               if (o.gym.userSatisfaction > 100) {
                    o.gym.userSatisfaction = 100;
               }
          }
     };

     // Decreases the user satisfaction by a certain amount until it has reached its minimum 
     o.decreaseUserSatisfaction = function(amount) {
          if (o.gym.userSatisfaction >= 0) {
               o.gym.userSatisfaction -= amount;
               if (o.gym.userSatisfaction < 0) {
                    o.gym.userSatisfaction = 0;
               }
          }
     };

     // Draws the user satisfaction bar
     o.drawUserSat = function() {
          var c = document.getElementById('userSatisfactionGraph');
          var canvas = c.getContext("2d");
          canvas.beginPath();

          if (o.gym.userSatisfaction < 25) {
               canvas.fillStyle = "#ed1111";
          } else if (o.gym.userSatisfaction >= 25 && o.gym.userSatisfaction < 75) {
               canvas.fillStyle = "#da7a0b";
          } else {
               canvas.fillStyle = "#2d882d";
          }
          
          if (o.gym.userSatisfaction > 95) {
               canvas.rect(0, 0, 500, 200);
          } else {
               canvas.rect(0, 0, 40 + (o.gym.userSatisfaction * 2.2), 200);
          }
          canvas.fill();
     };

     // Returns false, if a room is already bought in order to be able to buy an item
     o.isNoRoomBought = function() {
          for (room in o.gym.rooms) {
               if (o.gym.rooms[room].status == "bought" || o.gym.rooms[room].status == 'underConstruction') {
                    return false;
               }
          }
          return true;
     };

     // Buys a specific room 
     o.buyRoom = function(room) {
          o.gym.rooms[room].status = "bought";
          for (good in o.gym.rooms[room].requiredGoods) {
               Backpack.decreaseAmount(good, o.gym.rooms[room].requiredGoods[good]);
          }
     };

     // Locks the friend room 
     o.lockFriendRoom = function() {
          o.gym.rooms.room5.status = "locked";
     }

     // Returns true, if there are not enough goods to buy the room
     o.isBuyRoomDisabled = function(room) {
          for (good in o.gym.rooms[room].requiredGoods) {
               if (o.gym.rooms[room].requiredGoods[good] > Backpack.backpack[good].amount) {
                    return true;
               };
          }
          return false;
     };

     // Return the timer for the construction room
     o.getTimer = function(room) {
          //has to be in milliseconds
          //var time = parseInt(o.gym.rooms[room].constructionTime.slice(0,2)) * 3600000;
          var time = 3000;
          var timer = setTimeout(setRoomToBought(room), time);
          /*setInterval(function() {
               minutes = parseInt(timer / 60, 10);
               seconds = parseInt(timer % 60, 10);
          })
          console.log(timer);*/
          return ;
     };

     o.resetGym = function() {
          for (room in o.gym.rooms) {
               console.log(room);
               for (i = 0; i < o.gym.rooms[room].itemPlaced.length; i++) {
                    o.gym.rooms[room].itemPlaced[i] = null;
               }
               if (o.gym.rooms[room].unlockLevel == 1) {
                    o.gym.rooms[room].status = "forSale";
                    console.log("here");
               } else {
                    o.gym.rooms[room].status = "locked";
                    console.log("here2");
               }
          }
          o.gym.userSatisfaction = 0;

     };

     // Sets the status of the room to "bought", after the construction time is over
     function setRoomToBought(room) {
          o.gym.rooms[room].status = "bought";
          o.drawRoom(room);
     }

     return o;
});
	