/**
 * Created by Tobias on 2014-11-05.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();




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
    var Json = {courses: []};



    //loop through every page with courses
    for (var i = 1; i <= lastPage; i++) {

        var url = "http://coursepress.lnu.se/kurser/?bpage=" + i;
        request(url, function (error, response, body) {
            if (!error) {
                $ = cheerio.load(body);

                $('.item-title a').filter(function () {
                    var course = {coursename: "", courseUrl: "", courseCode: "", courseText: "", coursePlanUrl: ""};
                    var data = $(this);
                    course.coursename = data.text();
                    course.courseUrl = data.attr('href');

                    scrapeCourseInformation(course.courseUrl, course, Json);


                });



            }



        });

    }





};

var scrapeCourseInformation = function(url, courseObj, jsonObj){
    var $, courseCode, courseText, coursePlanUrl;
    request(url, function (error, response, body) {
        $ = cheerio.load(body);

        courseCode = $('#header-wrapper ul li:last-child').text();
        if(courseCode.length == 6){
            courseObj.courseCode = courseCode;
        } else{
            courseObj.courseCode = "No Information!";
        }

        courseObj.courseText = $('.entry-content p').text();
        $('section .menu-item a').filter(function(){
            var data = $(this);
            if(data.text().match("Kursplan")){
                courseObj.coursePlanUrl = data.attr('href');
            }
        });

        var latestPost = $('#latest-post').parent().next().text();
        jsonObj.courses.push(courseObj);
        console.log(jsonObj);

    });


};

module.exports = app;
