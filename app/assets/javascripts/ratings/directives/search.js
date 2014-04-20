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
.directive('focusable', function($timeout) {
  return {
    priority: 0,
    restrict: 'A',
    scope: {
      focused: "@hasFocus"
    },
    link: function(scope, element, attrs) {
      scope.$watch("focused", function(value) {
        if (value == "true"){
          element[0].focus();
        }
      });
    }
  };
});

