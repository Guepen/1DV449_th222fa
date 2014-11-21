<?php
require_once("./get.php");
require_once("./check.php");


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
    <link rel="apple-touch-icon" href="touch-icon-iphone.png">
    <link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
    <link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
    <link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
    <link rel="shortcut icon" href="./pic/favicon.png">
    <script src="./js/jquery.js"></script>
    <link rel="stylesheet" type="text/css" href="./css/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="./css/mess.css" />
    <script src="./Message.js"></script>
	<script type="text/javascript" src="./js/jquery.js"></script>
	<script type="text/javascript" src="./js/longpoll.js"></script>

	<script src="./MessageBoard.js"></script>
	<script src="./js/script.js"></script>


	<title>Messy Labbage</title>
  </head>

	  	<body background="http://www.lockley.net/backgds/big_leo_minor.jpg">

        <div id="container">

            <div id="messageboard">
            <form action="./index.php" method="post">
                <input class="btn btn-danger" name="logout" type="submit" value="Logout" style="margin-bottom: 20px;" />
            </form>
                <div id="messagearea"></div>

                <p id="numberOfMess">Antal meddelanden: <span id="nrOfMessages">0</span></p>

                <form id="formPostChat" method="post">
                Name:<br/>
                <input id="inputName" type="text" name="name" /><br/>
                 Message: <br />
                <textarea name="mess" id="inputText" cols="55" rows="6"></textarea>
                <input class="btn btn-primary" name="submitMess" type="submit" id="buttonSend" value="Write your message" />
                </form>
                <span class="clear">&nbsp;</span>


            </div>

        </div>

        <!-- This script is running to get the messages -->

			<script src="./js/bootstrap.js"></script>
	</body>
	</html>';

}









