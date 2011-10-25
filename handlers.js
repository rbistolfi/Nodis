// handlers


var urlUtil = require('url');
var redis = require('redis').createClient();
var querystring = require('querystring');


// handler for /libros
function redisList(request, response, key) {
    console.log('Redis list requested');
    
    url = urlUtil.parse(request.url, true);
    
    // test if there is a query string
    if (Object.keys(url.query).length == 0) {

        // there is no query string
        console.log('There is no query string');
        
        // remove the / from the path
        // k = url.pathname.substring(1);
        k=key;

        // query redis and write response
        o = redis.lrange(k, 0, -1, 
            function (err, val) {
                if (!val) {
                    response.writeHead(404);
                    response.end();
                } else {
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    response.end('['+val.toString()+']', 'utf8');
                }
            });
    }

    else {
        // there is a query string
        console.log("Query: " + JSON.stringify(url.query));
        // get the key and the query
        k = url.pathname.substring(1);
        query = url.query; //querystring.parse(url.query);
        
        // start the response
        response.writeHead(200, {'Content-Type': 'application/json'});

        // find 1st match and write it
        redis.lrange(k, 0, -1,
                function (err, val) {
                    console.log("inspecting " + val);
                    list = JSON.parse('[' + val + ']');

                    // test if there is a match
                    results = new Array();
                    for (i in list) {
                        matchs = true;
                        obj = list[i];
                        for (var key in query) {
                            if (query[key] != obj[key]) {
                                matchs = false;
                            }
                        }
                        if (matchs) {
                            console.log("Match found");
                            results.push(obj);
                        }
                    }
                    response.end(JSON.stringify(results));
                });
    }
}

// /foos
function collection(request,response){
    console.log('collection requested');
    req_path = request.url;
    regexp = /^\/([^/]+)\/?$/;
    result = regexp.exec(req_path);
    redisList(request, response, result[1]);
}

// handler for /libros/<id>
function objectByIndex(request, response, object, index) {
    console.log('Redis object by index requested');
    k = object;
    i = index;
    o = redis.lindex(k, i, 
        function (err, val) {
            if (!val) {
                response.writeHead(404);
                response.end();
            } else {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(val.toString(), 'utf8');
            }
        });

}


// /foos
function member(request,response){
    console.log('resource requested');
    req_path = request.url;
    regexp = /^\/([^/]+)\/(\d+)\/?$/;
    result = regexp.exec(req_path);
    objectByIndex(request, response, result[1], result[2]);
}

// handler POST to /libros
function addObject(request, response, object) {

    console.log('Handling POST');

    var postBody = '';

    request.addListener("data", function(chunk) {
        postBody += chunk.toString();
    });

    request.addListener("end", function() {
        redis.rpush(object, postBody);
        response.writeHead(200);
        response.end();
    });
}

function resource_post(request,response) {
    console.log('resource_post');
    req_path = request.url;
    console.log(request.url);
    regexp = /^\/([^/]+)\/?$/;
    result = regexp.exec(req_path);
    addObject(request, response, result[1]);
}


function defaultHandler(request, response) {
    console.log('Default handler');
    response.writeHead(404);
    response.end();
}

exports.redisList = redisList;
exports.objectByIndex = objectByIndex;
exports.defaultHandler = defaultHandler;
exports.addObject = addObject;
exports.collection = collection;
exports.member = member;
exports.resource_post = resource_post;

