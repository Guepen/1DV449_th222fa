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
require_once('JobAd.php');
require_once('CompanyInformation.php');
require_once('Job.php');

/**
 * Class WorkService
 */
class WorkService {
    private $repository;
    private $jobWebService;
    private $eniroWebService;

    public function __construct(IWorkRepository $repository, IArbetsformedlingWebService $workWebService,
                                IEniroWebService $enrioWorkService){
        $this->repository = $repository;
        $this->jobWebService = $workWebService;
        $this->eniroWebService = $enrioWorkService;
    }

    /**
     * @return array with provinces
     */
    public function getProvinces(){
        $provinces = $this->repository->find('provinces', null, null);
        if($provinces == null){
            //delete expired data
            $this->repository->remove("provinces");

            $provinces = $this->jobWebService->getProvinces();
            $provinces = json_decode($provinces, true);
            if (isset($provinces['soklista']['sokdata'])) {
                foreach ($provinces['soklista']['sokdata'] as $key => $province) {
                    $this->repository->add('provinces', array('provinceId', 'namn', 'antal_platsannonser', 'nextUpdate'),
                        array($this->checkForTags($province['id']), $this->checkForTags($province['namn']),
                            $this->checkForTags($province['antal_platsannonser']), strtotime("+1 week")));
                }

                return $this->sendResponse($provinces['soklista']['sokdata']);
            }
        } else {
            return $this->sendResponse($provinces);
        }
        return $this->sendResponse(null);
    }

    /**
     * @param $provinceId
     * @return array with counties in a province
     */
    public function getCounties($provinceId){
        $counties = $this->repository->find('counties', 'provinceId', $provinceId);
        if($counties == null){
            //delete expired data
            $this->repository->removeCounties($provinceId);

            //get new data
            $counties = $this->jobWebService->getCounties($provinceId);
            $counties = json_decode($counties, true);

            //check if we have expected data
            if (isset($counties['soklista']['sokdata'])) {
                foreach ($counties['soklista']['sokdata'] as $key => $county) {

                    //add new data to db
                    $this->repository->add('counties', array('countyId', 'provinceId', 'namn',
                            'antal_platsannonser', 'nextUpdate'),
                        array($this->checkForTags($county['id']), $provinceId, $this->checkForTags($county['namn']),
                            $this->checkForTags($county['antal_platsannonser']), strtotime("+1 week")));
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
            //delete expired data
            $this->repository->remove("occupationareas");

            $occupationAreas = $this->jobWebService->getOccupationAreas();
            //decodes the json so the data can be used in the code
            $occupationAreas = json_decode($occupationAreas, true);

            //check if we have expected data
            if (isset($occupationAreas['soklista']['sokdata'])) {
                foreach ($occupationAreas['soklista']['sokdata'] as $key => $occupationArea) {
                    //add new data to db
                    $this->repository->add('occupationareas', array('occupationAreaId', 'namn', 'nextUpdate'),
                        array($this->checkForTags($occupationArea['id']),
                            $this->checkForTags($occupationArea['namn']), strtotime("+1 week")));
                }
                return $this->sendResponse(($occupationAreas['soklista']['sokdata']));
            }
        } else {
            return $this->sendResponse($occupationAreas);
        }
        return $this->sendResponse(null);
    }

    public function getJobs($countyId, $occupationAreaId)
    {
        $jobs = $this->repository->findJobs($countyId, $occupationAreaId);
        if ($jobs == null) {
            $this->repository->removeJobs($countyId, $occupationAreaId); //delete the expired data

            $jobs = $this->jobWebService->getJobs($countyId, $occupationAreaId);
            $jobs = json_decode($jobs, true); //decodes the json so the data can be used in the code

            //check if we have expected data
            if (isset($jobs['matchningslista']['matchningdata'])) {
                foreach ($jobs['matchningslista']['matchningdata'] as $key => $job) {
                    $job = $this->createNewJob($job);
                    //add new data to db
                    $this->repository->add('jobs', array('countyId', 'occupationAreaId', 'annonsrubrik',
                            'yrkesbenamning', 'annonsid', 'nextUpdate'),
                        array($countyId, $occupationAreaId, $job->getJobHeader(), $job->getJobAdId(),
                            $job->getJobName(), strtotime("+1 hour")));
                }
                return $this->sendResponse($jobs['matchningslista']['matchningdata']);

            } else {
                return $this->sendResponse(null);

            }
        }
        return $this->sendResponse($jobs);
    }

    private function createNewJob($job){
        return new Job($this->checkForTags($job['annonsid']), $this->checkForTags($job['annonsrubrik']),
            $this->checkForTags($job['yrkesbenamning']));
    }

    public function getJobAd($jobAdId){
        $jobAd = $this->repository->find('jobads', 'annonsid', $jobAdId);
        if($jobAd == null){
            $this->repository->removeJobAd($jobAdId); //delete the expired data

            $jobAd = $this->jobWebService->getJob($jobAdId);
            $jobAd = json_decode($jobAd, true); //decodes the json so the data can be used in the code

            //check if we have expected data
            if (isset($jobAd['platsannons']['annons']['annonsid'])) {
                $jobAd = $this->createNewJobAd($jobAd);
                $companyInformation = $this->getCompanyInformation($jobAd);

                $this->repository->add('jobads', array('annonsrubrik', 'annonstext', 'publiceraddatum', 'antal_platser', 'kommunnamn',
                        'arbetsplatsnamn', 'arbetstidvaraktighet', 'arbetstid', 'lonetyp', 'yrkesbenamning', 'webbplats', 'annonsid',
                        'nextUpdate', 'facebook', 'streetName', 'postCode', 'postArea'),

                    array($jobAd->getAnnonsrubrik(), $jobAd->getAnnonstext(), $jobAd->getPubliceraddatum(), $jobAd->getAntalPlatser(),
                        $jobAd->getKommunnamn(), $jobAd->getArbetsplatsnamn(), $jobAd->getArbetstidvaraktighet(), $jobAd->getArbetstid(),
                        $jobAd->getLonetyp(), $jobAd->getYrkesbenamning(), $jobAd->getWebbplats(), $jobAd->getAnnonsid(),
                        strtotime("+1 hour"), $companyInformation->getFacebook(), $companyInformation->getStreetName(),
                        $companyInformation->getPostCode(), $companyInformation->getPostArea()));

                return $this->returnNewJobAd($jobAd, $companyInformation);

            }
            //nothing to return
            return $this->sendResponse(null);

        }
        return $this->returnCachedJobAd($jobAd);
    }

    private function getCompanyInformation($jobAd){
        $companyInformation = json_decode($this->eniroWebService->getCompanyInformation($jobAd->getArbetsplatsnamn(),
            $jobAd->getKommunnamn()), true);

        return $this->createNewCompanyInformation($companyInformation);
    }

    private function returnNewJobAd($jobAd, $companyInformation){
        return array(
            'annonsrubrik' => $jobAd->getAnnonsrubrik(),
            'annonstext' => $jobAd->getAnnonstext(),
            'publiceraddatum' => $jobAd->getPubliceraddatum(),
            'antal_platser' => $jobAd->getAntalPlatser(),
            'kommunnamn' => $jobAd->getKommunnamn(),
            'arbetsplatsnamn' => $jobAd->getArbetsplatsnamn(),
            'arbetstidvaraktighet' => $jobAd->getArbetstidvaraktighet(),
            'arbetstid' => $jobAd->getArbetstid(),
            'lonetyp' => $jobAd->getLonetyp(),
            'yrkesbenamning' => $jobAd->getYrkesbenamning(),
            'webbplats' => $jobAd->getWebbplats(),
            'annonsid' => $jobAd->getAnnonsid(),
            'facebook' => $companyInformation->getFacebook(),
            'streetName' => $companyInformation->getStreetName(),
            'postCode' => $companyInformation->getPostCode(),
            'postArea' => $companyInformation->getPostArea()
        );
    }

    private function returnCachedJobAd($jobAd){
        return
            array(
                'annonsrubrik' => $jobAd[0]['annonsrubrik'],
                'annonstext' => $jobAd[0]['annonstext'],
                'publiceraddatum' => $jobAd[0]['publiceraddatum'],
                'antal_platser' => $jobAd[0]['antal_platser'],
                'kommunnamn' => $jobAd[0]['kommunnamn'],
                'arbetsplatsnamn' => $jobAd[0]['arbetsplatsnamn'],
                'arbetstidvaraktighet' => $jobAd[0]['arbetstidvaraktighet'],
                'arbetstid' => $jobAd[0]['arbetstid'],
                'lonetyp' => $jobAd[0]['lonetyp'],
                'yrkesbenamning' => $jobAd[0]['yrkesbenamning'],
                'webbplats' => $jobAd[0]['webbplats'],
                'annonsid' => $jobAd[0]['annonsid'],
                'facebook' => $jobAd[0]['facebook'],
                'streetName' => $jobAd[0]['streetName'],
                'postCode' => $jobAd[0]['postCode'],
                'postArea' => $jobAd[0]['postArea']
            );
    }

    private function createNewCompanyInformation($companyInformation){
        return new CompanyInformation($this->checkForTags($companyInformation['adverts'][0]['facebook']),
            $this->checkForTags($companyInformation['adverts'][0]['address']['postArea']),
            $this->checkForTags($companyInformation['adverts'][0]['address']['postCode']),
            $this->checkForTags($companyInformation['adverts'][0]['address']['streetName']));
    }

    private function createNewJobAd($job){
        return new JobAd($this->checkForTags($job['platsannons']['annons']['annonsrubrik']),
            $this->checkForTags($job['platsannons']['annons']['annonstext']),
            $this->checkForTags($job['platsannons']['annons']['publiceraddatum']),
            $this->checkForTags($job['platsannons']['annons']['antal_platser']),
            $this->checkForTags($job['platsannons']['annons']['kommunnamn']),
            $this->checkForTags($job['platsannons']['arbetsplats']['arbetsplatsnamn']),
            $this->checkForTags($job['platsannons']['villkor']['arbetstidvaraktighet']),
            $this->checkForTags($job['platsannons']['villkor']['arbetstid']),
            $this->checkForTags($job['platsannons']['villkor']['lonetyp']),
            $this->checkForTags($job['platsannons']['annons']['yrkesbenamning']),
            $this->checkForTags($job['platsannons']['ansokan']['webbplats']),
            $this->checkForTags($job['platsannons']['annons']['annonsid']));
    }

    private function checkForTags($value){
        //check if the value exists
        if (isset($value)) {
            return strip_tags($value); //remove tags
        }
        return "saknas";
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