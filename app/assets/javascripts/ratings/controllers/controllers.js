(function(window) {
  var app = angular.module("ratings",
    [
     'ui.bootstrap',
     'templates',
     'GeolocationService',
     'BroadcastService',
     'RequestService',
     'google-map',
     'simple-sort',
     'ratings-search'
    ]
  );

  // This controller simply provides a wrapper for the bootstrap dialog
  // directive.
  app.controller("DialogCtrl", ["$scope", "$templateCache", "$dialog", function($scope, $templateCache, $dialog) {
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
  }]);

  // dialog directive is injected into this controller
  app.controller("_DialogContentCtrl", [
    "$scope",
    "dialog",
    "GeolocationService",
    "BroadcastService",
    "RequestService",
    function($scope, dialog, GeolocationService, BroadcastService, RequestService) {

      var gls = GeolocationService;

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
        // Overriding for now to force location to the center of san francisco.
        gls.getCurrentPosition = (function(onSuccess) {
          gls.updateCurrentPosition({
            latitude: 37.778146, 
            longitude: -122.4084693
          });
          onSuccess(gls.currentPosition);
        })($scope.getBusinesses);
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
        //$scope.$apply()

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
  }]);

  app.controller("BusinessCtrl", ["$scope", "BroadcastService", function($scope, BroadcastService) {
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
    });

    $scope.$on("ShowBusiness", function(evt, businessObj) {
      // Set up our businessObj for client-side display
      $scope.businessObj = businessObj;
      $scope.average = $scope.businessObj.average_score;

      if (!$scope.showBusiness) $scope.toggleBusinessWindow();

      $scope.$apply();
    });
  }]);

  app.controller("TypeaheadCtrl", [
    "$scope",
    "GeolocationService",
    "RequestService",
    "BroadcastService",
  function($scope, GeolocationService, RequestService, BroadcastService) {
    $scope.businessName = "";
    $scope.businessNames = [];
    $scope.hasError = {
      error: false,
      message: ""
    };

    $scope.close= function() {
      $scope.hasError = {error: false, message: ""};
    };

    RequestService.get("businesses", {name: "all"}).success(function(response) {
      if (response && response.length !== 0) {
        for (var i = 0, l = response.length; i < l; i++) {
          $scope.businessNames.push(response[i].name);
        }
      }
    });

    $scope.$watch('streetSearch.businessName.$modelValue', function(val) {
      $scope.businessName = val;
    });

    $scope.search = function() {
      if (!$scope.businessName) return;
      var request = RequestService.get("businesses/" + $scope.businessName, {});

      request.success(function(response, status) {
        if (response.length !== 0) {
          var business = response[0];

          GeolocationService.updateCurrentPosition({
            latitude: business.business.latitude,
            longitude: business.business.longitude
          });

          BroadcastService.broadcast("BusinessSearch", [business]);
        }
      });

      request.error(function() {
        $scope.hasError = {
          error: true,
          message: "Sorry, we weren't able to locate that establishment."
        };
      });
    };
  }]);
})(window);

