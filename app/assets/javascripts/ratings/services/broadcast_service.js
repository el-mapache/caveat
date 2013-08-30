angular.module("broadcastService",[]).service("broadcastService", function($rootScope) {
  return {
    broadcast: function(eventName, data) {
      $rootScope.$broadcast(eventName, data);
    }
  };
});

