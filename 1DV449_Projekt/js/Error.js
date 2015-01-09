/**
 * Created by Tobias on 2015-01-08.
 */

function CustomError(header, text){
    this.header = header;
    this.text = text;
}

CustomError.prototype.render = function(){
    var content = $("#content");
    content.empty();
    var errorContent = $("<div class='col-md-10'> </div>").appendTo(content);
    var errorPanel = $("<div class='panel panel-danger'></div>").appendTo(errorContent);
    $("<div class='panel-heading'><h3>"+ this.header +"</h3></div>").appendTo(errorPanel);
    var body = $("<div class='panel-body'><p>"+ this.text +"</p>").appendTo(errorPanel);
    var newSearch = $("<a class='btn btn-primary'>Gör en ny sökning</a></div>").appendTo(body);

    newSearch.click(function(){
        JobBoard.renderSearchView();
    })
};
