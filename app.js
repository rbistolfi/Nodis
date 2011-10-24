// Naive node server for interfacing redis

var server = require('./server');
var handlers = require('./handlers');


var routes = {GET: {}, POST: {}};
routes['GET']['/libros$'] = handlers.redisList;          // handle /<list>
routes['GET']['/libros/\\d+$'] = handlers.objectByIndex; // handle /<list>/<index>
routes['POST']['/libros$'] = handlers.addObject;         // handle post
routes['defaultHandler'] = handlers.defaultHandler;      // handle everything else (404)

server.run(8124, routes);
