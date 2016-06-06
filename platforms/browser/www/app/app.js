// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('petGame', ['ionic', 'petGame.controllers', 'ngDraggable'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router, which uses the concept of states.
  // Learn more here: https://github.com/angular-ui/ui-router.
  // Set up the various states in which the app can be.
  // Each state's controller can be found in controllers.js.
  $stateProvider

  // Each tab has its own nav history stack:
  .state('game', {
    url: '/',
    templateUrl: 'app/components/game/game.html',
    controller: 'GameCtrl'
  })

  .state('tracking', {
    url: '/tracking',
    templateUrl: 'app/components/tracking/tracking.html',
    controller: 'GameCtrl'
  })

  .state('store', {
    url: '/store', 
    templateUrl: 'app/components/store/store.html',
    controller: 'GameCtrl'
  })

  .state('gym', {
    url: '/gym/:boughtItem', 
    templateUrl: 'app/components/gym/gym.html',
    controller: 'GameCtrl'
  })

  .state('backpack', {
    url: '/backpack', 
    templateUrl: 'app/components/backpack/backpack.html',
    controller: 'GameCtrl'
  })

  .state('friends', {
    url: '/friends', 
    templateUrl: 'app/components/friends/friends.html',
    controller: 'GameCtrl'
  })
    
  $urlRouterProvider.otherwise('/');
})

/*.constant('SERVER', {
  // Local server
  url: 'http://locaslhost:3000'

  // Public server
  // url: 'https://'
})  */
