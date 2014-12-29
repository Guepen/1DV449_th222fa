/**
 * Created by Tobias on 2014-12-29.
 */

function Job(header, jobName, companyName, countyName, date, numberOfJobs){

    this.header = header;
    this.jobName = jobName;
    this.companyName = companyName;
    this.countyName = countyName;
    this.date = date;
    this.numberOfJobs = numberOfJobs;
}

Job.prototype.render = function(){
    $("<div class='panel panel-success'><div class='panel-heading'><h4>" + this.header + "</h4></div> " +
                "<div class='panel-body'>" + this.jobName + "</div>").appendTo("#jobContent");
};
