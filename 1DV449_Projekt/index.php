<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-01
 * Time: 12:52
 */

require_once("h2o-php/h2o.php");

$templateEngine = new h2o('templates/index.html');

echo $templateEngine->render();