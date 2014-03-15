/* global define */

define(["./d3", "./utils/objectUtils"], function(d3, objectUtils) {
    var demoData = [
        { "First" : 1, "Second" : 6, "Third" : 0, "Fourth" : 5, "Fifth" : 2 },
        { "First" : 2, "Second" : 3, "Third" : 1, "Fourth" : 4, "Fifth" : 1 },
        { "First" : 0, "Second" : 8, "Third" : 0, "Fourth" : 7, "Fifth" : 3 },
        { "First" : 1, "Second" : 7, "Third" : 2, "Fourth" : 9, "Fifth" : 2 }
    ];
    
    var getDataFromCsv = function(pathToCsv, callback) {
        d3.csv(pathToCsv)
            .row(function(d) {
                var result = {};
                objectUtils.forEachProperty(d, function(obj, prop) {
                    result[prop] = +obj[prop];
                });
                return result;
            })
            .get(function(error, rows) {
                callback(error, rows);
            });
    };
    
    var getData = function(callback, pathToCsv) {
        if (arguments.length == 1) {
            callback(null, demoData);
        } else {
            getDataFromCsv(pathToCsv, callback);
        }
    };
    
    return {
        getData : getData
    };
});