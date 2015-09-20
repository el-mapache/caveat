angular.module("Pin", [
  'InfoWindow',
  'BroadcastService'
]).factory("Pin", function(InfoWindow, BroadcastService) {
  function Pin(opts, content, index) {
    google.maps.Marker.apply(this, arguments);

    this.active = false;
    this.infoWindow = null;
    this.data = content || {};
    this.index = index;
  }

  Pin.prototype = google.maps.Marker.prototype;

  Pin.prototype.toggleInfoWindow = function(template) {
    if (this.active) {
      this.active = false;
      this.removeWindow();
    } else {
      this.infoWindow = new InfoWindow({
        latlng: this.getPosition(),
        map: this.map,
        content: template
      });

      this.active = true;
    }
  };

  Pin.prototype.remove = function() {
    this.removeWindow();
    google.maps.event.clearInstanceListeners(this);
    this.setMap(null);
  };

  Pin.prototype.removeWindow = function() {
    if (!this.infoWindow) {
      return;
    }

    this.infoWindow.remove();
    this.infoWindow = null;
    BroadcastService.broadcast("DestroyContentWindow");
  };

  return Pin;
});
