/**
 * Created by Tobias on 2014-12-11.
 */

/**
 *
  * @type {{init: Function, getProvinces: Function, renderProvinces: Function, getCounties: Function, renderCounties: Function}}
 */
var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},

    init: function(){
        JobBoard.getProvinces();

        $("#location-search").click(function(){
            JobBoard.getProvinces();
        })


    },

    getProvinces: function(){

        $.ajax({
            "type": "POST",
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
        var parent = $("#provinces");
        var panelBody = $("<div id='provincesList' class='panel-body'></div>").appendTo(parent);
        var ul = $("<ul></ul>");
        ul.appendTo(panelBody);
        provinces.forEach(function(province){
           var li =$("<li></li>");
            var provinceLink = $("<a id=" + province.id +"  href='#'>" + province.namn +
            "(" + province.antal_platsannonser + ")" + "</a>");
            li.appendTo(ul);
            provinceLink.appendTo(li);

            provinceLink.click(function(){
                $("#countiesList").empty();
                JobBoard.getCounties(event.target.id);

            })
        });


    },

    getCounties: function(id){
        $.ajax({
            "type": "POST",
            "url": "Services/County.php",
            "dataType": "json",
            "data": {"id": id},
            success: function(data){
                JobBoard.renderCounties(data.soklista.sokdata);
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    renderCounties: function(counties){
        var parent = $("#countiesList");
        var ul = $("<ul></ul>");
        ul.appendTo(parent);

        counties.forEach(function(county){
            var li =$("<li></li>");
            var countyLink = $("<a id= "+ county.id + " href='#'>" + county.namn +
            "(" + county.antal_platsannonser + ")" +" </a>")
            li.appendTo(ul);
            countyLink.appendTo(li);

            countyLink.click(function(){
                $("#occupationsList").empty();
                JobBoard.searchQueries.countyId = event.target.id;
                JobBoard.getOccupations();

            })
        });
    },

    getOccupations: function(countyId){
        $.ajax({
            "type": "POST",
            "url": "Services/Occupations.php",
            "dataType": "json",
            "data": countyId,
            success: function(data){
                JobBoard.renderOccupations(data.soklista.sokdata);
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    renderOccupations: function(occupations){
        var parent = $("#occupationsList");
        var ul = $("<ul></ul>");
        ul.appendTo(parent);

        occupations.forEach(function(occupation){
            var li =$("<li></li>");
            var occupationLink = $("<a id= "+ occupation.id + " href='#'>" + occupation.namn + " </a>");
            li.appendTo(ul);
            occupationLink.appendTo(li);

            occupationLink.click(function(){
                JobBoard.searchQueries.occupationId = event.target.id;
                console.log(JobBoard.searchQueries);
            })
        });
    }

};

window.onload = JobBoard.init;