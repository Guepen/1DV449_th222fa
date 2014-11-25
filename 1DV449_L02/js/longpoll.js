/**
 * Created by Tobias on 2014-11-20.
 */
function MessageHandler(){

    this.getNewMessages = function(callback, lastTime) {
        var latest = null;

        var that = this;
        $.ajax({
            type: "POST",
            url: "messagehandler.php",
            dataType: 'json',
            data: {mode: 'get', numberOfMessages: MessageBoard.messages.length, latestMessageTime: lastTime},
            timeout: 30000,
            cache: false,
            success: function (data) {
                if (data.result) {
                    callback(data.message);
                    latest = data["latest"];
                }
            },

            complete: function () {
                that.getNewMessages(callback, latest);
            }


        })

    };

    this.postMessage = function(user, message){
        $.ajax({
            url: 'messagehandler.php',
            type: 'POST',
            dataType: 'json',
            data: {
                mode: 'post',
                user: user,
                message: message,
                token: $('#token').val()
            },

            success: function(data){
                console.log(data);
                if(data.result == false)
                alert(data.output);

            }
        });
    };
}

var messageHandler = new MessageHandler();
