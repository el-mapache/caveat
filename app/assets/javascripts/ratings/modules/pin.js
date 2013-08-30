angular.module("Pin",['InfoWindow']).factory("Pin", function($compile, InfoWindow) {
  function Pin(opts, message, index, template) {
    google.maps.Marker.apply(this, arguments);
    this.active = false;
    this.infoWindow = null;
    this.message = message || "";
    this.template = template || null;
    this.index = index;
  }
  
  Pin.prototype = new google.maps.Marker();
  
  Pin.prototype.toggleInfoWindow = function() {
    if (this.active) { 
      this.infoWindow.remove();
      this.active = false;
      this.infoWindow = null;
    } else {
      var infoWindow = new InfoWindow({latlng: this.getPosition(), map: this.map, content: this.message, template: this.template});
      this.infoWindow = infoWindow;
      this.active = true;
    }
  };

  Pin.prototype.removeWindow = function() {
    if (!this.infoWindow) return;

    this.infoWindow.remove();
    this.infoWindow = null;
  };
  
  return Pin;
});
