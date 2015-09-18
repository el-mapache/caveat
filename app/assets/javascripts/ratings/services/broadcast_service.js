angular.module("BroadcastService",[]).service("BroadcastService", function($rootScope) {
  return {
    broadcast: function(eventName, data) {
      $rootScope.$broadcast(eventName, data);
    }
  };
});

