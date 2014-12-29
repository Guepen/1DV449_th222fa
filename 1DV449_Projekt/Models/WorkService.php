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

//new WorkService(new WorkRepository(), new ArbetsformedlingenWebService());

/**
 * Class WorkService
 */
class WorkService {
    private $repository;
    private $workService;

    public function __construct(IWorkRepository $repository, IArbetsformedlingWebService $workWebService){
        $this->repository = $repository;
        $this->workService = $workWebService;
    }

    /**
     * @return array with provinces
     */
    public function getProvinces(){
        $provinces = $this->repository->find('provinces', null, null);
        if($provinces == null){
            $this->removeProvinces();
            $provinces = $this->workService->getProvinces();
            $provinces = json_decode($provinces, true);
            foreach($provinces['soklista']['sokdata'] as $key => $province){
                $this->repository->add('provinces', array('provinceId', 'namn', 'antal_platsannonser', 'nextUpdate') ,
                    array($province['id'], $province['namn'], $province['antal_platsannonser'], time() + strtotime("+5 minutes")));
            }

           return $this->sendResponse($provinces['soklista']['sokdata']);
        } else {
            return $this->sendResponse($provinces);
        }
    }

    public  function removeProvinces(){
        $this->repository->remove('provinces');
    }

    /**
     * @param $provinceId
     * @return array with counties in a province
     */
    public function getCounties($provinceId){
        $counties = $this->repository->find('counties', 'provinceId', $provinceId);
        if($counties == null){
            $counties = $this->workService->getCounties($provinceId);
            $counties = json_decode($counties, true);
            foreach($counties['soklista']['sokdata'] as $key => $county){
                $this->repository->add('counties', array('countyId', 'provinceId', 'namn', 'antal_platsannonser', 'nextUpdate') ,
                    array($county['id'], $provinceId,
                    $county['namn'], $county['antal_platsannonser'], time() + strtotime("+5 minutes")));
            }
            return $this->sendResponse($counties['soklista']['sokdata']);
        } else {
           return $this->sendResponse($counties);
        }
    }

    /**
     * @return array
     */
    public function getOccupationAreas(){
        $occupationAreas = $this->repository->find("occupationareas", null, null);
        if($occupationAreas == null){
            $occupationAreas = $this->workService->getOccupationAreas();
            $occupationAreas = json_decode($occupationAreas, true);
            foreach($occupationAreas['soklista']['sokdata'] as $key => $occupationArea){
                $this->repository->add('occupationareas', array('occupationAreaId', 'namn', 'nextUpdate') ,
                    array($occupationArea['id'], $occupationArea['namn'], time() + strtotime("+5 minutes")));
            }
            return $this->sendResponse(($occupationAreas['soklista']['sokdata']));
        } else {
            return $this->sendResponse($occupationAreas);
        }
    }

    public function getJobs($countyId, $occupationAreaId){
        $jobs = $this->repository->find("jobs", null, null);
        if($jobs == null){
            $jobs = $this->workService->getJobs($countyId, $occupationAreaId);
            $jobs = json_decode($jobs, true);
            foreach($jobs['matchningslista']['matchningdata'] as $key => $job){
                $this->repository->add('jobs', array('countyId', 'occupationAreaId', 'annonsrubrik', 'yrkesbenamning',
                        'arbetsplatsnamn', 'kommunnamn', 'publiceraddatum', 'antalplatser', 'nextUpdate'),
                    array($countyId, $occupationAreaId,$job['annonsrubrik'], $job['yrkesbenamning'], $job['arbetsplatsnamn'],
                        $job['kommunnamn'], $job['publiceraddatum'], $job['antalplatser'], time() + strtotime("+5 minutes")));
            }
            return $this->sendResponse($jobs['matchningslista']['matchningdata']);
        } else {
            return $this->sendResponse($jobs);
        }
    }

    /**
     * @param $response
     * @return array
     */
    private function sendResponse($response){

        if($response == null){
            return array(
                'error' => 'Ett fel inträffade'
            );
        } else{
           return $response;
        }
    }

} 