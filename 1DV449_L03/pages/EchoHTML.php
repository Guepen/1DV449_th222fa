<?php

require_once("./settings.php");

class EchoHTML {

    public function echoPage($body) {
        $settings = new Settings();
        $apiKey = $settings::$apiKey;
        echo "
				<!DOCTYPE html>
				<html>
				<head>
				 <meta name='viewport' content='width=device-width, initial-scale=1.0'>
				 <link rel='stylesheet' href='./css/styler.css'>
				<!-- Latest compiled and minified CSS -->
                <link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'>
                <!-- Optional theme -->
                <link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css'>

				<meta charset=\"utf-8\">
				<title>Trafikhjälpen</title>
				</head>
				<body>
				   <div class='container container-fluid' id='container'>
				   <div class='row'>
				        <div class='page-header'>
                            <h1>Trafikhjälpen
                                <small>Vi hjälper dig i trafiken!</small>
                            </h1>
				        </div>
				        </div>
				        <div class='row'>
				        <div class='col-md-12'>
				         <div class='alert alert-success '>
                    <a href='#' class='close' data-dismiss='alert'>&times;</a>
                     <h4>Tips!</h4>
                     <p>Tryck på en markör i kartan eller på en av länkarna i listan nere till vänster för att
                     få mer information om trafikmeddelandet</p>
                    </div>
                    </div>
                    </div>

                    $body

				   </div>
                    <script src='//code.jquery.com/jquery-1.11.0.min.js'></script>
                   <script src ='//maps.googleapis.com/maps/api/js?key=".$apiKey." '></script>
                  <!-- <script src='js/compressedAndObfuscated.js'></script> -->
                 <script src='js/compressedAndObfuscated.js'></script>
				</body>
				</html>";
    }


} 