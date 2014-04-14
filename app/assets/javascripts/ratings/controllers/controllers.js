(function(window) {
  var app = angular.module("ratings",
    [
     'ui.bootstrap',
     'templates',
     'GeolocationService',
     'BroadcastService',
     'RequestService',
     'google-map',
     'simple-sort'
    ]
  );

  // This controller simply provides a wrapper for the bootstrap dialog
  // directive.
  app.controller("DialogCtrl", function($scope, $templateCache, $dialog) {
    $scope.options = {
      backdrop: true,
      keyboard: false,
      backdropClick: false,
      template: $templateCache.get("modal.html"),
      dialogClass: "modal",
      backdropFade: true,
      controller: "_DialogContentCtrl"
    };

    $dialog.dialog($scope.options).open();
  });

  // dialog directive is injected into this controller
  app.controller("_DialogContentCtrl", function($scope, dialog, GeolocationService, BroadcastService, RequestService) {

    // Determine if geolocation is available in the users browser.
    // TODO: Possibly ignore this and just show 20 or so businesses in the center 
    // of San Francisco? 
    // Maybe if geolocation is unavailable or the user isnt in san francisco, just show the center
    // rather than breaking the whole app
    if (!GeolocationService.isSupported()) { 
      $scope.active = false;
      $scope.error = {
        hasError: true,
        message: "Geolocation is not supported in your browser."
      };
    } else {
      $scope.active = true

      $scope.error = {
        hasError: false,
        message: ""
      };
    }

    $scope.toggleActive = function() {
      return $scope.active = !$scope.active;
    }

    $scope.locate = function() {
      $scope._showSpinner();
      $scope.toggleActive();
      GeolocationService.getCurrentPosition($scope.getBusinesses);
    };

    $scope._showSpinner = function() {
      var spinner = new Spinner({
        lines: 13,
        length: 10,
        width: 5,
        radius: 15,
      }).spin(document.getElementById("locate"));
    };

    /* Query the server for businesses near the supplied coordinates.
     *
     * @param {coords} Object The latitude and longitude to search within.
    */
    $scope.getBusinesses = function(coords) {
      var request = RequestService.get("businesses", {
        lat: coords.latitude,
        lng: coords.longitude
      });

      // Promise callbacks will never be executed without an $apply here
      $scope.$apply()

      request.success(function(data, status, headers, config) {
        dialog.close();
        BroadcastService.broadcast("closeModal", data);
      }).error(function(data, status) {
        $scope.error = {
          hasError: true,
          message: "Something has gone horribly wrong. Contact the developer at once!"
        };
        $scope.toggleActive();
      });
    };
  });

  app.controller("BusinessCtrl", function($scope, BroadcastService) {
    $scope.showBusiness = false;

    $scope.hideSidebar = function() {
      BroadcastService.broadcast("HideSidebar", $scope.businessObj);
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

      if (!$scope.showBusiness) $scope.toggleBusinessWindow();

      $scope.$apply();
    });
  });

  app.controller("TypeaheadCtrl", function($scope, GeolocationService, RequestService, BroadcastService) {
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
        if (response.length !== 0) {
          var business = response[0];

          GeolocationService.updateCurrentPosition({
            latitude: business.business.latitude,
            longitude: business.business.longitude
          });

          BroadcastService.broadcast("BusinessSearch", [business]);
        } else {
          $scope.hasError = {
            error: true,
            message: "We weren't able to locate that establishment. Maybe the rats got there first...."
          };
        }
      });
    };
  });
})(window);

