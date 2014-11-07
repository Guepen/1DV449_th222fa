/**
 * Created by Tobias on 2014-11-05.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var Json = {courses: [], latestScrape: "", numberOfCourses: ""};
var jsonToClient;


var readFromFile = function(){
    fs.readFile('data.json', function(err, data) {
        var json = JSON.parse(data);
        console.log();
        if (Date.now() - Json.latestScrape > ) {
            startScrape();
            console.log("HHHHH");



        }




        jsonToClient = json;


    });

};

var writeToFile = function(jsonObj){
    fs.writeFile('data.json', JSON.stringify(jsonObj));

};

var startScrape = function(){
    var url = "http://coursepress.lnu.se/kurser/?bpage=1";

    request(url, function (error, resp, body) {
        var lastPage;
        var $ = cheerio.load(body);

        //not a secure solution. The webowner can change the structure of the DOM-elements
        lastPage = $('#blog-dir-pag-top :nth-last-child(2)').attr('href');

        //using slice to get the last character containing the last pagenumber
        lastPage = lastPage.slice(-1);

        scrapeCourseNameAndUrl(lastPage, function(){

          writeToFile(Json);
            jsonToClient = JSON.stringify(Json);
        });


    });
};

/* GET users listing. */
app.get('/', function(req, res) {

    readFromFile();

    var timeout = setTimeout(function(){


        res.send(jsonToClient);
    },30000)


});

var scrapeCourseNameAndUrl = function(lastPage, callback) {
    var coursename, courseUrl, courseCode, $;
    var pageCounter = 0;

    var status;
    var date = new Date();

    var year = date.getFullYear();
    var timeStamp = date.getTime();
    var month = date.getMonth() +1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var millisecond = date.getMilliseconds();
    Json.latestScrape = date.toISOString();

    Json.latestScrape = timeStamp ;




    //loop through every page with courses
    for (var i = 1; i <= lastPage; i++) {

        var url = "http://coursepress.lnu.se/kurser/?bpage=" + i;
        request(url, function (error, response, body) {
            //var currentPage = i;
            status = response.statusCode;

            if (!error) {

                $ = cheerio.load(body);

                $('.item-title a').filter(function () {

                    var course = {coursename: "", courseUrl: "", courseCode: "", courseText: "", coursePlanUrl: "",
                        Post: {Author: "", Time: "", Title: ""}};
                    var data = $(this);
                    course.coursename = data.text();
                    course.courseUrl = data.attr('href');

                    scrapeCourseInformation(course.courseUrl, course, Json, lastPage, callback);


                });

            }
        });

    }





};

var scrapeCourseInformation = function(url, courseObj, jsonObj, lastPage, callback){
    var $, courseCode, courseText, coursePlanUrl, status;

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

        var latestPost = {Title: "", Author: "", Time: ""}
        var latestPostHtml = $('#latest-post').parent().next().html();
        courseObj.Post.Author = $('.entry-header .entry-byline strong').first().text();
        courseObj.Post.Title = $('.entry-header .entry-title').first().text();

        var postDate = $('.entry-header .entry-byline').text();
         var date = postDate.match(/\d{4}-\d{2}-\d{2}/);
        var time = postDate.match(/\d{2}:\d{2}/);


        if (date !== null) {
            courseObj.Post.Time = date[0] + " " + time[0];
        } else{
            courseObj.Post.Time = "No Information";
        }
        jsonObj.numberOfCourses = jsonObj.courses.length;
        jsonObj.courses.push(courseObj);




        callback();


    });


};


module.exports = app;
