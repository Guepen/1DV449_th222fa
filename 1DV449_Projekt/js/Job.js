/**
 * Created by Tobias on 2014-12-29.
 */

/**
 * @param jobId
 * @param header
 * @param jobName
 * @constructor
 */
function Job(jobId, header, jobName){
    console.log(jobId, header, jobName);

    this.jobId = jobId;
    this.header = header;
    this.jobName = jobName;
}

Job.prototype.render = function(){
    var panel = $("<div class='panel panel-success'></div>").appendTo("#content");
    $("<div class='panel-heading'><h5>" + this.header + "</h5></div> ").appendTo(panel);

    var body = $("<div class='panel-body'></div>").appendTo(panel);

    var jobLink = $("<a id='"+ this.jobId +"' href='#'>" + this.jobName + "</a>").appendTo(body);

    jobLink.click(function(){
        if (JobBoard.online) {
            JobBoard.getJob(event.target.id);
        } else{
            JobBoard.renderChosenOfflineJob(event.target.id)
        }
    })
};
