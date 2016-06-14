angular.module('petGame.friendsService', [])
.factory('Friends', function($interval) {
	
     var friends = {
     	connectedFriends: {
     		friend1: {
     			name: "Mijo",
     			level: 2,
     			petType: "bird"
     		},
     		friend2: {
     			name: "Popey",
     			level: 5,
     			petType: "tiger"
     		},
     		friend3: {
     			name: "Sarah",
     			level: 3,
     			petType: "penguin"
     		},
     		friend4: {
     			name: "Bubu",
     			level: 12,
     			petType: "turtle"
     		}
     	},
     	allUsers: {
     		user1: {
     			name: "Viktor",
     			level: 20,
     			petType: "penguin"
     		},
     		user2: {
     			name: "Vivi",
     			level: 1,
     			petType: "tiger"
     		},
     		user3: {
     			name: "Dori",
     			level: 6,
     			petType: "bird"
     		},
     		user4: {
     			name: "Shugi",
     			level: 4,
     			petType: "turtle"
     		},
     		user5: {
     			name: "Memfi",
     			level: 7,
     			petType: "turtle"
     		}
     	},
     	friend: null,
          connectedWithFacebook: false
     };

     // Detaches a friend, so that a new friend can be picked
     friends.detachFriend = function() {
          friends.friend = null;
          return friends.friend;
     };

     // Teams up with a friend, so that the user can get the boni of a having a friend
     friends.teamUpWithFriend = function(friend) {
     	friends.friend = friend;
     	return friends.friend;
     };

     // Connects with facebook, so that user can team up with his/her own friends
     friends.connectWithFacebook = function() {
          friends.connectedWithFacebook = true;
          return friends.connectedWithFacebook;
     };

     // Disconnects with facebook
     friends.disconnectWithFacebook = function() {
          friends.connectedWithFacebook = false;
          for (f in friends.connectedFriends) {
                if (friends.friend == friends.connectedFriends[f]) {
                    friends.friend = null;
                }
          }
          return [friends.connectedWithFacebook, friends.friend];
     };

     return friends;
});
	