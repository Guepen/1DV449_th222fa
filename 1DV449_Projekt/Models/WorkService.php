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
require_once('WebServices/IEniroWebService.php');
require_once('Job.php');

/**
 * Class WorkService
 */
class WorkService {
    private $repository;
    private $workService;
    private $eniroWorkService;

    public function __construct(IWorkRepository $repository, IArbetsformedlingWebService $workWebService,
                                IEniroWebService $enrioWorkService){
        $this->repository = $repository;
        $this->workService = $workWebService;
        $this->eniroWorkService = $enrioWorkService;
    }

    /**
     * @return array with provinces
     */
    public function getProvinces(){
        $provinces = $this->repository->find('provinces', null, null);
        if($provinces == null){
            $provinces = $this->workService->getProvinces();
            $provinces = json_decode($provinces, true);
            foreach($provinces['soklista']['sokdata'] as $key => $province){
                $this->repository->add('provinces', array('provinceId', 'namn', 'antal_platsannonser', 'nextUpdate') ,
                    array($province['id'], $province['namn'], $province['antal_platsannonser'], time() + strtotime("+1 hour")));
            }

           return $this->sendResponse($provinces['soklista']['sokdata']);
        } else {
            return $this->sendResponse($provinces);
        }
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
            if (isset($counties['soklista']['sokdata'])) {
                foreach ($counties['soklista']['sokdata'] as $key => $county) {
                    $this->repository->add('counties', array('countyId', 'provinceId', 'namn', 'antal_platsannonser', 'nextUpdate'),
                        array($county['id'], $provinceId,
                            $county['namn'], $county['antal_platsannonser'], time() + strtotime("+5 minutes")));
                }
                return $this->sendResponse($counties['soklista']['sokdata']);
            }
        } else {
           return $this->sendResponse($counties);
        }

        return $this->sendResponse(null);
    }

    /**
     * @return array
     */
    public function getOccupationAreas(){
        $occupationAreas = $this->repository->find("occupationareas", null, null);
        if($occupationAreas == null){
            $occupationAreas = $this->workService->getOccupationAreas();
            $occupationAreas = json_decode($occupationAreas, true);
            if (isset($occupationAreas['soklista']['sokdata'])) {
                foreach ($occupationAreas['soklista']['sokdata'] as $key => $occupationArea) {
                    $this->repository->add('occupationareas', array('occupationAreaId', 'namn', 'nextUpdate'),
                        array($occupationArea['id'], $occupationArea['namn'], time() + strtotime("+5 minutes")));
                }
                return $this->sendResponse(($occupationAreas['soklista']['sokdata']));
            }
        } else {
            return $this->sendResponse($occupationAreas);
        }
        return $this->sendResponse(null);
    }

    public function getJobs($countyId, $occupationAreaId){
        $jobs = $this->repository->findJobs($countyId, $occupationAreaId);
        if($jobs == null){
            $jobs = $this->workService->getJobs($countyId, $occupationAreaId);
            $jobs = json_decode($jobs, true);
            if (isset($jobs['matchningslista']['matchningdata'])) {
                foreach ($jobs['matchningslista']['matchningdata'] as $key => $job) {
                    $this->repository->add('jobs', array('countyId', 'occupationAreaId', 'annonsrubrik', 'yrkesbenamning',
                            'annonsid', 'nextUpdate'),
                        array($countyId, $occupationAreaId, $job['annonsrubrik'], $job['yrkesbenamning'], $job['annonsid']
                        , time() + strtotime("+1 hour")));
                }
                return $this->sendResponse($jobs['matchningslista']['matchningdata']);
            }
        } else {
            return $this->sendResponse($jobs);
        }
        return $this->sendResponse(null);
    }

    public function getJob($jobAdId){
        $job = $this->repository->find('jobads', 'annonsid', $jobAdId);
        if($job == null){
            $job = ($this->workService->getJob($jobAdId));
            $job = json_decode($job, true);

            if (isset($job['platsannons']['annons']['annonsid'])) {
                if (isset($job['platsannons']['ansokan']['webbplats']) == false) {
                    $website = "saknas";
                } else {
                    $website = $job['platsannons']['ansokan']['webbplats'];
                }

                $job = new Job($job['platsannons']['annons']['annonsrubrik'], $job['platsannons']['annons']['annonstext'],
                    $job['platsannons']['annons']['publiceraddatum'], $job['platsannons']['annons']['antal_platser'],
                    $job['platsannons']['annons']['kommunnamn'], $job['platsannons']['arbetsplats']['arbetsplatsnamn'],
                    $job['platsannons']['villkor']['arbetstidvaraktighet'], $job['platsannons']['villkor']['arbetstid'],
                    $job['platsannons']['villkor']['lonetyp'], $job['platsannons']['annons']['yrkesbenamning'],
                    $website, $job['platsannons']['annons']['annonsid']);

                //todo: companyInformation should be an own function and table
                $companyInformation = json_decode($this->eniroWorkService->getCompanyInformation($job->getArbetsplatsnamn(),
                    $job->getKommunnamn()), true);

                if (isset($companyInformation['adverts'][0]['facebook'])) {
                    $facebook = $companyInformation['adverts'][0]['facebook'];
                } else {
                    $facebook = 'saknas';
                }

                $streetName = $this->checkValue($companyInformation['adverts'], 'streetName');
                $postCode = $this->checkValue($companyInformation['adverts'], 'postCode');
                $postArea = $this->checkValue($companyInformation['adverts'], 'postArea');

                $this->repository->add('jobads', array('annonsrubrik', 'annonstext', 'publiceraddatum', 'antal_platser', 'kommunnamn',
                        'arbetsplatsnamn', 'arbetstidvaraktighet', 'arbetstid', 'lonetyp', 'yrkesbenamning', 'webbplats', 'annonsid',
                        'nextUpdate', 'facebook', 'streetName', 'postCode', 'postArea'),

                    array($job->getAnnonsrubrik(), $job->getAnnonstext(), $job->getPubliceraddatum(), $job->getAntalPlatser(),
                        $job->getKommunnamn(), $job->getArbetsplatsnamn(), $job->getArbetstidvaraktighet(), $job->getArbetstid(),
                        $job->getLonetyp(), $job->getYrkesbenamning(), $job->getWebbplats(), $job->getAnnonsid(),
                        time() + strtotime("+1 hour"), $facebook, $streetName, $postCode, $postArea));

                return array(
                    'annonsrubrik' => $job->getAnnonsrubrik(),
                    'annonstext' => $job->getAnnonstext(),
                    'publiceraddatum' => $job->getPubliceraddatum(),
                    'antal_platser' => $job->getAntalPlatser(),
                    'kommunnamn' => $job->getKommunnamn(),
                    'arbetsplatsnamn' => $job->getArbetsplatsnamn(),
                    'arbetstidvaraktighet' => $job->getArbetstidvaraktighet(),
                    'arbetstid' => $job->getArbetstid(),
                    'lonetyp' => $job->getLonetyp(),
                    'yrkesbenamning' => $job->getYrkesbenamning(),
                    'webbplats' => $job->getWebbplats(),
                    'annonsid' => $job->getAnnonsid(),
                    'facebook' => $facebook,
                    'streetName' => $streetName,
                    'postCode' => $postCode,
                    'postArea' => $postArea
                );
            }

            return $this->sendResponse(null);

        }
        return
            array(
                'annonsrubrik' => $job[0]['annonsrubrik'],
                'annonstext' => $job[0]['annonstext'],
                'publiceraddatum' => $job[0]['publiceraddatum'],
                'antal_platser' => $job[0]['antal_platser'],
                'kommunnamn' => $job[0]['kommunnamn'],
                'arbetsplatsnamn' => $job[0]['arbetsplatsnamn'],
                'arbetstidvaraktighet' => $job[0]['arbetstidvaraktighet'],
                'arbetstid' => $job[0]['arbetstid'],
                'lonetyp' => $job[0]['lonetyp'],
                'yrkesbenamning' => $job[0]['yrkesbenamning'],
                'webbplats' => $job[0]['webbplats'],
                'annonsid' => $job[0]['annonsid'],
                'facebook' => $job[0]['facebook'],
                'streetName' => $job[0]['streetName'],
                'postCode' => $job[0]['postCode'],
                'postArea' => $job[0]['postArea']
            );
    }

    private function checkValue($value, $propertyName){
        if(isset($value[0]['address'][$propertyName])){
            return $value[0]['address'][$propertyName];
        }
        return 'saknas';
    }

    /**
     * @param $response
     * @return array
     */
    private function sendResponse($response){

        if($response == null){
            return array(
                'error' => true
            );
        } else{
           return $response;
        }
    }

} 