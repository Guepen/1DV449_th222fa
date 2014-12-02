/**
 * Created by Tobias on 2014-12-01.
 */
var TrafficBoard = {
    swedenObj: undefined,
    map: undefined,
    infoWindow: undefined,
    activeInfoWindow: false,
    trafficMessages: [],

    init: function(){
        TrafficBoard.swedenObj = new Map(62.00, 15.00, 4);

        TrafficBoard.getTrafficPosts();
        TrafficBoard.renderMap();
    },

    renderMap: function(){
        var that = this;
        var mapOptions = {
            center: { lat: that.swedenObj.latitude, lng: that.swedenObj.longitude},
            zoom: that.swedenObj.zoom
        };
        TrafficBoard.map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
        TrafficBoard.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    },

    getTrafficPosts: function(){
        var request = $.ajax({
            "type": "GET",
            "url": "ajaxCalls/TrafficAlertsHandler.php",
            "dataType": "json",
            "data": {"mode": "getAlerts"}
        });

        request.success(function(data){
            var jsonData = $.parseJSON(data);
            var messages = jsonData["messages"];


            for(var i = 0; i < messages.length; i++){
                var message = new TrafficMessage(messages[i].createddate,
                    messages[i].title, messages[i].exactlocation,
                    messages[i].description, messages[i].subcategory,
                    messages[i].latitude, messages[i].longitude);

                TrafficBoard.trafficMessages.push(message);
                TrafficBoard.addMessageToList(TrafficBoard.trafficMessages.length -1);

                message.renderMarker();

            }
            TrafficBoard.renderCredit(jsonData["copyright"]);

        });

        request.fail(function( xhr, textStatus){
            console.log(xhr, textStatus);
        })

    },

    renderCredit: function(creditString){
        var messageListDiv = document.getElementById("messageList");
        var p = document.createElement("p");
        p.innerText = creditString;
        messageListDiv.insertBefore(p, messageListDiv.firstChild);
    },

    addMessageToList: function(messageId){
        var messageListDiv = document.getElementById("messageList");

        var title = this.trafficMessages[messageId].title;

        var div = document.createElement("div");

        var aTag = document.createElement("a");
        aTag.href = "#";
        aTag.innerHTML = title;

        div.appendChild(aTag);
        messageListDiv.insertBefore(div, messageListDiv.firstChild);

        var that = this;
        aTag.onclick = function(){
           that.trafficMessages[messageId].renderInfoWindow();
        }

    }
};




window.onload = TrafficBoard.init;
