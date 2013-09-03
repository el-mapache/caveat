angular.module("Pin",['InfoWindow']).factory("Pin", function($compile, InfoWindow) {
  function Pin(opts, content, index) {
    google.maps.Marker.apply(this, arguments);
    this.active = false;
    this.infoWindow = null;
    this.data = content || {};
    this.index = index;
  }
  
  Pin.prototype = new google.maps.Marker();
  
  Pin.prototype.toggleInfoWindow = function(template) {
    if (this.active) { 
      this.infoWindow.remove();
      this.active = false;
      this.infoWindow = null;
    } else {
      var infoWindow = new InfoWindow({latlng: this.getPosition(), map: this.map, content: template});
      this.infoWindow = infoWindow;
      this.active = true;
    }
  };

  // This might not even be used anymore
  Pin.prototype.removeWindow = function() {
    if (!this.infoWindow) return;

    this.infoWindow.remove();
    this.infoWindow = null;
  };
  
  return Pin;
});
