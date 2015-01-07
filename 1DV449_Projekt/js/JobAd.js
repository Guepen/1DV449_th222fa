/**
 * Created by Tobias on 2015-01-05.
 */
function JobAd(header, jobText, published, numberOfJobs, countyName, workLocatonName, duration, workHours, salaryType, jobName, website){
    this.header = header;
    this.jobText = jobText;
    this.published = published;
    this.numberOfJobs = numberOfJobs;
    this.coutyName = countyName;
    this.workLocationName = workLocatonName;
    this.duration = duration;
    this.workHours = workHours;
    this.salaryType = salaryType;
    this.jobName = jobName;
    this.website = website;
}

JobAd.prototype.render = function(){
    var website;

    var backLink = $("<a href='#'>Tillbaka till sökresultatet</a>").appendTo("#content");
    backLink.click(function(){
       JobBoard.renderJobList();
    });

    var panel = $("<div class='panel panel-success'></div>").appendTo("#content");
    $("<div class='panel-heading'><h3>" + this.header +" <small class='pull-right'>publicerad: " + new Date(this.published)
    + "</small></h3> </div> ").appendTo(panel);

    var body = $("<div class='panel-body'><p>" + this.jobName + " "+ this.coutyName +"</p></div>").appendTo(panel);

    $("<div class='col-md-10'><p class='text'>" + this.jobText + "</p></div>").appendTo(body);

    var footer = $("<div class='col-md-12'></div>").appendTo(body);

    $("<div class='col-md-5 pull-left'><p class='text'> <b>antal platser: </b> "+ this.numberOfJobs + "</p>" +
    "<p class='text'><b>Varaktighet: </b>" + this.duration + "</p>" +
    "<p class='text'><b>Arbetstid: </b>" + this.workHours + "</p>" +
    "<p class='text'><b>Lön: </b>" + this.salaryType + "</p></div>").appendTo(footer);

    if(this.website === 'saknas'){
       website = "<p class='text'>Hemsida saknas</p>";
    } else{
        website = "<a target='_blank' href="+ this.website +"> Hemsida </a></div>";
    }


    $("<div class='col-md-5 pull-right'><p class='text'><b>Arbetsgivare: </b>" + this.workLocationName + "</p>"+
        website).appendTo(footer);

};