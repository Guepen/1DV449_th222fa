/**
 * Created by Tobias on 2014-12-11.
 */

var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},
    jobList: [],
    jobAd: [],

    init: function(){

        $("#status").change(function(){
           alert($("#status").text());
        });
       // alert("hej init");
        JobBoard.getProvinces();
    },

    renderSearchView: function(){
        JobBoard.jobList = [];
        $("#content").empty();

        //provinces
        $("<div class='col-md-4'><div id='provinces' class='panel panel-warning'></div></div>").appendTo("#content");
        $("<div class='panel-heading'><h4 class='center'>Steg 1. Välj Län</h4</div>").appendTo("#provinces");
        $("<div class='panel-body'><ul id='provincesList'></ul></div>").appendTo("#provinces");

        //counties
        $("<div class='col-md-4'><div id='counties' class='panel panel-warning'></div></div>").appendTo("#content");
        $("<div class='panel-heading'><h4 class='center'>Steg 2. Välj Kommun</h4></div>").appendTo("#counties");
        $("<div class='panel-body'><ul id='countiesList'></ul></div>").appendTo("#counties");

        //occupationAreas
        $("<div class='col-md-4'><div id='occupations' class='panel panel-warning'></div></div>").appendTo("#content");
        $("<div class='panel-heading'><h4 class='center'>Steg 3. Välj Yrkesområde</h4></div>").appendTo("#occupations");
        $("<div class='panel-body'><ul id='occupationsList'></ul></div>").appendTo("#occupations");

        JobBoard.getProvinces();
    },

    getProvinces: function(){
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getProvinces"},
            success: function(data){
                var id;
                var provinces = (data);
                console.log(data);
                if(provinces.length > 0){
                    provinces.forEach(function(province){
                        if(province.provinceId == undefined){
                            id = province.id;
                        } else{
                            id = province.provinceId;
                        }
                        var newProvince = new Province(id, province.namn, province.antal_platsannonser);
                        newProvince.render();
                    })
                }
            },

            error: function(){
                var error = new CustomError("För tillfället kan inte några län hämtas", "Vänligen, försök igen senare" );
                error.render();
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
                $("#countiesList").empty();
                console.log(data);

                var counties = data;
                if (counties.length > 0) {
                    counties.forEach(function (county) {
                        var newCounty = new County(county.countyId, county.namn, county.antal_platsannonser)
                        newCounty.render();
                    })
                }
            },

            error: function(){
                var error = new CustomError("För tillfället kan inte kommuner i valt län hämtas", "Vänligen, försök igen senare" );
                error.render();
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
                $("#occupationsList").empty();
                if(data.length > 0){
                    data.forEach(function(occupationArea){
                        var newOccupationArea = new OccupationArea(occupationArea.occupationAreaId, occupationArea.namn);
                        newOccupationArea.render();
                    })
                }
            },

            error: function(){
                var error = new CustomError("För tillfället kan inte yrkesområden hämtas", "Vänligen, försök igen senare" );
                error.render();
            }
        });
    },

    getJobs: function(occupationAreaId, countyId){
        $("#content").empty();
        var newSearch = $("<a href='#'>Ny sökning</a>").appendTo("#content");
        newSearch.click(function(){
            JobBoard.renderSearchView();
        });
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getJobs", "countyId": countyId, "occupationAreaId": occupationAreaId},
            success: function(data){
                if(data.length > 0){
                    data.forEach(function(job){
                        var newJob = new Job(job.annonsid, job.annonsrubrik, job.yrkesbenamning);
                        JobBoard.jobList.push(newJob);

                        newJob.render();
                    })
                }
            },

            error: function(){
                var error = new CustomError("Ett fel inträffade när listan på matchande jobb skulle hämtas", "Vänligen, försök igen" );
                error.render();
            }
        });
    },

    renderJobList: function(){
        $("#content").empty();
        var backLink = $("<a href='#'>Ny sökning</a>").appendTo("#content");
        backLink.click(function(){
            JobBoard.renderSearchView();
        });
        JobBoard.jobList.forEach(function(job){
            job.render();
        })
    },

    getJob: function(jobAdId){
        $("#content").empty();
        $.ajax({
            "type": "POST",
            "url": "Controller/WorkController.php",
            "dataType": "json",
            "data": {"mode": "getJob", "jobAdId": jobAdId},
            success: function(data){
                console.log(data);
                if(data){
                   var jobAd = new JobAd(data.annonsrubrik, data.annonstext, data.publiceraddatum, data.antal_platser,
                       data.kommunnamn, data.arbetsplatsnamn, data.arbetstidvaraktighet, data.arbetstid, data.lonetyp, data.yrkesbenamning,
                       data.webbplats, data.facebook, data.streetName, data.postCode, data.postArea);
                    JobBoard.jobAd.push(jobAd);

                    jobAd.render();
                }
            },

            error: function(){
                var error = new CustomError("Ett fel inträffade när valt jobb skulle hämtas", "Vänligen, försök igen" );
                error.render();
            }
        });
    }
};

window.onload = JobBoard.init;