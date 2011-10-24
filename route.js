// Route handling

function route(method, path, routes) {
    for (var re in routes[method]) {
        pattern = new RegExp(re);
        if (pattern.test(path)) {
            return routes[method][re];
        }
    }
    return routes['defaultHandler'];
}


exports.route = route;
