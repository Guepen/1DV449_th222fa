/**
 * Created by Tobias on 2014-11-05.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var coursename, courseUrl, courseCode;
var json = {coursename : "", courseUrl : "", courseCode : ""};
var url = "http://coursepress.lnu.se/kurser";
var $;

/* GET users listing. */
app.get('/', function(req, res) {

    var nextPage = $('#pag-top .next');
    nextPage = nextPage.attr('href');
    nextPage = nextPage.replace('/kurser', '');
    nextPage = url + nextPage;
    doRequest(nextPage);

    res.send();
});

var doRequest = function(url){


    request(url, function(error, response, html){
        if(!error){
            $ = cheerio.load(html);

            $('.item-title a').filter(function(){
                var data = $(this);
                json.coursename = data.html();
                json.courseUrl = data.attr('href');
                console.log(json.coursename);

            })


        }

    });
};

module.exports = app;
