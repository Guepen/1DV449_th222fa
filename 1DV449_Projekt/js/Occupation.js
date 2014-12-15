/**
 * Created by Tobias on 2014-12-12.
 */

function Occupation(occupationId, occupationName){
    this.occupationId = occupationId;
    this.occupationName = occupationName;
}

Occupation.prototype.render = function(){
    var that = this;
    var ul = $("#occupationsList");
    var li = $("<li></li>");
    var occupationLink = $("<a id= "+ this.occupationId + " href='#'>" + this.occupationName + " </a>");
    li.appendTo(ul);
    occupationLink.appendTo(li);

    occupationLink.click(function(){
        JobBoard.searchQueries.occupationId = that.occupationId;
    })
};
