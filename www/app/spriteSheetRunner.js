angular.module('petGame.directives', [])
.directive('spriteSheetRunner', function () {
       return {
           //restrict : 'EAC',
           //replace : true,
           /*scope :{
           },*/
           template: '<canvas width="450" height="700"></canvas>',
           link: function ($scope, element, attribute) {
               var w, h, loader, manifest, backyard, pet, apple, candy, rotate, rubber_duck;
               drawGame();

               /*$scope.stage = new createjs.Stage(element[0]);
               var Background = new createjs.Bitmap('img/backyard.png');
               Background.x = 0;
               Background.y = 0;
               $scope.stage.addChild(Background);
               $scope.stage.update();
               console.log("here");
               console.log($scope.stage);*/

               function drawGame() {
                   //drawing the game canvas from scratch here
                   //In future we can pass stages as param and load indexes from arrays of background elements etc
                   if ($scope.stage) {
                       $scope.stage.autoClear = true;
                       $scope.stage.removeAllChildren();
                       $scope.stage.update();
                   } else {
                       $scope.stage = new createjs.Stage(element[0]);
                   }
                   w = $scope.stage.canvas.width;
                   h = $scope.stage.canvas.height;
                   manifest = [
                       {src: "pet.png", id: "pet"},
                       {src: "backyard.png", id: "backyard"},
                       {src: "apple.png", id: "apple"},
                       {src: "candy.png", id: "candy"},
                       {src: "rotate.png", id: "rotate"},
                       {src: "rubber_duck.png", id: "rubber_duck"}
                   ];
                   loader = new createjs.LoadQueue(false);
                   //loader.addEventListener("complete", handleComplete);
                   loader.loadManifest(manifest, true, "img/");
               }

               function handleComplete() {
                   backyard = new createjs.Shape();
                   backyard.graphics.beginBitmapFill(loader.getResult("backyard")).drawRect(0, 0, w, h);
                   apple = new createjs.Bitmap(loader.getResult("apple"));
                   apple.setTransform(Math.random() * w, h - apple.image.height * 4 - backyard.height, 4, 4);
                   apple.alpha = 0.5;
                   candy = new createjs.Bitmap(loader.getResult("candy"));
                   candy.setTransform(Math.random() * w, h - candy.image.height * 3 - backyard.height, 3, 3);
                   var spriteSheet = new createjs.SpriteSheet({
                       framerate: 30,
                       "images": [loader.getResult("pet")],
                       "frames": {"regX": 82, "height": 85, "count": 5, "regY": 0, "width": 98},
                       // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                       "animations": {
                           "normal": 0,
                           "happy": [0, 5, "normal", 50]
                       }
                   });
                   pet = new createjs.Sprite(spriteSheet, "normal");
                   pet.y = 35;
                   $scope.stage.addChild(backyard, apple, candy);
                   $scope.stage.addEventListener("stagemousedown", handleJumpStart);
                   createjs.Ticker.timingMode = createjs.Ticker.RAF;
                   //createjs.Ticker.addEventListener("tick", tick);
               }

               function handleJumpStart() {
                   pet.gotoAndPlay("jump");
               }

               /*function tick(event) {
                   var deltaS = event.delta / 1000;
                   var position = pet.x  150 * deltaS;
                   var grantW = pet.getBounds().width * pet.scaleX;
                   pet.x = (position >= w  grantW) ? -grantW : position;
                   backyard.x = (backyard.x - deltaS * 150) % backyard.tileW;
                   apple.x = (apple.x - deltaS * 30);
                   if (apple.x  apple.image.width * apple.scaleX <= 0) {
                       apple.x = w;
                   }
                   candy.x = (candy.x - deltaS * 45);
                   if (candy.x  candy.image.width * candy.scaleX <= 0) {
                       candy.x = w;
                   }
                   scope.stage.update(event);
               }*/
           }
       }
   });