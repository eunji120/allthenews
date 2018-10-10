//npm modules
var express = require('express');
//var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

//var mongoose = require('mongoose');
//var Promise = require("bluebird");

//mongoDB models
var Articles = require("../models/articles");
var Comments = require("../models/comments");

//website to be scraped
var url = "https://www.theglobeandmail.com/"

//testing route to verify scraping from route
router.get('/test', function(req, res) {
    //html body with request
    request(url, function(error, response, html) {
        //load into cheerio
        var $ = cheerio.load(html);
        var result = [];
        $(".span6").each(function(i, element) {
            var title = $(element).find("a").find("img").attr("title");
            var link = $(element).find("a").find("img").attr("href");
            var summary = $(element).find(".td-post-text-excerpt").text();
            summary = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
            result.push({
                Title: title,
                Story: link,
                Summary: summary
            });
        });
        console.log(result);
        res.send(result);
    });
});

//default route renders the inde handlebars view
router.get('/', function(req, res) {
    res.render('index');
});

//scraping the website and assign stories to the db
router.get('/scrape', function(req, res) {
    request(url, function(error, response, html) {
        var $ = cheerio.load(html);
        var result = [];
            $(".span6").each(function(i, element) {
                var title = $(element).find("a").find("img").attr("title");
                var link = $(element).find("a").find("img").attr("href");
                var summary = $(element).find(".td-post-text-excerpt").text();
                summary = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                    result[i] = ({
                        title: title,
                        link: link,
                        summary: summary
                    });
                    //checking db
                    Articles.findOne({'title': title}, function(err, articleRecord) {
                        if(err) {
                            console.log(err);
                        } else {
                            if(articleRecord == null) {
                                Articles.create(result[i], function(err, record) {
                                    if(err) throw err;
                                    console.log("Record added");
                                });
                            } else {
                                console.log("No record added");
                            }
                        }
                    });
            });
    });
});

//getting current articles in db
router.get('/articles', function(req, res) {
    Articles.find().sort({ createdAt: -1}).exec(function(err, data) {
        if(err) throw err;
        res.json(data);
    });
});

//getting comments for an article
router.get('/comments/:id', function(req, res) {
    Comments.find({'articleId': req.params.id}).exec(function(err, data) {
        if(err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});

//adding comment
router.post('/addcomment/:id', function(req, res) {
    console.log(req.params.id+' '+req.body.comment);
    Comments.create({
        articleId: req.params.id,
        name: req.body.name,
        comment: req.body.comment
    }, function(err, docs) {
        if(err) {
            console.log(err);
        } else {
            console.log("New comment added");
        }
    }); 
});

//deleting comment
router.get('/deletecomment/:id', function(req, res) {
    console.log(req.params.id)
    Comments.remove({'_id': req.params.id}).exec(function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log("Comment deleted");
        }
    })
});

module.exports = router;