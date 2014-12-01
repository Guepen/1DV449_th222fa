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
				<!-- Latest compiled and minified CSS -->
                <link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'>

                <!-- Optional theme -->
                <link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css'>

				<meta charset=\"utf-8\">
				<title>TrafikInfo</title>
				</head>
				<body>
				   <div id='Container'>
                        <h1 class='center'>Trafikinformation</h1>
					$body
                   </div>
                     <script src='//code.jquery.com/jquery-1.11.0.min.js'></script>
                     <!-- Latest compiled and minified JavaScript -->
                    <script src='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'></script>
				</body>
				</html>";
    }


} 