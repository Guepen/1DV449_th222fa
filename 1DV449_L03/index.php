<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-01
 * Time: 12:52
 */
require_once('pages/TrafficView.php');
require_once('pages/EchoHTML.php');
include('../vendor\rmccue\requests\library\Requests.php');

Requests::register_autoloader();

$trafficView = new TrafficView();
$echoHtml = new EchoHTML();
$echoHtml->echoPage($trafficView->getTrafficView());
