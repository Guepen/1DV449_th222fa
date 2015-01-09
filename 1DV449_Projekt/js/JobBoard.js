/**
 * Created by Tobias on 2014-12-11.
 */

var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},
    jobList: [],
    jobAd: [],
    jobListsId: [],
    online: true,

    init: function(){
        //om ett fel inträffar
        window.applicationCache.addEventListener("error", function(e) {
            JobBoard.offlineJobList();
        });

        setInterval(function(){
            JobBoard.checkConnection();
        }, 3000);

        if (JobBoard.online) {
            JobBoard.getProvinces();
        }
    },

    checkConnection: function(){
        $.ajax({
            "type": "POST",
            "url": "connection.json",
            "dataType": "json",
            "data": {"mode": "getProvinces"},
            success: function (data) {
               if(data.connection === 'connected'){
                   JobBoard.onlineAlert();
                   JobBoard.online = true;
               } else{
                   JobBoard.offlineAlert();
                   JobBoard.offlineJobList();
                   JobBoard.online = false;
               }
            },

            error: function(){
                JobBoard.offlineAlert();
                JobBoard.offlineJobList();
                JobBoard.online = false;
            }
        })
    },

    addToLocalStorage: function(content, occupationAreaId, countyId){
        JobBoard.jobListsId.push({'occupationId': occupationAreaId, 'countyId': countyId});
        if (!JobBoard.supportsLocalStorage()) { return false; }
        localStorage["jobListsId"] = JSON.stringify(JobBoard.jobListsId);
        localStorage["jobList"+occupationAreaId+countyId] = content;
    },

    onlineAlert: function(){
        if (JobBoard.online === false) {
            $("#content").empty();
            $("<div class='col-md-6'><div id='online' class='alert alert-warning'></div></div>").appendTo("#content");
            $("<p>Du har nu återfått din internetanslutning</p>").appendTo("#online");
            JobBoard.renderSearchView();
        }
    },

    offlineAlert: function(){
        $("#content").empty();
        $("<div class='col-md-6'><div id='offline' class='alert alert-warning'></div></div>").appendTo("#content");
        $("<p>Det verkar som du har tappat din internetanslutning" +
        " men du kan fortfarande komma åt de jobb som du har visat tidigare</p>").appendTo("#offline");
    },

    offlineJobList: function(){
        var panel = $("<div class='panel panel-success'></div>").appendTo("#content");
        $("<div class='panel-heading'><h5>" + this.header + "</h5></div> ").appendTo(panel);

        var body = $("<div class='panel-body'></div>").appendTo(panel);
        console.log(JobBoard.jobListsId);
        var listsId = JSON.parse(localStorage["jobListsId"]);
        listsId.forEach(function(listId){
            var list = JSON.parse(localStorage.getItem("jobList"+listId.occupationId+listId.countyId));
            console.log(list);
            list.forEach(function(jobItem){
                var job = new Job(jobItem.annonsid, jobItem.annonsrubrik, jobItem.yrkesbenamning);
                job.render();
            })

        });

/*
        jobLink.click(function(){
            JobBoard.getJob(event.target.id);
        })  */
    },
    renderSearchView: function(){
        JobBoard.jobList = [];
        //$("#content").empty();

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
        if (JobBoard.online) {
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getProvinces"},
                success: function (data) {
                    var id;
                    var provinces = (data);
                    console.log(data);
                    if (provinces.length > 0) {
                        provinces.forEach(function (province) {
                            if (province.provinceId == undefined) {
                                id = province.id;
                            } else {
                                id = province.provinceId;
                            }
                            var newProvince = new Province(id, province.namn, province.antal_platsannonser);
                            newProvince.render();
                        })
                    }
                },

                error: function () {
                    var error = new CustomError("För tillfället kan inte några län hämtas", "Vänligen, försök igen senare");
                    error.render();
                }
            });
        } else{
            JobBoard.offlineJobList();
        }
    },

    getCounties: function(id){
        if (JobBoard.online) {
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getCounties", "provinceId": id},
                success: function (data) {
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

                error: function () {
                    var error = new CustomError("För tillfället kan inte kommuner i valt län hämtas", "Vänligen, försök igen senare");
                    error.render();
                }
            });
        } else{
            JobBoard.offlineJobList();
        }
    },

    getOccupationAreas: function(){
        if (JobBoard.online) {
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getOccupationAreas"},
                success: function (data) {
                    $("#occupationsList").empty();
                    if (data.length > 0) {
                        data.forEach(function (occupationArea) {
                            var newOccupationArea = new OccupationArea(occupationArea.occupationAreaId, occupationArea.namn);
                            newOccupationArea.render();
                        })
                    }
                },

                error: function () {
                    var error = new CustomError("För tillfället kan inte yrkesområden hämtas", "Vänligen, försök igen senare");
                    error.render();
                }
            });
        } else{
            JobBoard.offlineJobList();
        }
    },

    getJobs: function(occupationAreaId, countyId){
        if (JobBoard.online) {
            $("#content").empty();
            var newSearch = $("<a href='#'>Ny sökning</a>").appendTo("#content");
            newSearch.click(function () {
                $("#content").empty();
                JobBoard.renderSearchView();
            });
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getJobs", "countyId": countyId, "occupationAreaId": occupationAreaId},
                success: function (data) {
                    if (data.length > 0) {
                        data.forEach(function (job) {
                            var newJob = new Job(job.annonsid, job.annonsrubrik, job.yrkesbenamning);
                            JobBoard.jobList.push(newJob);

                            newJob.render();
                        })
                    }

                    JobBoard.addToLocalStorage(JSON.stringify(data), occupationAreaId, countyId);

                },

                error: function () {
                    var error = new CustomError("Ett fel inträffade när listan på matchande jobb skulle hämtas", "Vänligen, försök igen");
                    error.render();
                }
            });
        } else{
            JobBoard.offlineJobList();
        }
    },

    supportsLocalStorage: function(){
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    },
    renderJobList: function(){
        $("#content").empty();
        var backLink = $("<a href='#'>Ny sökning</a>").appendTo("#content");
        backLink.click(function(){
            $("#content").empty();
            JobBoard.renderSearchView();
        });
        JobBoard.jobList.forEach(function(job){
            job.render();
        })
    },

    getJob: function(jobAdId){
        if (JobBoard.online) {
            $("#content").empty();
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getJob", "jobAdId": jobAdId},
                success: function (data) {
                    console.log(data);
                    if (data) {
                        var jobAd = new JobAd(data.annonsrubrik, data.annonstext, data.publiceraddatum, data.antal_platser,
                            data.kommunnamn, data.arbetsplatsnamn, data.arbetstidvaraktighet, data.arbetstid, data.lonetyp, data.yrkesbenamning,
                            data.webbplats, data.facebook, data.streetName, data.postCode, data.postArea);
                        JobBoard.jobAd.push(jobAd);

                        jobAd.render();
                    }
                },

                error: function () {
                    var error = new CustomError("Ett fel inträffade när valt jobb skulle hämtas", "Vänligen, försök igen");
                    error.render();
                }
            });
        } else{
            JobBoard.offlineJobList();
        }
    }
};

window.onload = JobBoard.init;