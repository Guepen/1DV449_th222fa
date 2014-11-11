/**
 * Created by Tobias on 2014-11-05.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio'); // core JQUERY specifically for the server
var app = express();

var Json = {courses: [], latestScrape: "", numberOfCourses: ""};
var jsonToClient;


/* GET users listing. */
app.get('/', function(req, res) {

    readFromFile();

    setTimeout(function () {

        res.send(jsonToClient);

    }, 10000)

});

var readFromFile = function(){
    fs.readFile('data.json', function(err, data) {
        console.log(data);
        if(data !== undefined){
            var json = JSON.parse(data);


            //make new scrape if 5 minutes has passed since the last scrape
            if (Date.now() - json.latestScrape > 300000){
                startScrape();

            } else{
                jsonToClient = JSON.stringify(json);
            }

        } else{
            startScrape();
        }
    })

};

var writeToFile = function(jsonObj){
    fs.writeFile('data.json', JSON.stringify(jsonObj));

};

function getNoInformation(){
    return "No Information!";
}

var startScrape = function(){
    var url = "http://coursepress.lnu.se/kurser/?bpage=1";

    //Maybe should use an user-agent instead
    var identifier = "Tobias Holst, Webbskrapa, th222fa@student.lnu.se";

    request(url, identifier, function (error, resp, body) {
        var lastPage;
        var $ = cheerio.load(body);

        //not a secure solution. The webowner can change the structure of the DOM-elements
        lastPage = $('#blog-dir-pag-top :nth-last-child(2)').attr('href');

        //using slice to get the last character containing the last pagenumber
        lastPage = lastPage.slice(-1);

        scrapeCourseNameAndUrl(lastPage, identifier, function(){
            console.log('callback');

            writeToFile(Json);
            jsonToClient = JSON.stringify(Json);

        });


    });
};

var scrapeCourseNameAndUrl = function(lastPage, identifier, callback) {
    var $;
    var date = new Date();

    Json.latestScrape = date.getTime();

    //loop through every page with courses
    for (var i = 1; i <= lastPage; i++) {

        var url = "http://coursepress.lnu.se/kurser/?bpage=" + i;
        request(url, identifier, function (error, response, body) {

            if (!error) {

                $ = cheerio.load(body);

                $('.item-title a').filter(function () {

                    var data = $(this);

                    if (data.attr('href').match(/kurs/)) {
                        console.log("ny kurs");
                        var course = {coursename: "", courseUrl: "", courseCode: "", courseText: "", coursePlanUrl: "",
                            Post: {Author: "", Time: "", Title: ""}};

                        course.coursename = data.text();
                        course.courseUrl = data.attr('href');

                        scrapeCourseInformation(course.courseUrl, course, Json, lastPage, identifier, callback);
                    }

                });
            }
        });
    }

};

var scrapeCourseInformation = function(url, courseObj, jsonObj, lastPage, identifier, callback){
    var $, courseCode;

    request(url, identifier, function (error, response, body) {
        $ = cheerio.load(body);

        courseCode = $('#header-wrapper ul li:last-child').text();
        //Not a great solution
        if(courseCode.length == 6){
            courseObj.courseCode = courseCode;
        } else{
            courseObj.courseCode = getNoInformation();
        }

        //TODO improve this match
        courseObj.courseText = $('.entry-content p').first().text();

        $('section .menu-item a').filter(function(){
            var data = $(this);
            if(data.text().match("Kursplan") || data.text().match("Course Syllabus") || data.text().match("Course Plan")){
                courseObj.coursePlanUrl = data.attr('href');
            }
        });

        if(courseObj.coursePlanUrl === null ||courseObj.coursePlanUrl.length <= 0){
            courseObj.coursePlanUrl = getNoInformation();
        }

        if ($('.entry-header .entry-byline strong').first().text().length > 0) {
            courseObj.Post.Author = $('.entry-header .entry-byline strong').first().text();

        } else{
            courseObj.Post.Author = getNoInformation();
        }

        if ($('.entry-header .entry-title').first().text().length > 0 ){
            courseObj.Post.Title = $('.entry-header .entry-title').first().text();

        } else{
            courseObj.Post.Title = getNoInformation();
        }

        var postDate = $('.entry-header .entry-byline').text();
        var date = postDate.match(/\d{4}-\d{2}-\d{2}/);
        var time = postDate.match(/\d{2}:\d{2}/);


        if (date !== null && time !== null) {
            courseObj.Post.Time = date[0] + " " + time[0];

        } else{
            courseObj.Post.Time = getNoInformation();
        }
        jsonObj.numberOfCourses = jsonObj.courses.length;
        jsonObj.courses.push(courseObj);

        callback();
    });


};


module.exports = app;
