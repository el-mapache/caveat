angular.module('ratings-search', [])
.directive('ratingsSearch', function() {
  return {
    priority: 100,
    restrict: "AE",
    replace: true,
    templateUrl: "/assets/search.html",
    controller: function($scope) {
      $scope.toggleSearch = function() {
        $scope.searchActive = !$scope.searchActive;
      };
    },
    link: function(scope, element, attrs ) {
      scope.searchActive = false;
    }
  };
})
.directive('focusable', function() {
  return {
    priority: 0,
    restrict: 'A',
    link: function(scope, element, attrs) {
      attrs.$observe('hasFocus', function(value) {
        if (value == "true"){
          element[0].focus();
        }
      });
    }
  };
});

