/**
 * Created by Tobias on 2014-12-01.
 */

function Map(latitude, longitude, zoom){
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
}

Map.prototype.render = function(){
    var mapOptions = {
        center: { lat: this.latitude, lng: this.longitude},
        zoom: this.zoom
    };
    TrafficBoard.map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
};

removeMarkers = function(){
    for(var i = 0; i < TrafficBoard.markers.length; i++){
        TrafficBoard.markers[i].setMap(null);
    }
};