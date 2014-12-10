/**
 * Created by Tobias on 2014-12-01.
 */

/**
 * @param latitude
 * @param longitude
 * @param zoom
 * @constructor
 */
function Map(latitude, longitude, zoom){
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
    this.infoWindow = undefined;
    this.markers = [];
    this.mapOptions = {
        center: { lat: this.latitude, lng: this.longitude},
        zoom: this.zoom
    };
    this.map = new google.maps.Map(document.getElementById('mapCanvas'), this.mapOptions);
}

/**
 *
 * @param message reference to a TrafficMessage
 * @param aTag reference to link in the message list
 */
Map.prototype.addMarker = function(message, aTag) {
    var that = this;
    var latLng = new google.maps.LatLng(message.latitude, message.longitude);
    var marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: message.title
    });

    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        that.renderInfoWindow(message, marker);
    });

    aTag.onclick = function(){
        that.renderInfoWindow(message, marker);
    };
};

Map.prototype.removeMarkers = function(){
   this.markers.forEach(function(marker){
       marker.setMap(null);
   });

    this.markers = [];
};

/**
 * @param message reference to a TrafficMessage
 * @param marker reference to the clicked marker
 */
Map.prototype.renderInfoWindow = function(message, marker){
    if (this.infoWindow !== undefined) {
        this.infoWindow.close();
    }
    var contentString = "<div class='content'> " +
        "<h3>" +this.sanitize(message.title) + "</h3>"+
        "<h4>"+this.sanitize(message.categoryText)+"</h4>"+
        "<p>Rapporterat: " +this.sanitize(message.getDate()) + "</p>"+
        "<p>"+ this.sanitize(message.description) + "</p>"+
        "<p> detaljerad platsbeskrivning: "+ this.sanitize(message.location) +"</p>"+
        "</div>";

    //textNode.appendChild(contentString);

    this.infoWindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
    });

    this.map.setZoom(10);
    this.infoWindow.open(this.map, marker);
};

Map.prototype.sanitize = function(content){
    return content.replace(/</g, "&lt;").replace(/>/g, "&lt;");
};


