/**
 * Created by Tobias on 2014-12-12.
 */

function County(countyId, countyName, numberOfJobs){
    this.countyId = countyId;
    this.countyName = countyName;
    this.numberOfJobs = numberOfJobs;
}

County.prototype.render = function(){
    var that = this;
    var ul = $("#countiesList");
    var li = $("<li></li>");
    var countyLink = $("<a id= "+ this.countyId + " href='#'>" + this.countyName +
    " (" + this.numberOfJobs + ")" +" </a>")
    li.appendTo(ul);
    countyLink.appendTo(li);

    countyLink.click(function(){
        $("#occupationsList").empty();
        JobBoard.searchQueries.countyId = that.countyId;
        JobBoard.getOccupations(that.countyId);
        $("#counties").removeClass("panel-warning").addClass("panel panel-success");
    })
};