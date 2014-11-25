<?php


function renderMessagePage(){

    echo '
            <!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="./pic/favicon.png">
    <link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="./css/mess.css" />



	<title>Messy Labbage</title>
  </head>

	  	<body>

        <div id="container">


            <div id="messageboard">
            <form method="post">
                <input id="logout" class="btn btn-danger logout" name="logout" type="submit" value="Logout"/>
            </form>
                <div id="messagearea"></div>

                <p id="numberOfMess">Antal meddelanden: <span id="nrOfMessages">0</span></p>

                <form id="formPostChat" method="post">
                <input id="token" type="hidden" class="hidden" value="'.$_SESSION['token'].'" />
                Name:<br/>
                <input id="inputName" type="text" name="name" /><br/>
                 Message: <br />
                <textarea name="mess" id="inputText" cols="55" rows="6"></textarea>
                <input class="btn btn-primary" name="submitMess" type="submit" id="buttonSend" value="Write your message" />
                </form>
                <span class="clear">&nbsp;</span>




        </div>


            <script src="./Message.js"></script>
	        <script type="text/javascript" src="./js/jquery-1.10.2.min.js"></script>
	        <script type="text/javascript" src="./js/longpoll.js"></script>
	        <script src="./MessageBoard.js"></script>

	</body>
	</html>';

}









