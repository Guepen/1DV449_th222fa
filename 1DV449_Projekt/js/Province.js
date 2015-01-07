/**
 * Created by Tobias on 2014-12-12.
 */

function Province(provinceId, provinceName, numberOfJobs){
    this.provinceId = provinceId;
    this.provinceName = provinceName;
    this.numberOfJobs = numberOfJobs;
}

Province.prototype.render = function(){


    var ul = $("#provincesList");
    var li = $("<li></li>");
    var provinceLink = $("<a id=" + this.provinceId +"  href='#'>" + this.provinceName +
    " (" + this.numberOfJobs + ")" + "</a>");
    li.appendTo(ul);
    provinceLink.appendTo(li);

    provinceLink.click(function(){
        $("#occupationsList").empty();
        $("#countiesList").empty();
        $("#counties").addClass("panel panel-warning");
        JobBoard.getCounties(event.target.id);
        $("#provinces").removeClass("panel-warning").addClass("panel panel-success");
    })
};