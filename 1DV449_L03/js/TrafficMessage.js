/**
 * Created by Tobias on 2014-12-01.
 */

function TrafficMessage(dateTime, title, location, description, category, latitude, longitude, marker){
    this.date = new Date(parseInt(dateTime.replace("/Date(", "").replace(")/",""), 10));
    this.title = title;
    this.location = location;
    this.description = description;
    this.category = category;
    this.latitude = latitude;
    this.longitude = longitude;
    this.marker = marker;

}

TrafficMessage.prototype.renderMarker = function(){
    var latLng = new google.maps.LatLng(this.latitude, this.longitude);
    var that = this;
    this.marker = new  google.maps.Marker({
        position: latLng,
        map: TrafficBoard.map
    });

    google.maps.event.addListener(this.marker, 'click', function() {
        that.renderInfoWindow(that.marker);
    });

TrafficMessage.prototype.renderInfoWindow = function(){
    if (TrafficBoard.infoWindow !== undefined) {
        TrafficBoard.infoWindow.close();
    }
    var contentString = "<div class='content'> " +
        "<h3>" + this.title + "</h3>"+
        "<p>Rapporterat: " + this.date + "</p>"+
        "<p>"+ this.description + "</p>"+
        "<p> detaljerad platsbeskrivning: "+ this.location +"</p>"+
        "<p>"+ this.category +"</p>"+
        "</div>";

    TrafficBoard.infoWindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
    });

    TrafficBoard.map.setZoom(10);

    TrafficBoard.infoWindow.open(TrafficBoard.map,this.marker)
}



};