/**
 * Created by Tobias on 2014-12-11.
 */

/**
 * Contains in this order:
 * @type {
 * {searchQueries: {countyId: undefined, occupationId: undefined}, jobList: Array, jobAd: Array,
 * jobAdsId: Array, online: boolean, init: Function, checkConnection: Function,
 * addToSessionStorage: Function, onlineAlert: Function, offlineAlert: Function, offlineJobList: Function,
 * renderSearchView: Function, getProvinces: Function, getCounties: Function, getOccupationAreas: Function,
 * getJobs: Function, supportsLocalStorage: Function, renderJobList: Function, getJob: Function}
 * }
 */
var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},
    jobList: [],
    jobAd: [],
    jobAdsId: [],
    storage: sessionStorage,
    online: true,

    /**
     * called on window.onload
     */
    init: function(){
        $(".close").click(function(){
            $("#tips").remove();
        });

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
        if (JobBoard.supportsLocalStorage()) {
            sessionStorage.setItem("jobAds", JSON.stringify(this.jobAdsId));
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    },

    onlineAlert: function(){
        if (JobBoard.online === false) {
            JobBoard.online = true;
            $("#offlineContent").remove();

            $("<div id='onlineContent' class='row'><div class='col-md-12'><div id='online' class='alert alert-success'>" +
            "</div></div></div>").insertBefore(".jumbotron");

            $("<h3>Du har nu återfått din internetanslutning</h3><a id='newSearch' class='btn btn-link' " +
            "href='#'>Gör ny sökning</a>").appendTo("#online");

            //click-event for new search
            $("#newSearch").click(function(){
                $("#onlineContent").remove();
                $("#content").empty();
                JobBoard.renderSearchView();
            });
        }
    },

    offlineAlert: function(){
        $("#content").empty();
        $("<div id='offlineContent' class='row'><div class='col-md-12'><div id='offline' class='alert alert-warning'>" +
        "<a href='#' class='close' data-dismiss='alert'>&times;</a></div></div></div>").insertBefore(".jumbotron");
        $("<h3>Det verkar som du har tappat din internetanslutning" +
        " men du kan fortfarande komma åt de jobb som du har visat tidigare</h3>").appendTo("#offline");

        //close the alert
        $(".close").click(function(){
            $("#offlineContent").remove();
        })
    },

    offlineJobList: function(){
        var jobAdsList = JSON.parse(sessionStorage.getItem("jobAds"));
        if (jobAdsList) {
            jobAdsList.forEach(function (jobAdId) {
                var jobAd = JSON.parse(sessionStorage.getItem(jobAdId));

                var job = new Job(jobAdId, jobAd.header, jobAd.jobName);
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
        var cachedJobAd = JSON.parse(sessionStorage.getItem(jobAdId));
        var newJobAd = new JobAd(cachedJobAd.header, cachedJobAd.jobText, cachedJobAd.published,
            cachedJobAd.numberOfJobs, cachedJobAd.countyName, cachedJobAd.workLocationName, cachedJobAd.duration,
            cachedJobAd.workHours, cachedJobAd.salaryType, cachedJobAd.jobName, cachedJobAd.website,
            cachedJobAd.facebook, cachedJobAd.streetName, cachedJobAd.postCode, cachedJobAd.postArea);
        newJobAd.render();

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

    getProvinces: function(){
        if (JobBoard.online) {
            $.ajax({
                "type": "POST",
                "url": "Controller/WorkController.php",
                "dataType": "json",
                "data": {"mode": "getProvinces"},
                success: function (data) {
                    var id;
                    console.log(data);
                    if (data.error) {
                        this.error();
                        return false;
                    }
                    var provinces = (data);
                    provinces.forEach(function (province) {
                        if (province.provinceId == undefined) {
                            id = province.id;
                        } else {
                            id = province.provinceId;
                        }
                        var newProvince = new Province(id, province.namn, province.antal_platsannonser);
                        newProvince.render();
                    })

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

    getCounties: function(provinceId){
        if (JobBoard.online) {
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

                    var counties = data;
                    if (counties.length > 0) {
                        counties.forEach(function (county) {
                            if(county.countyId === undefined){
                                id = county.id;
                            } else{
                                id = county.countyId;
                            }
                            var newCounty = new County(id, county.namn);
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
                    if (data.error) {
                        this.error();
                        return false;
                    }
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
        console.log(countyId);
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
                    if (data.error) {
                        var error = new CustomError("Det finns inga lediga jobb som matchar din sökning",
                            "Vänligen, gör en ny sökning");
                        error.render();
                        return false;
                    }
                    if (data.length > 0) {
                        data.forEach(function (job) {
                            var newJob = new Job(job.annonsid, job.annonsrubrik, job.yrkesbenamning);
                            JobBoard.jobList.push(newJob);

                            newJob.render();
                        });
                    }
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

    checkForCachedJob: function(jobAdId){
        var cachedJobAds = JSON.parse(sessionStorage.getItem('jobAds'));
        if (cachedJobAds) {
            cachedJobAds.forEach(function (cachedJobAdId) {
                if(jobAdId == cachedJobAdId){
                    console.log("cached jobAd");
                    $("#content").empty();
                    var cachedJobAd = JSON.parse(sessionStorage.getItem(jobAdId));
                    var jobAd = new JobAd(cachedJobAd.header, cachedJobAd.jobText, cachedJobAd.published,
                        cachedJobAd.numberOfJobs, cachedJobAd.countyName, cachedJobAd.workLocationName, cachedJobAd.duration,
                        cachedJobAd.workHours, cachedJobAd.salaryType, cachedJobAd.jobName, cachedJobAd.website,
                        cachedJobAd.facebook, cachedJobAd.streetName, cachedJobAd.postCode, cachedJobAd.postArea);
                    jobAd.render();
                    return true;

                }
            });
        }

        return false;
    },

    getJob: function(jobAdId){
        JobBoard.jobAd = [];
        if (this.checkForCachedJob(jobAdId) === false) {
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
                        var jobAd = new JobAd(data.annonsrubrik, data.annonstext, data.publiceraddatum, data.antal_platser,
                            data.kommunnamn, data.arbetsplatsnamn, data.arbetstidvaraktighet, data.arbetstid, data.lonetyp, data.yrkesbenamning,
                            data.webbplats, data.facebook, data.streetName, data.postCode, data.postArea);
                        JobBoard.jobAd.push(jobAd);

                        jobAd.render();
                        that.jobAdsId.push(jobAdId);
                        JobBoard.addToSessionStorage(jobAdId, jobAd);
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