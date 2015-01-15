/**
 * Created by Tobias on 2015-01-05.
 */

/**
 * @param id
 * @param header
 * @param jobText
 * @param published
 * @param numberOfJobs
 * @param countyName
 * @param workLocationName
 * @param duration
 * @param workHours
 * @param salaryType
 * @param jobName
 * @param website
 * @param facebook
 * @param streetName
 * @param postCode
 * @param postArea
 * @constructor
 */
function JobAd(id ,header, jobText, published, numberOfJobs, countyName, workLocationName, duration, workHours, salaryType,
               jobName, website, facebook, streetName, postCode, postArea){

    this.id = id;
    this.header = header;
    this.jobText = jobText;
    this.published = new Date(published);
    this.numberOfJobs = numberOfJobs;
    this.countyName = countyName;
    this.workLocationName = workLocationName;
    this.duration = duration;
    this.workHours = workHours;
    this.salaryType = salaryType;
    this.jobName = jobName;
    this.website = website;
    this.facebook = facebook;
    this.streetName = streetName;
    this.postCode = postCode;
    this.postArea = postArea;
}

/**
 * renders the jobAd
 */
JobAd.prototype.render = function(){
    this.renderBackLink();

    var jobContent = $("<div class='row'><div class='col-md-12'><div id='jobContent' class='panel panel-success'>" +
    "</div></div></div>").appendTo("#content");

    this.getHeader().appendTo("#jobContent");
    this.getBody().appendTo("#jobContent");

    this.getFooter().appendTo("#jobBody");


};

JobAd.prototype.getHeader = function(){
    return $("<div class='panel-heading'><h3>" + this.header +"</h3>" +
    "<p class='text'>Publicerad: " + this.getPublishedDate() + "</p></div>");
};

JobAd.prototype.getBody = function(){
    return $("<div id='jobBody' class='panel-body'><p>" + this.jobName + " till "+ this.countyName +"</p>" +
    "<div class='col-md-10'><p class='text'>" + this.jobText + "</p></div></div>") ;

};

JobAd.prototype.getFooter = function(){
    return  $("<div class='col-md-6'><p class='text'> <b>antal platser: </b> "+ this.numberOfJobs + "</p>" +
    "<p class='text'><b>Varaktighet: </b>" + this.duration + "</p>" +
    "<p class='text'><b>Arbetstid: </b>" + this.workHours + "</p>" +
    "<p class='text'><b>Lön: </b>" + this.salaryType + "</p></div>" +
    "<div class='col-md-6'><p class='text'><b>Arbetsgivare: </b>" + this.workLocationName + "</p>"+
        this.getAddress() +  this.getFacebook() + this.getWebSite() +"</div>");

};

JobAd.prototype.getAddress = function(){
    if (this.streetName === 'saknas' && this.postArea === 'saknas' && this.postCode === 'saknas') {
        return "";

    } else{
        return "<p class='text'><b>Adress:</b> " + this.streetName + "</p>" +
        "<p class='text'><b>Postnummmer:</b> " + this.postCode + "</p><p class='text'><b>Ort:</b> " + this.postArea + "</p>";
    }
};

JobAd.prototype.renderBackLink = function(){
    var backLink = $("<div class='row'><div class='col-md-12'><a id='back' href='#'>Tillbaka till sökresultatet</a>" +
    "</div></div>").appendTo("#content");
    backLink.click(function(){
        if (JobBoard.online) {
            JobBoard.renderJobList();
        } else{
            JobBoard.offlineJobList();
        }
    });

};

JobAd.prototype.getWebSite = function(){
    if(this.website !== 'saknas'){
        return "<a target='_blank' href="+ this.website +"> Läs mer/Ansök </a></div>";
    }
    return "";
};

/**
 *
 * @returns {string} html-code for the facebook-link
 */
JobAd.prototype.getFacebook = function(){
    var status = $("#status").text();
    if (this.facebook !== 'saknas') {
        switch (status) {
            case 'Inloggad':
                return "<a target='_blank' href=" + this.facebook + "> Arbetsgivarens facebook </a>";
            default:
                return "<h4>Var vänlig att logga in med facebook för att se arbetsgivarens facebook</h4>";
        }
    }
    return "";

};

/**
 *
 * @returns {string} a nice looking date
 */
JobAd.prototype.getPublishedDate = function(){
    return this.published.getFullYear() + "-" + (this.published.getMonth() + 1) + "-" + this.published.getDate();
};