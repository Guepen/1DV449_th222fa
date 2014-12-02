/**
 * Created by Tobias on 2014-12-01.
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

    //DRY
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

Map.prototype.renderInfoWindow = function(message, marker){
    console.log(marker);
    if (this.infoWindow !== undefined) {
        this.infoWindow.close();
    }
    var contentString = "<div class='content'> " +
        "<h3>" + message.title + "</h3>"+
        "<h4>"+ message.categoryText+"</h4>"+
        "<p>Rapporterat: " + message.getDate() + "</p>"+
        "<p>"+ message.description + "</p>"+
        "<p> detaljerad platsbeskrivning: "+ message.location +"</p>"+
        "</div>";

    this.infoWindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
    });

    this.map.setZoom(10);
    this.infoWindow.open(TrafficBoard.map, marker);
};


