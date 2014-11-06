/**
 * Created by Tobias on 2014-11-05.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var json = {coursename: "", courseUrl: "", courseCode: "", courseText: "", coursePlanUrl: ""};


/* GET users listing. */
app.get('/', function(req, res) {
    var url = "http://coursepress.lnu.se/kurser/?bpage=1";

    request(url, function (error, resp, body) {
        var lastPage;

        var $ = cheerio.load(body);

        //not a secure solution. The webowner can change the structure of the DOM-elements
        lastPage = $('#blog-dir-pag-top :nth-last-child(2)').attr('href');

        //using slice to get the last character containing the last pagenumber
        lastPage = lastPage.slice(-1);

        scrapeCourseNameAndUrl(lastPage);
    });


});

var scrapeCourseNameAndUrl = function(lastPage) {
    var coursename, courseUrl, courseCode, $;


    //loop through every page with courses
    for (var i = 1; i <= lastPage; i++) {

        var url = "http://coursepress.lnu.se/kurser/?bpage=" + i;
        request(url, function (error, response, body) {
            if (!error) {
                $ = cheerio.load(body);

                $('.item-title a').filter(function () {
                    var data = $(this);
                    json.coursename = data.html();
                    json.courseUrl = data.attr('href');
                    scrapeCourseInformation(json.courseUrl);

                });


            }

        })
    }


};

var scrapeCourseInformation = function(url){
    var $, courseCode, courseText;
    request(url, function (error, response, body) {
        $ = cheerio.load(body);

        courseCode = $('#header-wrapper ul li:last-child').text();
        if(courseCode.length == 6){
            json.courseCode = courseCode;
        } else{
            json.courseCode = "No Information!";
        }

        courseText = $('.entry-content :first-child').next().text();
        console.log(courseText);


    })
};

module.exports = app;
