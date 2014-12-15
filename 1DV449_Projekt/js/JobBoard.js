/**
 * Created by Tobias on 2014-12-11.
 */

var JobBoard = {
    searchQueries: {'countyId': undefined, 'occupationId': undefined},
    provinces: [],
    counties: [],
    occupations: [],

    init: function(){
        JobBoard.getProvinces();

        var provincesList =  $("#provincesList");

        $("#location-search").click(function(){
            provincesList.empty();
            JobBoard.getProvinces();
        });


    },

    getProvinces: function(){
        var that = this;
        $.ajax({
            "type": "POST",
            "url": "WorkService.php",
            "dataType": "json",
            "data": {"mode": "getProvinces"},
            success: function(data){
                console.log(data);
                var provinces = (data);
                if(provinces.length > 0){
                    provinces.forEach(function(province){
                        var newProvince = new Province(province.id, province.namn, province.antal_platsannonser);
                        that.provinces.push(newProvince);
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
        var that = this;
        $.ajax({
            "type": "POST",
            "url": "WorkService.php",
            "dataType": "json",
            "data": {"mode": "getCounties", "provinceId": id},
            success: function(data) {
                console.log(data);

                var counties = data.soklista.sokdata;
                if (counties.length > 0) {
                    counties.forEach(function (county) {
                        var newCounty = new County(county.id, county.namn, county.antal_platsannonser)
                        that.counties.push(newCounty);
                        newCounty.render();
                    })
                }
            },

            error: function(xhr, text){
                alert(text);
            }
        });
    },

    getOccupations: function(countyId){
        var that = this;
        console.log(countyId);
        $.ajax({
            "type": "POST",
            "url": "WebServices/Occupations.php",
            "dataType": "json",
            "data": countyId,
            success: function(data){
              //  var occupations = data.soklista.sokdata;
                //console.log(occupations);
                if(data.length > 0){
                    data.forEach(function(occupation){
                        var newOccupation = new Occupation(occupation.id, occupation.namn);
                        that.occupations.push(newOccupation);
                        newOccupation.render();

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