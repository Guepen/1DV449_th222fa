<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-01
 * Time: 12:52
 */

require_once('pages/TrafficView.php');
require_once('pages/EchoHTML.php');
require_once("settings.php");

$trafficView = new TrafficView();
$echoHtml = new EchoHTML();
$echoHtml->echoPage($trafficView->getTrafficView());
