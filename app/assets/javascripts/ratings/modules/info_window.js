angular.module("InfoWindow",[]).factory("InfoWindow",function() {
  /* An InfoBox is like an info window, but it is totally custom!
   * @param {GLatLng} latlng Point to place bar at
   * @param {Map} map The map on which to display this InfoBox.
   * @param {Object} opts Passes configuration options - content,
   *   offsetVertical, offsetHorizontal, className, height, width
   */
  function InfoBox(opts) {
    google.maps.OverlayView.call(this);
    this._latlng = opts.latlng;
    this._map = opts.map;
    this._offsetVertical = -110;
    this._offsetHorizontal = 10;
    this._height = 74;
    this._width = 220;
    this.content = opts.content || "";
    var me = this;

    this._onBoundsChange = google.maps.event.addListener(this._map, "bounds_changed", function() {
      return me.panMap.apply(me);
    });
    
    // Once the properties of this OverlayView are initialized, set its map so
    // that we can display it.  This will trigger calls to panes_changed and
    // draw.
    this.setMap(this._map);
  }

  InfoBox.prototype = new google.maps.OverlayView();

  /* Creates the DIV representing this InfoBox
   */
  InfoBox.prototype.remove = function() {
    if (this._div) {
      this._div.parentNode.removeChild(this._div);
      this._div.className = this._div.className + "fade-show";
      this._div = null;
      // This is necessary to completely remove the info window object
      // otherwise the google map persists this in memory
      this.setMap(null);
    }
  };
  
  // Dynmically assign the wrapper once the inner div's contents have been filled in
  
  InfoBox.prototype._resizeWindowWrapper = function(evt, marker) {
    var wrapper = this._div;

    wrapper.style.height = this._div.querySelector(".info-window").clientHeight +"px";
    wrapper.style.width = this._div.querySelector(".info-window").clientWidth + "px";
  };
  
  /* Redraw the Bar based on the current projection and zoom level
   */
  InfoBox.prototype.draw = function() {
    var div;
    // Creates the element if it doesn't exist already.
    this.createElement();
    if (!this._div) return;

    // Calculate the DIV coordinates of two opposite corners of our bounds to
    // get the size and position of our Bar
    var pixPosition = this.getProjection().fromLatLngToDivPixel(this._latlng);
    if (!pixPosition) return;

    // Now position our DIV based on the DIV coordinates of our bounds
    div = this._div;
    div.style.width = this._width + "px";
    div.style.left = (pixPosition.x + this._offsetHorizontal) + "px";
    div.style.height = this._height + "px";
    div.style.top = (pixPosition.y + this._offsetVertical) + "px";
    this._resizeWindowWrapper();
  };

  /* Creates the DIV representing this InfoBox in the floatPane.  If the panes
   * object, retrieved by calling getPanes, is null, remove the element from the
   * DOM.  If the div exists, but its parent is not the floatPane, move the div
   * to the new pane.
   * Called from within draw.  Alternatively, this can be called specifically on
   * a panes_changed event.
   */
  InfoBox.prototype.createElement = function() {
    var panes = this.getPanes(),
        div = this._div;

    if (!div) {
      // This does not handle changing panes.  You can set the map to be null and
      // then reset the map to move the div.

      div = this._div = document.createElement("div");
      div.className = "info-window-wrapper";
      var innerDiv = document.createElement("div");
      innerDiv.className = "info-window";
      innerDiv.style.height = this._height;
      innerDiv.style.width = this._width;
      var contentDiv = document.createElement("div");

      if (typeof this.content === "string") {
        contentDiv.innerHTML = this.content;
      } else {
        contentDiv.innerHTML = this.content[0].innerHTML;
      }

      contentDiv.className = "content";

      var clear = document.createElement("div");
      clear.className = "clearfix";
      div.appendChild(innerDiv);
      innerDiv.appendChild(contentDiv);
      innerDiv.appendChild(clear);

      panes.floatPane.appendChild(div);
      this.panMap();

    } else if (div.parentNode != panes.floatPane) {
      // The panes have changed.  Move the div.
      div.parentNode.removeChild(div);
      panes.floatPane.appendChild(div);
    } else {
      // The panes have not changed, so no need to create or move the div.
    }
  }

  /* Pan the map to fit the InfoBox.
   */
  InfoBox.prototype.panMap = function() {
    // if we go beyond map, pan map
    var map = this._map,
        bounds = map.getBounds();
    if (!bounds) return;

    // The position of the infowindow
    var position = this._latlng;

    // The dimension of the infowindow
    var iwWidth = this._width;
    var iwHeight = this._height;

    // The offset position of the infowindow
    var iwOffsetX = this._offsetHorizontal;
    var iwOffsetY = this._offsetVertical;

    // Padding on the infowindow
    var padX = 40;
    var padY = 40;

    // The degrees per pixel
    var mapDiv = map.getDiv();
    var mapWidth = mapDiv.offsetWidth;
    var mapHeight = mapDiv.offsetHeight;
    var boundsSpan = bounds.toSpan();
    var longSpan = boundsSpan.lng();
    var latSpan = boundsSpan.lat();
    var degPixelX = longSpan / mapWidth;
    var degPixelY = latSpan / mapHeight;

    // The bounds of the map
    var mapWestLng = bounds.getSouthWest().lng();
    var mapEastLng = bounds.getNorthEast().lng();
    var mapNorthLat = bounds.getNorthEast().lat();
    var mapSouthLat = bounds.getSouthWest().lat();

    // The bounds of the infowindow
    var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
    var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
    var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
    var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

    // calculate center shift
    var shiftLng =
        (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
        (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
    var shiftLat =
        (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
        (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

    // The center of the map
    var center = map.getCenter();

    // The new map center
    var centerX = center.lng() - shiftLng;
    var centerY = center.lat() - shiftLat;

    // center the map to the new shifted center
    map.setCenter(new google.maps.LatLng(centerY, centerX));

    // Remove the listener after panning is complete.
    google.maps.event.removeListener(this._onBoundsChange);
    this.onBoundsChange = null;
  };

  return InfoBox;
});

