angular.module("map",[]).factory("mapService", function() {
  var _defaults = {
    zoom: 14,
    mapTypeId: "road",
    draggable: false,
  },
  _coords = {
    lat: "37.7750",
    lng: "-122.4167"
  },
  _markers = [],
  _currentWindow = null,
  _map = null;

  return {
    init: function(container, settings) {
      settings.center = new google.maps.LatLng(_coords.lat, _coords.lng);
      settings = angular.extend(_defaults, settings);
      _map = new google.maps.Map(container, settings);
      return _map;
    },

    getMap: function() {
      return _map;
    }
  };
});
