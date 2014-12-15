<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 10:43
 */

require_once('Repositories/IWorkRepository.php');
require_once('WebServices/arbetsformedlingenWebService/IArbetsformedlingWebService.php');
require_once('Repositories/WorkRepository.php');
require_once('WebServices/arbetsformedlingenWebService/ArbetsformedlingenWebService.php');

new WorkService(new WorkRepository(), new ArbetsformedlingenWebService());

/**
 * Class WorkService
 */
class WorkService {
    private $repository;
    private $workService;

    public function __construct(IWorkRepository $repository, IArbetsformedlingWebService $workService){
        $this->repository = $repository;
        $this->workService = $workService;

        $mode = $this->fetch('mode');
        //todo:this should be in a controller
        switch($mode){
            case 'getProvinces':
                $this->getProvinces();
                break;
            case 'getCounties':
                $this->getCounties();
        }
    }

    private function getProvinces(){
        $provinces = $this->repository->find('provinces', null, null);
        if($provinces == null){
            $this->removeProvinces();
            $provinces = $this->workService->getProvinces();
            $array = json_decode($provinces, true);
            foreach($array['soklista']['sokdata'] as $key => $province){
                $this->repository->add('provinces', array('id', 'namn', 'antal_platsannonser') ,array($province['id'], $province['namn'],
                    $province['antal_platsannonser']));
            }

            $this->sendResponse($provinces);
        } else {
            $this->sendResponse($provinces);
        }
    }

    private function removeProvinces(){
        $this->repository->remove('provinces');
    }

    private function getCounties(){
        $provinceId = $this->fetch('provinceId');
        $counties = $this->repository->find('counties', 'provinceId', $provinceId);
        if($counties == null){
            $counties = $this->workService->getCounties($provinceId);
            $array = json_decode($counties, true);
            foreach($array['soklista']['sokdata'] as $key => $county){
                $this->repository->add('counties', array('id', 'provinceId', 'namn', 'antal_platsannonser') ,
                    array($county['id'], $provinceId,
                    $county['namn'], $county['antal_platsannonser']));
            }
            $this->sendResponse($counties);
        } else {
            $this->sendResponse($counties);
        }
    }

    /**
     * @param $name string
     * @return mixed
     */
    private function fetch($name){
        $val = isset($_POST[$name]) ? $_POST[$name] : 0;
        return ($val);
    }

    /**
     * @param $response string
     */
    private function sendResponse($response){

        if($response == null){
            echo json_encode(array(
                'error' => 'Ett fel inträffade'
            ));
        } else{
           echo json_encode($response);
        }
    }

} 