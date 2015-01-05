/**
 * Created by Tobias on 2014-12-11.
 */

var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},

    init: function(){
        JobBoard.getProvinces();

        var content =  $("#content");

        $("#location-search").click(function(){
            content.empty();
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
                        var newOccupationArea = new OccupationArea(occupationArea.occupationAreaId, occupationArea.namn);
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
        $("#content").empty();
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getJobs", "countyId": countyId, "occupationAreaId": occupationAreaId},
            success: function(data){
                if(data.length > 0){
                    data.forEach(function(job){
                        var newJob = new Job(job.annonsid, job.annonsrubrik, job.yrkesbenamning);

                        newJob.render();
                    })
                }
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    getJob: function(jobAdId){
        $("#content").empty();
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getJob", "jobAdId": jobAdId},
            success: function(data){
                if(data.length > 0){
                    data.forEach(function(job){
                        var newJob = new Job(job.annonsid, job.annonsrubrik, job.yrkesbenamning);

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