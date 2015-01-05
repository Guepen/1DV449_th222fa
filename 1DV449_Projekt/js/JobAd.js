/**
 * Created by Tobias on 2015-01-05.
 */
function JobAd(header, jobText, published, numberOfJobs, countyName, duration, workHours, salaryType, jobName, website){
    this.header = header;
    this.jobText = jobText;
    this.published = published;
    this.numberOfJobs = numberOfJobs;
    this.coutyName = countyName;
    this.duration = duration;
    this.workHours = workHours;
    this.salaryType = salaryType;
    this.jobName = jobName;
    this.website = website;
}

JobAd.prototype.render = function(){
    var panel = $("<div class='panel panel-success'></div>").appendTo("#content");
    $("<div class='panel-heading'><h3>" + this.header + "</h3></div> ").appendTo(panel);

    var body = $("<div class='panel-body'></div>").appendTo(panel);

    $("<p><small>" + this.jobText + "</small></p>").appendTo(body);

};