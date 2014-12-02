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
                <div class='col-md-4 messageListDiv'>
                <div class='pull-right panel panel-info' >
                <div class='panel-heading'>
                <h4>Senast Inkomna Trafikrapporter</h4>
                <div id='categoryDiv'>
                <label>Välj kategori: </label>
                <select id='categorySelect' class='form-control'>
                    <option value='4'>Alla Trafikmeddelanden</option>
                    <option value='0'>Vägtrafik</option>
                    <option value='1'>Kollektivtrafik</option>
                    <option value='2'>Planerade Störningar</option>
                    <option value='3'>Övrigt</option>
                </select>
                </div>
                </div>
                <div id='messageList' class='panel-body '></div>
                </div>
                </div>
            ";
    }
} 