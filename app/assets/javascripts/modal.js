var app = angular.module("ratings",['ui.bootstrap', 'templates', 'geolocationService','broadcastService','google-map']);
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
    geo.getPosition(function(response) {
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
  
  $scope._getBusinesses = function(position) {
    $http({
      method: "GET",
      url: "http://localhost:3000/api/v1/businesses",
      params: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
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
  $scope.showViolations = false;

  $scope.toggleBusinessWindow = function() {
    return $scope.showBusiness = !$scope.showBusiness;
  };
  
  $scope.businessShown = function() {
    return $scope.showBusiness ? "fade-show" : "fade-hide";
  }

  $scope.ratScore = function() {
    var times = $scope.average >= 90 ? 0 :
                $scope.average >= 79 && $scope.average <= 89 ? 1 :
                $scope.average < 79 && $scope.average >= 69 ? 2 :
                $scope.average < 69 && $scope.average >= 59 ? 3 :
                4;

    return new Array(times);
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

});
