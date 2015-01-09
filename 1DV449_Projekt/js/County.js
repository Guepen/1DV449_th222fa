/**
 * Created by Tobias on 2014-12-12.
 */

function County(countyId, countyName){
    this.countyId = countyId;
    this.countyName = countyName;
}

County.prototype.render = function(){
    var that = this;
    var ul = $("#countiesList");
    var li = $("<li></li>");
    var countyLink = $("<a id= "+ this.countyId + " href='#'>" + this.countyName + " </a>");
    li.appendTo(ul);
    countyLink.appendTo(li);

    countyLink.click(function(){
        $("#occupationsList").empty();
        JobBoard.searchQueries.countyId = that.countyId;
        JobBoard.getOccupationAreas();
        $("#counties").removeClass("panel-warning").addClass("panel panel-success");
    })
};