<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-01
 * Time: 13:13
 */

class TrafficView {

    public function getTrafficView(){
        return "
                <div class='col-md-8 map'>
                <div id='mapCanvas'></div>
                </div>
                <div class='col-md-4'>
                <div class='pull-right panel panel-info' >
                <div class='panel-heading'>Senast Inkomna Trafikrapporter</div>
                <div id='messageList' class='panel-body '></div>
                </div>
                </div>
            ";
    }
} 