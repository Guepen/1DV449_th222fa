/**
 * Created by Tobias on 2014-12-11.
 */

var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},
    jobList: [],
    jobAd: [],
    offlineJobs: [],
    storage: sessionStorage,
    online: true,

    /**
     * called on window.onload
     */
    init: function(){
        $(".close").click(function(e){
            e.preventDefault();
            $("#tips").remove();
        });

        var cachedJobs = JobBoard.storage.getItem("offlineJobs");

        if (cachedJobs) {
            JobBoard.offlineJobs = JSON.parse(cachedJobs);
        }
        //sets an interval to check if the server i available
        setInterval(function(){
            JobBoard.checkConnection();
        }, 3000);

        if (navigator.onLine) {
            JobBoard.getProvinces();
        }
    },

    /**
     * tries to get a small JSON-file from the server
     */
    checkConnection: function(){
        $.ajax({
            "type": "POST",
            "url": "connection.json",
            "dataType": "json",
            "timeout": 3000,
            success: function () {
                JobBoard.onlineAlert();
            },

            error: function(){
                if (JobBoard.online) {
                    JobBoard.online = false;
                    JobBoard.offlineAlert();
                    JobBoard.offlineJobList();
                }
            }
        })
    },

    addToSessionStorage: function(key, value){
        if (JobBoard.supportsSessionStorage()) {
            this.storage.setItem(key, JSON.stringify(value));
        }
    },

    onlineAlert: function(){
        if (JobBoard.online === false) {
            JobBoard.online = true;
            $("#offlineContent").remove();
            $("#back").remove();

            $("<div id='onlineContent' class='row'><div class='col-md-12'><div id='online' class='alert alert-success'>" +
            "</div></div></div>").insertBefore(".jumbotron");

            $("<h3>Du har nu återfått din internetanslutning</h3><a id='newSearch' class='btn btn-link' " +
            "href='#'>Gör ny sökning</a>").appendTo("#online");

            //click-event for new search
            $("#newSearch").click(function(e){
                e.preventDefault();
                $("#onlineContent").remove();
                $("#content").empty();
                JobBoard.renderSearchView();
            });
        }
    },

    offlineAlert: function(){
        $("#tips").remove();
        $("#onlineContent").remove();
        $("<div id='offlineContent' class='row'><div class='col-md-12'><div id='offline' class='alert alert-warning'>" +
        "<a href='#' class='close' data-dismiss='alert'>&times;</a></div></div></div>").insertBefore(".jumbotron");
        $("<h3>Det verkar som du har tappat din internetanslutning" +
        " men du kan fortfarande komma åt de jobb som du har visat tidigare</h3>").appendTo("#offline");

        //close the alert
        $(".close").click(function(e){
            e.preventDefault();
            $("#offlineContent").remove();
        })
    },

    offlineJobList: function(){
        $("#content").empty();
        var that = this;
        var jobAdsList = JSON.parse(this.storage.getItem("offlineJobs"));
        if (jobAdsList) {
            jobAdsList.forEach(function (jobAdId) {
                var jobAd = JSON.parse(that.storage.getItem("jobAd"+jobAdId));

                var job = new Job(jobAd.id, jobAd.header, jobAd.jobName);
                job.render();
            });

        } else{
            var panel = $("<div class='panel panel-warning'></div>").appendTo("#content");
            $("<div class='panel-heading'><h3>Du verkar inte ha visat några jobb innan</h3></div> ").appendTo(panel);

            var body = $("<div class='panel-body'><p>Var vänliga tills du återfår din internetanslutning så " +
            "du kan göra en sökning</p></div>").
                appendTo(panel);
        }
    },

    renderChosenOfflineJob: function(jobAdId){
        $("#content").empty();
        var cachedJobAd = JSON.parse(this.storage.getItem("jobAd"+jobAdId));
        if (cachedJobAd) {
            var newJobAd = new JobAd(cachedJobAd.id, cachedJobAd.header, cachedJobAd.jobText, cachedJobAd.published,
                cachedJobAd.numberOfJobs, cachedJobAd.countyName, cachedJobAd.workLocationName, cachedJobAd.duration,
                cachedJobAd.workHours, cachedJobAd.salaryType, cachedJobAd.jobName, cachedJobAd.website,
                cachedJobAd.facebook, cachedJobAd.streetName, cachedJobAd.postCode, cachedJobAd.postArea);
            newJobAd.render();
        } else{
            var error = new CustomError("Ett fel inträffade när valt jobb skulle hämtas",
                "var vänlig vänta på att du återfår din internetanslutning och gör sedan en ny sökning");
            error.render();
        }

    },

    renderSearchView: function(){
        JobBoard.jobList = [];
        //provinces
        $("<div class='col-md-4'><div id='provinces' class='panel panel-warning'></div></div>").
            appendTo("#content");
        $("<div class='panel-heading'><h4 class='center'>Steg 1. Välj Län</h4></div>").appendTo("#provinces");
        $("<div class='panel-body'><ul id='provincesList'></ul></div>").appendTo("#provinces");

        //counties
        $("<div class='col-md-4'><div id='counties' class='panel panel-warning'></div></div>").
            appendTo("#content");
        $("<div class='panel-heading'><h4 class='center'>Steg 2. Välj Kommun</h4></div>").appendTo("#counties");
        $("<div class='panel-body'><ul id='countiesList'></ul></div>").appendTo("#counties");

        //occupationAreas
        $("<div class='col-md-4'><div id='occupations' class='panel panel-warning'></div></div>").
            appendTo("#content");
        $("<div class='panel-heading'><h4 class='center'>Steg 3. Välj Yrkesområde</h4></div>").appendTo("#occupations");
        $("<div class='panel-body'><ul id='occupationsList'></ul></div>").appendTo("#occupations");

        JobBoard.getProvinces();
    },

    checkForCachedProvinces: function(){
        var cachedProvinces = this.storage.getItem("provinces");
        if(cachedProvinces){
            $("#countiesList").empty();
            cachedProvinces = JSON.parse(cachedProvinces);
            cachedProvinces.forEach(function (province) {
                var newProvince = new Province(province.provinceId, province.provinceName);
                newProvince.render();
            });
            return true;
        }
        return false;
    },

    getProvinces: function(){
        var that = this;
        if (this.checkForCachedProvinces() === false) {
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getProvinces"},
                success: function (data) {
                    if (data.error) {
                        this.error();
                        return false;
                    }
                    var id;
                    var provincesList = [];
                    var provinces = (data);
                    provinces.forEach(function (province) {
                        if (province.provinceId == undefined) {
                            id = province.id;
                        } else {
                            id = province.provinceId;
                        }
                        var newProvince = new Province(id, province.namn);
                        provincesList.push(newProvince);
                        newProvince.render();
                    });
                    that.addToSessionStorage("provinces", provincesList);

                },

                error: function () {
                    var error = new CustomError("För tillfället kan inte några län hämtas", "Vänligen, försök igen senare");
                    error.render();
                }
            });
        }
    },


    cachedCountiesExists: function(provinceId){
        var cachedCounties = this.storage.getItem("counties"+provinceId);
        if(cachedCounties){
            this.renderCachedCounties(JSON.parse(cachedCounties));
            return true;
        }
        return false;
    },

    renderCachedCounties: function(cachedCounties){
        $("#occupationsList").empty();
        $("#countiesList").empty();
        cachedCounties.forEach(function (county) {
            var newCounty = new County(county.countyId, county.countyName);
            newCounty.render();
        })
    },

    getCounties: function(provinceId){
        var that = this;
        if (this.cachedCountiesExists(provinceId) === false) {
            var id;
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getCounties", "provinceId": provinceId},
                success: function (data) {
                    if (data.error) {
                        this.error();
                        return false;
                    }
                    $("#countiesList").empty();
                    var countyList = [];
                    var counties = data;
                    if (counties.length > 0) {
                        counties.forEach(function (county) {
                            if(county.countyId === undefined){
                                id = county.id;
                            } else{
                                id = county.countyId;
                            }
                            var newCounty = new County(id, county.namn);
                            countyList.push(newCounty);
                            newCounty.render();
                        });
                        that.addToSessionStorage("counties"+provinceId, countyList);
                    }
                },

                error: function () {
                    var error = new CustomError("För tillfället kan inte kommuner i valt län hämtas", "Vänligen, försök igen senare");
                    error.render();
                }
            });
        }
    },

    cachedOccupationAreasExists: function(){
      var cachedOccupationAreas = this.storage.getItem("occupationAreas");
        if(cachedOccupationAreas){
            this.renderCachedOccupationAreas(JSON.parse(cachedOccupationAreas));
            return true;
        }
        return false;
    },

    renderCachedOccupationAreas: function(cachedOccupationAreas){
        $("#occupationsList").empty();
        cachedOccupationAreas.forEach(function(occupationArea){
            var newOccupationArea = new OccupationArea(occupationArea.occupationId,
                occupationArea.occupationName);

            newOccupationArea.render();
        })
    },

    getOccupationAreas: function(){
        var that = this;
        if (this.cachedOccupationAreasExists() === false) {
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getOccupationAreas"},
                success: function (data) {
                    if (data.error) {
                        this.error();
                        return false;
                    }
                    var id;
                    var occupationAreaList = [];
                    $("#occupationsList").empty();
                    if (data.length > 0) {
                        data.forEach(function (occupationArea) {
                            if(occupationArea.occupationAreaId === undefined){
                                id = occupationArea.id;
                            } else{
                                id = occupationArea.occupationAreaId;
                            }
                            var newOccupationArea = new OccupationArea(id, occupationArea.namn);
                            occupationAreaList.push(newOccupationArea);
                            newOccupationArea.render();
                        });
                        that.addToSessionStorage("occupationAreas", occupationAreaList);
                    }
                },

                error: function () {
                    var error = new CustomError("För tillfället kan inte yrkesområden hämtas", "Vänligen, försök igen senare");
                    error.render();
                }
            });
        }
    },

    cachedJobsExists: function(occupationAreaId, countyId){
        var cachedJobs = this.storage.getItem("jobs"+occupationAreaId+countyId);
        if(cachedJobs){
            this.renderCachedJobs(JSON.parse(cachedJobs));
            return true;
        }
        return false;
    },

    renderCachedJobs: function(cachedJobs){
        $("#content").empty();
        $("#tips").remove();
        this.renderNewSearchLink();
        cachedJobs.forEach(function(cachedJob){
            var newJob = new Job(cachedJob.jobId, cachedJob.header, cachedJob.jobName);
            JobBoard.jobList.push(newJob);
            newJob.render();
        })
    },

    renderNewSearchLink: function(){
        var newSearch = $("<a href='#'>Ny sökning</a>").appendTo("#content");
        newSearch.click(function (e) {
            e.preventDefault();
            $("#content").empty();
            JobBoard.renderSearchView();
        });
    },

    getJobs: function(occupationAreaId, countyId){
        var that = this;
        if (this.cachedJobsExists(occupationAreaId, countyId) === false) {
            $("#tips").remove();
            $("#content").empty();
            this.renderNewSearchLink();
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getJobs", "countyId": countyId, "occupationAreaId": occupationAreaId},
                success: function (data) {
                    that.jobList = [];
                    var jobList = [];
                    if (data.error) {
                        var error = new CustomError("Det finns inga lediga jobb som matchar din sökning",
                            "Vänligen, gör en ny sökning");
                        error.render();
                        return false;
                    }
                    if (data.length > 0) {
                        data.forEach(function (job) {
                            var newJob = new Job(job.annonsid, job.annonsrubrik, job.yrkesbenamning);
                            jobList.push(newJob);
                            that.jobList.push(newJob);
                            newJob.render();
                        });
                        that.addToSessionStorage("jobs"+occupationAreaId+countyId, jobList);
                    }
                },

                error: function () {
                    var error = new CustomError("Ett fel inträffade när listan på matchande jobb skulle hämtas", "Vänligen, försök igen");
                    error.render();
                }
            });
        }
    },

    supportsSessionStorage: function(){
        try {
            return 'sessionStorage' in window && window['sessionStorage'] !== null;
        } catch (e) {
            return false;
        }
    },
    renderJobList: function(){
        $("#content").empty();
        var backLink = $("<a href='#'>Ny sökning</a>").appendTo("#content");
        backLink.click(function(e){
            e.preventDefault();
            $("#content").empty();
            JobBoard.renderSearchView();
        });
        JobBoard.jobList.forEach(function(job){
            job.render();
        })
    },

    cachedJobAdExists: function(jobAdId){
        var cachedJobAd = JSON.parse(this.storage.getItem('jobAd'+jobAdId));
        if(cachedJobAd){
            this.renderCachedJobAd(cachedJobAd);
            return true;
        }
        return false;
    },

    renderCachedJobAd: function(cachedJobAd){
        $("#content").empty();
        var jobAd = new JobAd(cachedJobAd.id,cachedJobAd.header, cachedJobAd.jobText, cachedJobAd.published,
            cachedJobAd.numberOfJobs, cachedJobAd.countyName, cachedJobAd.workLocationName, cachedJobAd.duration,
            cachedJobAd.workHours, cachedJobAd.salaryType, cachedJobAd.jobName, cachedJobAd.website,
            cachedJobAd.facebook, cachedJobAd.streetName, cachedJobAd.postCode, cachedJobAd.postArea);
        jobAd.render();
    },


    getJob: function(jobAdId){
        JobBoard.jobAd = [];
        if (this.cachedJobAdExists(jobAdId) === false) {
            var that = this;
            $("#content").empty();
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getJob", "jobAdId": jobAdId},
                success: function (data) {
                    if (data.error) {
                        this.error();
                        return false;
                    }

                    if (data) {
                        var jobAd = new JobAd(jobAdId, data.annonsrubrik, data.annonstext, data.publiceraddatum, data.antal_platser,
                            data.kommunnamn, data.arbetsplatsnamn, data.arbetstidvaraktighet, data.arbetstid, data.lonetyp, data.yrkesbenamning,
                            data.webbplats, data.facebook, data.streetName, data.postCode, data.postArea);
                        JobBoard.jobAd.push(jobAd);
                        jobAd.render();
                        that.offlineJobs.push(jobAdId);
                        that.addToSessionStorage('jobAd'+jobAdId, jobAd);
                        that.addToSessionStorage("offlineJobs", that.offlineJobs);
                    }
                },

                error: function () {
                    var error = new CustomError("Ett fel inträffade när valt jobb skulle hämtas", "Vänligen, försök igen");
                    error.render();
                }
            });
        }
    }
};

window.onload = JobBoard.init;