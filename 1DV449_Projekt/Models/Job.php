<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2015-01-05
 * Time: 19:13
 */

class Job{
    private $annonsrubrik;
    private $annonstext;
    private $publiceraddatum;
    private $antal_platser;
    private $kommunnamn;
    private $arbetstidvaraktighet;
    private $arbetstid;
    private $lonetyp;
    private $yrkesbenamning;
    private $webbplats;
    private $annonsid;
    private $arbetsplatsnamn;

    public function __construct($annonsrubrik, $annonstext, $publiceraddatum, $antal_platser, $kommunnamn, $arbetsplatsnamn,
                                $arbetstidvaraktighet, $arbetstid, $lonetyp, $yrkesbenamning, $webbplats, $annonsid){

        $this->annonsrubrik = $annonsrubrik;
        $this->annonsid = $annonsid;
        $this->annonstext = $annonstext;
        $this->antal_platser = $antal_platser;
        $this->arbetstid = $arbetstid;
        $this->arbetstidvaraktighet = $arbetstidvaraktighet;
        $this->kommunnamn = $kommunnamn;
        $this->lonetyp = $lonetyp;
        $this->publiceraddatum = $publiceraddatum;
        $this->webbplats = $webbplats;
        $this->yrkesbenamning = $yrkesbenamning;
        $this->arbetsplatsnamn = $arbetsplatsnamn;

    }

    private function checkValue($value){
        if(isset($value)){
            return $value;
        }
        return 'saknas';
    }

    /**
     * @return mixed
     */
    public function getArbetsplatsnamn()
    {
        return $this->checkValue($this->arbetsplatsnamn);
    }

    /**
     * @return mixed
     */
    public function getAnnonsid()
    {
        return $this->checkValue($this->annonsid);
    }

    /**
     * @return mixed
     */
    public function getAnnonsrubrik()
    {
        return $this->checkValue($this->annonsrubrik);
    }

    /**
     * @return mixed
     */
    public function getAnnonstext()
    {
        return $this->checkValue($this->annonstext);
    }

    /**
     * @return mixed
     */
    public function getAntalPlatser()
    {
        return $this->checkValue($this->antal_platser);
    }

    /**
     * @return mixed
     */
    public function getArbetstid()
    {
        return $this->checkValue($this->arbetstid);
    }

    /**
     * @return mixed
     */
    public function getArbetstidvaraktighet()
    {
        return $this->checkValue($this->arbetstidvaraktighet);
    }

    /**
     * @return mixed
     */
    public function getKommunnamn()
    {
        return $this->checkValue($this->kommunnamn);
    }

    /**
     * @return mixed
     */
    public function getLonetyp()
    {
        return $this->checkValue($this->lonetyp);
    }

    /**
     * @return mixed
     */
    public function getPubliceraddatum()
    {
        return $this->checkValue($this->publiceraddatum);
    }

    /**
     * @return mixed
     */
    public function getWebbplats()
    {
        return $this->checkValue($this->webbplats);
    }

    /**
     * @return mixed
     */
    public function getYrkesbenamning()
    {
        return $this->checkValue($this->yrkesbenamning);
    }
}