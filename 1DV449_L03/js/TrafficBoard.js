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
            TrafficBoard.messagesToView();
        });

        //removes alert-box
        $(".close").click(function(){
            $(".alert").remove();
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
                if (data.messages !== undefined) {
                    var messages = data.messages;
                    TrafficBoard.createMessages(messages);
                    TrafficBoard.messagesToView();
                    TrafficBoard.renderCredit(data["copyright"]);
                }
             else{
                    TrafficBoard.renderErrorBox("Inga trafikmeddelande kunde tyvärr hämtas");
                }
            },

            error: function(){
                TrafficBoard.renderErrorBox("Det verkar som att Sveriges Radios API för tillfället ligger nere" +
               " vilket gör att vi tyvärr inte kan presentera några traffikmeddelanden");
            }
        });

    },

    renderErrorBox: function(errorMessage){
        var body = document.getElementById("container");
        var div = document.createElement("div");
        div.className = "alert alert-danger";

        var errorText = document.createElement("p");
        errorText.textContent = errorMessage;

        div.appendChild(errorText);
        body.insertBefore(div, body.firstChild);
    },

    createMessages: function(messages){
        messages.forEach(function(message){

            var newMessage = new TrafficMessage(
                message.createddate, message.category,
                message.title, message.exactlocation,
                message.description, message.subcategory,
                message.latitude, message.longitude);

            TrafficBoard.pushMessage(newMessage);
        })

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

        }
    },

    renderCredit: function(creditString){
        var messageListDiv = document.getElementById("categoryDiv");
        var p = document.createElement("p");
        p.textContent = creditString;
        messageListDiv.insertBefore(p, messageListDiv.firstChild);
    },

    messagesToView: function(){
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

            var li = document.createElement("li");
            ul.appendChild(li);

            var aTag = document.createElement("a");
            aTag.href = "#";
            aTag.textContent = title;

            li.appendChild(aTag);
            messageListDiv.insertBefore(li, messageListDiv.firstChild);

            TrafficBoard.swedenMap.addMarker(message, aTag);
        });
    }
};

window.onload = TrafficBoard.init;
