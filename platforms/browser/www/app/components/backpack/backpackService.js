angular.module('petGame.backpackService', [])
.factory('Backpack', function($interval) {
	/*
     * Object backpack
     */
     var o = {
          backpack: {
               berries : {
                    amount: 6,
                    pic: 'assets/img/backpack/berries.png',
                    name: 'Berries'
               }, 
               glass : {
                    amount: 70,
                    pic: 'assets/img/backpack/glass.png',
                    name: 'Glass'
               },
               ice : {
                    amount: 0,
                    pic: 'assets/img/backpack/ice.png',
                    name: 'Ice'
               },
               meat : {
                    amount: 0,
                    pic: 'assets/img/backpack/meat.png',
                    name: 'Meat'
               },
               steel : {
                    amount: 150,
                    pic: 'assets/img/backpack/steel.png',
                    name: 'Steel'
               },
               stone : {
                    amount: 100,
                    pic: 'assets/img/backpack/stone.png',
                    name: 'Stone'
               },
               water : {
                    amount: 0,
                    pic: 'assets/img/backpack/water.png',
                    name: 'Water'
               },
               wood : {
                    amount: 12,
                    pic: 'assets/img/backpack/wood.png',
                    name: 'Wood'
               }
          },
          backPath : '#/'
     };

     // Increases the amount of item
     o.increaseAmount = function(item, amount) {
          o.backpack[item].amount += amount;
          console.log(o.backpack[item].name + ": " + o.backpack[item].amount);
     };

     // Decreases the amount of item
     o.decreaseAmount = function(item, amount) {
          o.backpack[item].amount -= amount;
          console.log(o.backpack[item].name + ": " + o.backpack[item].amount);
     };

     // Returns true, if the amount of item is 0
     o.tradeButtonIsDisabled = function(item) {
          if (o.backpack[item.toLowerCase()].amount < 2) {
               return true;
          } 
          return false;
     };

     // Return the pic lin for the checkmark or the x, if there is enough good
     o.isEnoughGood = function(item, amount) {
          if (o.backpack[item].amount >= amount) {
               return 'assets/img/checkmark.png';
          }
          return 'assets/img/x.png'
     };

     // Returns true, if there are enough goods to buy the item
     o.buyButtonIsDisabled = function(neededGoods) {
          for (good in neededGoods) {
              var link = o.isEnoughGood(good, neededGoods[good]);
              if (link == 'assets/img/x.png') {
                    return true;
              }
          };
          return false;
     };

     return o;
});
	