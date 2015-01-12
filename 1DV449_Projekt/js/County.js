/**
 * Created by Tobias on 2014-12-12.
 */

/**
 * @param countyId
 * @param countyName
 * @constructor
 */
function County(countyId, countyName){
    this.countyId = countyId;
    this.countyName = countyName;
}

/**
 * renders a county and adds a click-event to it
 */
County.prototype.render = function(){
    var that = this;
    var ul = $("#countiesList");
    var li = $("<li></li>");
    var countyLink = $("<a id= "+ this.countyId + " href='#'>" + this.countyName + " </a>");
    li.appendTo(ul);
    countyLink.appendTo(li);

    countyLink.click(function(){
        if (JobBoard.online) {
            $("#occupationsList").empty();
            console.log(that.countyId);
            JobBoard.searchQueries.countyId = that.countyId;
            JobBoard.getOccupationAreas();
            $("#counties").removeClass("panel-warning").addClass("panel panel-success");
        }
    })
};