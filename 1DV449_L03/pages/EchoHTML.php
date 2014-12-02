<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-01
 * Time: 13:07
 */

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
				   <div class='container' id='container'>
				        <div class='page-header'>
                            <h1>Trafikhjälpen
                                <small>Vi hjälper dig i trafiken!</small>
                            </h1>
				        </div>
				         <div class='alert alert-success'>
                    <a href='#' class='close' data-dismiss='alert'>&times;</a>
                     <h4>Tips!</h4>
                     <p>Tryck på en markör i kartan eller på en av länkarna i listan nere till höger för att
                     få mer information om trafikmeddelandet</p>
                    </div>

                    $body

				   </div>
                    <script src='//code.jquery.com/jquery-1.11.0.min.js'></script>
                     <!-- Latest compiled and minified JavaScript -->
                    <script src='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'></script>
                    <script src ='https://maps.googleapis.com/maps/api/js?key=".$apiKey." '></script>
                     <script src='js/TrafficMessage.js'></script>
                      <script src='js/Map.js'></script>
                    <script src='js/TrafficBoard.js'></script>
				</body>
				</html>";
    }


} 