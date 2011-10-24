// Naive node server for interfacing redis

var http = require('http');
var route = require('./route');


function run(port, routes) {

    console.log('Listening at port '+port+'...');
    http.createServer(function (request, response) {
        
        console.log(request.method + ' ' + request.url);
        route.route(request.method, request.url, routes)(request, response);

    }).listen(port); 
}


exports.run = run;
