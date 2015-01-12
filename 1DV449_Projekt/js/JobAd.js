/**
 * Created by Tobias on 2015-01-05.
 */

/**
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
function JobAd(header, jobText, published, numberOfJobs, countyName, workLocationName, duration, workHours, salaryType,
               jobName, website, facebook, streetName, postCode, postArea){

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
 * todo: fix this function. Looking like shit
 * renders the jobAd
 */
JobAd.prototype.render = function(){
    var website;

    var backLink = $("<a href='#'>Tillbaka till sökresultatet</a>").appendTo("#content");
    backLink.click(function(){
       JobBoard.renderJobList();
    });

    var panel = $("<div class='panel panel-success'></div>").appendTo("#content");
    $("<div class='panel-heading'><h3>" + this.header +" <small class='pull-right'>publicerad: " + this.getPublishedDate()
    + "</small></h3> </div> ").appendTo(panel);

    var body = $("<div class='panel-body'><p>" + this.jobName + " "+ this.countyName +"</p></div>").appendTo(panel);

    $("<div class='col-md-10'><p class='text'>" + this.jobText + "</p></div>").appendTo(body);

    var footer = $("<div class='col-md-12'></div>").appendTo(body);

    $("<div class='col-md-5 pull-left'><p class='text'> <b>antal platser: </b> "+ this.numberOfJobs + "</p>" +
    "<p class='text'><b>Varaktighet: </b>" + this.duration + "</p>" +
    "<p class='text'><b>Arbetstid: </b>" + this.workHours + "</p>" +
    "<p class='text'><b>Lön: </b>" + this.salaryType + "</p></div>").appendTo(footer);

    if(this.website === 'saknas'){
       website = "<p class='text'>Hemsida saknas</p>";
    } else{
        website = "<a target='_blank' href="+ this.website +"> Läs mer/Ansök </a></div>";
    }


    $("<div class='col-md-5 pull-right'><p class='text'><b>Arbetsgivare: </b>" + this.workLocationName + "</p>"+
        "<p class='text'><b>Adress: </b></p><p class='text'>"+ this.streetName +"</p><p class='text'>"+ this.postCode +
    "</p><p class='text'>"+ this.postArea +"</p>"+
        this.renderFacebook() + website).appendTo(footer);

};

/**
 *
 * @returns {string} html-code for the facebook-link
 */
JobAd.prototype.renderFacebook = function(){
    var status = $("#status").text();
    switch (status){
        case 'Inloggad':
            if (this.facebook === 'saknas') {
                return "<p><b>Arbetsgivaren verkar sakna facebook</b></p>";
            }
            return "<a target='_blank' href=" + this.facebook + "> Arbetsgivarens facebook </a>";
        default:
            return "<p class='text'>Var vänlig att logga in med facebook för att se arbetsgivarens facebook</p>";
    }

};

/**
 *
 * @returns {string} a nice looking date
 */
JobAd.prototype.getPublishedDate = function(){
  return this.published.getFullYear() + "-" + this.published.getMonth() + 1 + "-" + this.published.getDate();
};