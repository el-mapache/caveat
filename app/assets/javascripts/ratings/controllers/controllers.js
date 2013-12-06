var app = angular.module("ratings",['ui.bootstrap', 'templates', 'geolocationService','broadcastService','RequestService','google-map','simple-sort']);
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
app.controller("_ContentCtrl", function($scope, dialog, geolocationService, broadcastService, RequestService) {
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

  // Find businesses near the user based on inital
  // geolocation request
  $scope._getBusinesses = function(response) {
    var request = RequestService.get("businesses", {
      lat: response.position.coords.latitude,
      lng: response.position.coords.longitude,
      address: response.address
    });

    request.success(function(data, status, headers, config) {
      dialog.close();
      speaker.broadcast("closeModal", data);
    }).error(function(data, status) {
      $scope.error = {
        hasError: true,
        message: "Something has gone horribly wrong."
      };
      $scope.toggleActive();
    });
  };
});

app.controller("BusinessCtrl", function($scope, broadcastService) {
  $scope.showBusiness = false;

  $scope.hideSidebar = function() {
    broadcastService.broadcast("HideSidebar", $scope.businessObj);
    $scope.toggleBusinessWindow();
  }

  // Hides or shows the business sidebar
  $scope.toggleBusinessWindow = function() {
    $scope.showBusiness = !$scope.showBusiness;
  };

  $scope.$on("HideBusiness", function(evt) {
    $scope.toggleBusinessWindow();
    $scope.$apply();
  });

  $scope.$on("ShowBusiness", function(evt, businessObj) {
    // Set up our businessObj for client-side display
    $scope.businessObj = businessObj;
    $scope.average = $scope.businessObj.average_score;

    if (!$scope.showBusiness) 
      $scope.toggleBusinessWindow();
    
    $scope.$apply();
  });  
});

app.controller("AccordionCtrl", function($scope) {
  $scope.oneAtATime = true;
});

app.controller("TypeaheadCtrl", function($scope, geolocationService, RequestService, broadcastService) {
  var geo = geolocationService;

  $scope.business = "";
  $scope.businesses = [];
  $scope.hasError = {
    error: false,
    message: ""
  };

  RequestService.get("businesses", {name: "all"}).success(function(response) {
    if (response && response.length !== 0) {
      for (var i = 0, l = response.length; i < l; i++) {
        $scope.businesses.push(response[i].name);
      }
    }
  });

  $scope.search = function() {
    var request = RequestService.get("businesses/" + $scope.business, {})

    request.success(function(response, status) {
      if (response.length > 0) {
        var business = response[0];

        geolocationService.updateCurrentPosition({
          latitude: business.business.latitude,
          longitude: business.business.longitude
        });

        broadcastService.broadcast("BusinessSearch", [business]);
      } else {
        $scope.hasError = {
          error: true,
          message: "We weren't able to locate that establishment. Maybe the rats got their first...."
        };
      }
    });
  };
});
