/**
 * Created by Tobias on 2014-11-20.
 */
function MessageHandler(){

    this.getMessage = function(callback) {
        var that = this;
        $.ajax({
            type: "POST",
            url: "messagehandler.php",
            dataType: 'json',
            data: {mode: 'get', numberOfMessages: MessageBoard.messages.length},
            timeout: 5000,
            cache: false,
            success : function(data){
                console.log(data);
                if(data.result){
                    callback(data.message);
                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest);
            },
            complete: function(){
                setTimeout(function(){
                    that.getMessage(callback);
                },500)

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
                message: message
            },
            complete: function(data){
              if(data.result == false){
                  alert(data.output);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest.HEADERS_RECEIVED + "error: " + textStatus + "(" + errorThrown + ")");
            }
        });
    };
}

var messageHandler = new MessageHandler();
