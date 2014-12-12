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

        $("#location-search").click(function(){
            JobBoard.getProvinces();
        })

    },

    getProvinces: function(){
        var that = this;
        $.ajax({
            "type": "POST",
            "url": "Services/Provinces.php",
            "dataType": "json",
            success: function(data){
                console.log(that);
                var provinces = data.soklista.sokdata;
                if(provinces.length > 0){
                    provinces.forEach(function(province){
                        var newProvince = new Province(province.id, province.namn, province.antal_platsannonser)
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
            "url": "Services/County.php",
            "dataType": "json",
            "data": {"id": id},
            success: function(data) {

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
            "url": "Services/Occupations.php",
            "dataType": "json",
            "data": countyId,
            success: function(data){
                var occupations = data.soklista.sokdata;
                console.log(occupations);
                if(occupations.length > 0){
                    occupations.forEach(function(occupation){
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