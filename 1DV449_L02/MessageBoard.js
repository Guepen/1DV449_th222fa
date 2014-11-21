var MessageBoard = {

    messages: [],
    textField: null,
    messageArea: null,

    init:function(e) {

        MessageBoard.textField = document.getElementById("inputText");
        MessageBoard.nameField = document.getElementById("inputName");
        MessageBoard.messageArea = document.getElementById("messagearea");

        // Add eventhandlers
        document.getElementById("inputText").onfocus = function (e) {
            this.className = "focus";
        };
        document.getElementById("inputText").onblur = function (e) {
            this.className = "blur"
        };
        document.getElementById("buttonSend").onclick = function (e) {
            MessageBoard.sendMessage();
        };

        MessageBoard.textField.onkeypress = function (e) {
            if (!e) var e = window.event;

            if (e.keyCode == 13 && !e.shiftKey) {
                MessageBoard.sendMessage();

                return false;
            }
        };

        MessageBoard.getMessages();
    },

    getMessages: function(){
        messageHandler.getMessage(function(messages){
            console.log(messages);
            for(var i = 0; i < messages.length; i++) {
                console.log(messages[i].msgTime);
                var text = messages[i].name +" said:\n" +messages[i].message;
                var message = new Message(text, new Date(messages[i].msgTime));
                MessageBoard.messages.push(message);
                var messageID = MessageBoard.messages.length - 1;

                MessageBoard.renderMessage(messageID);

            }
            document.getElementById("nrOfMessages").innerHTML = MessageBoard.messages.length;
        });
    },

    sendMessage: function(){
        $('#formPostChat').submit(function (e) {
            MessageBoard.textField.innerHTML = "";
            MessageBoard.nameField.innerHTML = "";
            e.preventDefault();
            var user = $('#inputName');
            var text = $('#inputText');
            messageHandler.postMessage(user.val(), text.val());

        });
    },

    renderMessage: function(messageID){
        // Message div
        var div = document.createElement("div");
        div.className = "message";
       
        // Clock button
        aTag = document.createElement("a");
        aTag.href="#";
        aTag.onclick = function(){
			MessageBoard.showTime(messageID);
			return false;			
		}
        
        var imgClock = document.createElement("img");
        imgClock.src="pic/clock.png";
        imgClock.alt="Show creation time";
        
        aTag.appendChild(imgClock);
        div.appendChild(aTag);
       
        // Message text
        var text = document.createElement("p");
        console.log( MessageBoard.messages);
        text.innerHTML = MessageBoard.messages[messageID].getHTMLText();        
        div.appendChild(text);
            
        // Time - Should fix on server!
        var spanDate = document.createElement("span");
        spanDate.appendChild(document.createTextNode(MessageBoard.messages[messageID].getDateText()))

        div.appendChild(spanDate);        
        
        var spanClear = document.createElement("span");
        spanClear.className = "clear";

        div.appendChild(spanClear);        
        
        MessageBoard.messageArea.insertBefore(div, MessageBoard.messageArea.firstChild);
    },
    removeMessage: function(messageID){
		if(window.confirm("Vill du verkligen radera meddelandet?")){
        
			MessageBoard.messages.splice(messageID,1); // Removes the message from the array.
        
			MessageBoard.renderMessages();
        }
    },
    showTime: function(messageID){
         
         var time = MessageBoard.messages[messageID].getDate();
         
         var showTime = "Created "+time.toLocaleDateString()+" at "+time.toLocaleTimeString();

         alert(showTime);
    }

};

window.onload = MessageBoard.init;