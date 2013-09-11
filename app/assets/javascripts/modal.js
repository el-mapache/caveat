var app = angular.module("ratings",['ui.bootstrap', 'templates', 'geolocationService','broadcastService','google-map','simple-sort']);
// This controller simply provides a wrapper for the bootstrap dialog
// directive.
app.controller("DialogCtrl", function($scope, $templateCache, $dialog) {
  $scope.opts = {
    backdrop: true,
    keyboard: false,
    backdropClick: false,
    template: $templateCache.get("modal.html"),
    dialogClass: "modal",
    backdropFade: true,
    controller: "_ContentCtrl"
  };
  
  $dialog.dialog($scope.opts).open();
});

// dialog directive is injected into this controller
app.controller("_ContentCtrl", function($scope, $http, dialog, geolocationService, broadcastService) {
  // Aliased so I dont have to type so damn much
  var geo = geolocationService,
      speaker = broadcastService;

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
    geo.reverseGeocode(function(response) {
      // Since this callback is executed in a different scope
      // it has to be wrapped in an angular apply to update the DOM
      $scope.$apply(function() {
        if (response.toString().match(/Error/)) {
          $scope.error.hasError = true;
          $scope.error.message = response.message + ".";
          $scope.toggleActive();
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
    }).spin(document.getElementById("locate"));
  };
  
  $scope._getBusinesses = function(response) {
    $http({
      method: "GET",
      url: "http://localhost:1337/api/v1/businesses",
      params: {
        lat: response.position.coords.latitude,
        lng: response.position.coords.longitude,
        address: response.address
      }
    }).success(function(data, status, headers, config) {
      dialog.close();
      speaker.broadcast("closeModal", data);
    }).error(function(data, status) {
      $scope.error = {
        hasError: true,
        message: "Something has gone horribly wrong."
      };
    });
  };
});

app.controller("BusinessCtrl", function($scope, broadcastService) {
  $scope.showBusiness = false;
  // $scope.showViolations = false;

  $scope.toggleBusinessWindow = function() {
    return $scope.showBusiness = !$scope.showBusiness;
  };
  
  $scope.$on("HideBusiness", function(evt) {
    $scope.toggleBusinessWindow();
    $scope.$apply();
  });

  $scope.$on("ShowBusiness", function(evt, businessObj) {
    $scope.businessObj = businessObj;
    $scope.average = $scope.businessObj.average_score;

    if (!$scope.showBusiness) $scope.toggleBusinessWindow();
    
    $scope.$apply();
  });  
});

app.controller("AccordionCtrl", function($scope) {
  $scope.limitOne = true;

});