/**
 * Created by Tobias on 2014-12-12.
 */

/**
 * @param provinceId
 * @param provinceName
 * @constructor
 */
function Province(provinceId, provinceName){
    this.provinceId = provinceId;
    this.provinceName = provinceName;
}

/**
 * renders the provinces and adds a click-event for each province
 */
Province.prototype.render = function(){
    var ul = $("#provincesList");
    var li = $("<li></li>");
    var provinceLink = $("<a id=" + this.provinceId +"  href='#'>" + this.provinceName + "</a>");
    li.appendTo(ul);
    provinceLink.appendTo(li);

    provinceLink.click(function(event){
        event.preventDefault();
        if (JobBoard.online) {
            $("#counties").addClass("panel panel-warning");
            JobBoard.getCounties(event.target.id);
            $("#provinces").removeClass("panel-warning").addClass("panel panel-success");
        }
    })
};