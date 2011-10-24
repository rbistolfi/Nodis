// Naive node server for interfacing redis

var http = require('http');
var route = require('./route');
var url = require('url');

function run(port, routes) {

    console.log('Listening at port '+port+'...');
    http.createServer(function (request, response) {
        
        console.log(request.method + ' ' + request.url);
        request.setEncoding("utf8");
        route.route(request.method, url.parse(request.url).pathname, routes)(request, response);

    }).listen(port); 
}


exports.run = run;
