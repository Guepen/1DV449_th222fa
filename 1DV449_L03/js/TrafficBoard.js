/**
 * Created by Tobias on 2014-12-01.
 */
var TrafficBoard = {
    init: function(){
        TrafficBoard.getTrafficPosts();
    },

    getTrafficPosts: function(){
        var request = $.ajax({
            "type": "GET",
            "url": "ajaxCalls/TrafficAlertsHandler.php",
            "dataType": "json",
            "data": {"mode": "getAlerts"}
        });

        request.success(function(data){
            var jsonData = $.parseJSON(data)
            console.log(jsonData["messages"]);
        });

        request.fail(function( xhr, textStatus){
            console.log(xhr, textStatus);
        })


    },

    renderTrafficAlert: function(trafficAlert){
        console.log(trafficAlert);
    }
};




window.onload = TrafficBoard.init;
