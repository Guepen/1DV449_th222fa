/**
 * Created by Tobias on 2014-12-11.
 */

var JobBoard = {

    init: function(){
        $("#location-search").click(function(){
            JobBoard.getProvinces();
        })


    },

    getProvinces: function(){

        $.ajax({
            "type": "GET",
            "url": "Services/Provinces.php",
            "dataType": "json",
            success: function(data){
                if(data.soklista.sokdata.length > 0){
                    JobBoard.renderProvinces(data.soklista.sokdata);
                }
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    renderProvinces: function(provinces){
        var parent = $(".jumbotron");
        var ul = $("<ul></ul>");
        ul.appendTo(parent);
        provinces.forEach(function(province){
           var li =$("<li></li>");
            var provinceLink = $("<a id=" + province.id +"  href='#'>" + province.namn +
            "(" + province.antal_platsannonser + ")" + "</a>");
            li.appendTo(ul);
            provinceLink.appendTo(li);

            provinceLink.click(function(){
                console.log(event.target.id);
            })
        });


    }

};

window.onload = JobBoard.init;