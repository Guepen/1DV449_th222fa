/**
 * Created by Tobias on 2014-12-11.
 */

var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},

    init: function(){
        JobBoard.getProvinces();

        var provincesList =  $("#provincesList");

        $("#location-search").click(function(){
            provincesList.empty();
            JobBoard.getProvinces();
        });


    },

    getProvinces: function(){
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getProvinces"},
            success: function(data){
                console.log(data);
                var provinces = (data);
                if(provinces.length > 0){
                    provinces.forEach(function(province){
                        var newProvince = new Province(province.provinceId, province.namn, province.antal_platsannonser);
                        newProvince.render();
                    })
                }
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    getCounties: function(id){
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getCounties", "provinceId": id},
            success: function(data) {
                console.log(data);

                var counties = data;
                if (counties.length > 0) {
                    counties.forEach(function (county) {
                        var newCounty = new County(county.countyId, county.namn, county.antal_platsannonser)
                        newCounty.render();
                    })
                }
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    getOccupationAreas: function(){
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getOccupationAreas"},
            success: function(data){
                if(data.length > 0){
                    data.forEach(function(occupationArea){
                        var newOccupationArea = new OccupationArea(occupationArea.id, occupationArea.namn);
                        newOccupationArea.render();
                    })
                }
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    getJobs: function(occupationAreaId, countyId){
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getJobs", "countyId": countyId, "occupationAreaId": occupationAreaId},
            success: function(data){
                if(data.length > 0){
                    $("#content").empty();
                    $("<div class='col-md-12' id='jobContent'></div>").appendTo("#content");
                    data.forEach(function(job){
                        var newJob = new Job(job.annonsrubrik, job.yrkesbenamning, job.arbetsplatsnamn, job.kommunnamn,
                                             job.publiceraddatum, job.antalplatser);

                        newJob.render();
                    })
                }
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    }
};

window.onload = JobBoard.init;