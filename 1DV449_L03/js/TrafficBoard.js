/**
 * Created by Tobias on 2014-12-01.
 */
var TrafficBoard = {
    swedenMap: undefined,
    trafficMessages: {"all":[], "roadTraffic": [], "publicTransport": [], "plannedInterference": [], "other": []},
    roadTrafficCategory: 0,
    publicTransportCategory: 1,
    plannedInterferenceCategory: 2,
    otherCategory: 3,
    allCategories: 4,

    init: function(){

        TrafficBoard.swedenMap = new Map(62.00, 15.00, 4);

        //eventListener for categorySelection
        $( "#categorySelect" ).change(function() {
            TrafficBoard.swedenMap.removeMarkers();
            TrafficBoard.swedenMap.map.setZoom(4);
            TrafficBoard.markers = [];
            $("#messageList").empty();
            TrafficBoard.messagesToAdd();
        });

        TrafficBoard.getTrafficPosts();
    },


    getTrafficPosts: function(){
        $.ajax({
            "type": "GET",
            "url": "ajaxCalls/TrafficAlertsHandler.php",
            "dataType": "json",
            "data": {"mode": "getAlerts"},
            success: function(data){

                if (data.result) {
                    var jsonData = data;
                    var messages = jsonData["messages"];
                    TrafficBoard.createMessages(messages);
                    TrafficBoard.messagesToAdd();
                    TrafficBoard.renderCredit(jsonData["copyright"]);
                }
            }
        });

    },

    createMessages: function(messages){
        for(var i = 0; i < messages.length; i++){

            var message = new TrafficMessage(
                messages[i].createddate, messages[i].category,
                messages[i].title, messages[i].exactlocation,
                messages[i].description, messages[i].subcategory,
                messages[i].latitude, messages[i].longitude);

            TrafficBoard.pushMessage(message);

        }

    },

    pushMessage: function(message){
        switch (message.category){
            case TrafficBoard.roadTrafficCategory:
                TrafficBoard.trafficMessages.roadTraffic.push(message);
                TrafficBoard.trafficMessages.all.push(message);
                break;
            case TrafficBoard.publicTransportCategory:
                TrafficBoard.trafficMessages.publicTransport.push(message);
                TrafficBoard.trafficMessages.all.push(message);
                break;
            case TrafficBoard.plannedInterferenceCategory:
                TrafficBoard.trafficMessages.plannedInterference.push(message);
                TrafficBoard.trafficMessages.all.push(message);
                break;
            case TrafficBoard.otherCategory:
                TrafficBoard.trafficMessages.other.push(message);
                TrafficBoard.trafficMessages.all.push(message);
                break;
            default :
                alert("inga meddelade kunde hämtas");
                break;

        }
    },

    renderCredit: function(creditString){
        var messageListDiv = document.getElementById("categoryDiv");
        var p = document.createElement("p");
        p.innerText = creditString;
        messageListDiv.insertBefore(p, messageListDiv.firstChild);
    },

    messagesToAdd: function(){
        switch (Number($("#categorySelect").val())){
            case TrafficBoard.allCategories:
                TrafficBoard.addMessageToList(TrafficBoard.trafficMessages.all);
                break;

            case TrafficBoard.roadTrafficCategory:
                TrafficBoard.addMessageToList(TrafficBoard.trafficMessages.roadTraffic);
                break;

            case TrafficBoard.publicTransportCategory:
                TrafficBoard.addMessageToList(TrafficBoard.trafficMessages.publicTransport);
                break;

            case TrafficBoard.plannedInterferenceCategory:
                TrafficBoard.addMessageToList(TrafficBoard.trafficMessages.plannedInterference);
                break;

            case TrafficBoard.otherCategory:
                TrafficBoard.addMessageToList(TrafficBoard.trafficMessages.other);
                break;
        }
    },

    addMessageToList: function(messageArray){

        var messageListDiv = document.getElementById("messageList");
        var ul = document.createElement("ul");

        messageArray.forEach(function(message){
            var title = message.title;
            var div = document.createElement("div");
            var li = document.createElement("li");
            ul.appendChild(li);

            var aTag = document.createElement("a");
            aTag.href = "#";
            aTag.innerText = title;

            li.appendChild(aTag);
            messageListDiv.insertBefore(li, messageListDiv.firstChild);

            TrafficBoard.swedenMap.addMarker(message, aTag);
        });
    }
};

window.onload = TrafficBoard.init;
