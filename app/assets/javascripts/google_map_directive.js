angular.module("map", []).directive("googleMap", function() {
  return {
    priority: 100,
    restrict: 'E',
    transclude: true,
    scope: {
      map: "=",
      drawMap: "&"
    },
    controller: function($scope) {
        $scope.drawMap = function(element) {
          var latlng = new google.maps.LatLng(37.7750, -122.4183);
          $scope.map = new google.maps.Map(element[0],{center: latlng,mapTypeId: google.maps.MapTypeId.ROADMAP});

        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
          console.log('loaded');
          google.maps.event.trigger($scope.map, 'resize');
       });
        }
    },
    link: function(scope, element, attrs) {
      google.maps.event.addDomListener(window, 'load', function() {
          scope.drawMap(element);
      });
    }
  };
});
