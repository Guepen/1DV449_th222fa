<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-01
 * Time: 13:07
 */

class EchoHTML {

    public function echoPage($body) {
        echo "
				<!DOCTYPE html>
				<html>
				<head>
				 <meta name='viewport' content='width=device-width, initial-scale=1.0'>
				<!-- Latest compiled and minified CSS -->
                <link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'>

                <!-- Optional theme -->
                <link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css'>

				<meta charset=\"utf-8\">
				<title>TrafikInfo</title>
				</head>
				<body>
				   <div class='container'>
				     <nav class='navbar navbar-inverse'>
                        <div class='container-fluid'>
                            <div class='navbar-header'>
                                <button type='button' class='navbar-toggle' data-toggle='collapse'
                                        data-target='#bs-example-navbar-collapse-9'>
                                    <span class='sr-only'>Toggle navigation</span>
                                    <span class='icon-bar'></span>
                                    <span class='icon-bar'></span>
                                    <span class='icon-bar'></span>
                                </button>
                            </div>
                            <div class='collapse navbar-collapse' id='bs-example-navbar-collapse-9'>
                                <ul class='nav navbar-nav'>
                                    <li><a href='#'>Hem</a></li>
                                    <li><a href='#'>Om Sidan</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <h1>Trafikinformation</h1>
                    $body

				   </div>
                    <script src='//code.jquery.com/jquery-1.11.0.min.js'></script>
                     <!-- Latest compiled and minified JavaScript -->
                    <script src='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'></script>
                    <script src='js/TrafficBoard.js'></script>
				</body>
				</html>";
    }


} 