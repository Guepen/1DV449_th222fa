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
require_once('Job.php');

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
        $jobs = $this->repository->findJobs($countyId, $occupationAreaId);
        if($jobs == null){
            //todo: check if there is any jobs
            $jobs = $this->workService->getJobs($countyId, $occupationAreaId);
            $jobs = json_decode($jobs, true);
            foreach($jobs['matchningslista']['matchningdata'] as $key => $job){
                $this->repository->add('jobs', array('countyId', 'occupationAreaId', 'annonsrubrik', 'yrkesbenamning',
                        'annonsid', 'nextUpdate'),
                    array($countyId, $occupationAreaId,$job['annonsrubrik'], $job['yrkesbenamning'], $job['annonsid']
                    , time() + strtotime("+5 minutes")));
            }
            return $this->sendResponse($jobs['matchningslista']['matchningdata']);
        } else {
            return $this->sendResponse($jobs);
        }
    }

    public function getJob($jobAdId){
        $job = $this->repository->find('jobads', 'annonsid', $jobAdId);
        if($job == null){
            $job = ($this->workService->getJob($jobAdId));
            $job = json_decode($job, true);

            $job = new Job($job['platsannons']['annons']['annonsrubrik'], $job['platsannons']['annons']['annonstext'],
                $job['platsannons']['annons']['publiceraddatum'], $job['platsannons']['annons']['antal_platser'],
                $job['platsannons']['annons']['kommunnamn'], $job['platsannons']['villkor']['arbetstidvaraktighet'],
                $job['platsannons']['villkor']['arbetstid'], $job['platsannons']['villkor']['lonetyp'],
                $job['platsannons']['annons']['yrkesbenamning'], $job['platsannons']['ansokan']['webbplats'],
                $job['platsannons']['annons']['annonsid']);

            $this->repository->add('jobads', array('annonsrubrik', 'annonstext', 'publiceraddatum', 'antal_platser', 'kommunnamn',
                    'arbetstidvaraktighet', 'arbetstid', 'lonetyp', 'yrkesbenamning', 'webbplats', 'annonsid', 'nextUpdate'),

                array($job->getAnnonsrubrik(), $job->getAnnonstext(), $job->getPubliceraddatum(), $job->getAntalPlatser(),
                    $job->getKommunnamn(), $job->getArbetstidvaraktighet(), $job->getArbetstid(), $job->getLonetyp(),
                    $job->getYrkesbenamning(), $job->getWebbplats(), $job->getAnnonsid()));

            return array(
                'annonsrubrik' => $job->getAnnonsrubrik(),
                'annonstext' => $job->getAnnonstext(),
                'publiceraddatum' => $job->getPubliceraddatum(),
                'antal_platser' => $job->getAntalPlatser(),
                'kommunnamn' => $job->getKommunnamn(),
                'arbetstidvaraktighet' => $job->getArbetstidvaraktighet(),
                'arbetstid' => $job->getArbetstid(),
                'lonetyp' => $job->getLonetyp(),
                'yrkesbenamning' => $job->getYrkesbenamning(),
                'webbplats' => $job->getWebbplats(),
                'annonsid' => $job->getAnnonsid()
            );

        }
        return
            array(
                'annonsrubrik' => $job[0]['annonsrubrik'],
                'annonstext' => $job[0]['annonstext'],
                'publiceraddatum' => $job[0]['publiceraddatum'],
                'antal_platser' => $job[0]['antal_platser'],
                'kommunnamn' => $job[0]['kommunnamn'],
                'arbetstidvaraktighet' => $job[0]['arbetstidvaraktighet'],
                'arbetstid' => $job[0]['arbetstid'],
                'lonetyp' => $job[0]['lonetyp'],
                'yrkesbenamning' => $job[0]['yrkesbenamning'],
                'webbplats' => $job[0]['webbplats'],
                'annonsid' => $job[0]['annonsid']
            );
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