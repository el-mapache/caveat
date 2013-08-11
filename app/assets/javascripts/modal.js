var app = angular.module("ratings",['ui.bootstrap', 'templates', 'geolocationService', 'map']);
console.log(app);
// This controller simply provides a wrapper for the bootstrap dialog
// directive.
app.controller("DialogCtrl", function($scope, $templateCache, $dialog) {
  $scope.opts = {
    backdrop: true,
    keyboard: false,
    backdropClick: false,
    template: $templateCache.get("modal.html"),
    dialogClass: "modal span7",
    backdropFade: true,
    controller: "_ContentCtrl"
  };
  
  $dialog.dialog($scope.opts).open();
});

// dialog directive is injected into this controller
app.controller("_ContentCtrl", function($scope, $http, dialog, geolocationService) {
  // Aliased so I dont have to type so damn much
  var geo = geolocationService;
  
  $scope.active = geo.isSupported() ? true : false;
  $scope.error = {
    hasError: false,
    message: ""
  };
  
  $scope.toggleActive = function() {
    return $scope.active = !$scope.active;
  }

  $scope.locate = function() {
    $scope._showSpinner();
    $scope.toggleActive();
    geo.getPosition(function(response) {
      // Since this callback is executed in a different scope
      // it has to be wrapped in an angular apply to update the DOM
      $scope.$apply(function() {
        if (response.toString().match(/Error/)) {
          $scope.error.hasError = true;
          $scope.error.message = response.message + ".";
        } else {
          $scope._getBusinesses(response);
        }
      });
    });
  };

  $scope._showSpinner = function() {
    var spinner = new Spinner({
      lines: 13,
      length: 10,
      width: 5,
      radius: 15,
    }).spin(angular.element("#locate")[0]);
  };
  
  $scope._getBusinesses = function(position) {
    $http({
      method: "GET",
      url: "http://localhost:3000/api/v1/businesses",
      params: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    }).success(function(data, status, headers, config) {
      console.log(arguments);
      dialog.close();
    }).error(function(data, status) {
      $scope.error = {
        hasError: true,
        message: "Something has gone horribly wrong."
      };
    });
  };
});

