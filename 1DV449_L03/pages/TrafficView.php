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

                <div class='col-md-4 pull-left messageListDiv'>
                <div class='pull-left panel panel-info' >
                <div class='panel-heading'>
                <h4>Senast Inkomna Trafikrapporter</h4>
                <div id='categoryDiv'>
                <label>Välj kategori: </label>
                <select id='categorySelect' class='btn btn-primary'>
                    <option class='btn-default' value='4'>Alla Trafikmeddelanden</option>
                    <option  class='btn-default'value='0'>Vägtrafik</option>
                    <option  class='btn-default' value='1'>Kollektivtrafik</option>
                    <option class='btn-default' value='2'>Planerade Störningar</option>
                    <option class='btn-default' value='3'>Övrigt</option>
                </select>
                </div>
                </div>
                <div id='messageList' class='panel-body'></div>
                </div>
                </div>
                  <div class='col-md-8 map'>
                <div id='mapCanvas'></div>
                </div>
                <footer>
                <div class='col-md-5 page-header pull-left'>
                <h3><small>Producerad av <a href='//tobias-holst.se/' target='_blank'>@Tobias Holst</small></h3>
                <p class='lead'></p>
                </div>
                </footer>
            ";
    }
} 