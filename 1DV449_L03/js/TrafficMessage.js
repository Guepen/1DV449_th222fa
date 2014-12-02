/**
 * Created by Tobias on 2014-12-01.
 */

function TrafficMessage(dateTime, category, title, location, description, categoryText, latitude, longitude, marker){
    this.date = new Date(parseInt(dateTime.replace("/Date(", "").replace(")/",""), 10));
    this.title = title;
    this.location = location;
    this.description = description;
    this.category = category;
    this.categoryText = categoryText;
    this.latitude = latitude;
    this.longitude = longitude;
    this.marker = marker;

}

TrafficMessage.prototype.getDate = function(){
    var year = this.date.getFullYear();
    var month = (this.date.getMonth() + 1);
    var date = this.date.getDate();
    var hour = this.date.getHours();
    var minute = this.date.getMinutes();

    return year + "-" + month + "-" + date + "  " + hour + ":" + minute;
};

TrafficMessage.prototype.addMarker = function() {
    var latLng = new google.maps.LatLng(this.latitude, this.longitude);
    var that = this;
    this.marker = new google.maps.Marker({
        position: latLng,
        map: TrafficBoard.map
    });

    TrafficBoard.markers.push(this.marker);
    google.maps.event.addListener(this.marker, 'click', function () {
        that.renderInfoWindow(that.marker);
    });
};


TrafficMessage.prototype.renderInfoWindow = function(){
    if (TrafficBoard.infoWindow !== undefined) {
        TrafficBoard.infoWindow.close();
    }
    var contentString = "<div class='content'> " +
        "<h3>" + this.title + "</h3>"+
        "<h4>"+ this.categoryText+"</h4>"+
        "<p>Rapporterat: " + this.getDate() + "</p>"+
        "<p>"+ this.description + "</p>"+
        "<p> detaljerad platsbeskrivning: "+ this.location +"</p>"+
        "</div>";

    TrafficBoard.infoWindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
    });

    TrafficBoard.map.setZoom(10);

    TrafficBoard.infoWindow.open(TrafficBoard.map,this.marker)
};

