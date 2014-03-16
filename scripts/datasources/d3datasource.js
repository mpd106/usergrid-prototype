/* global define */

define(["module", "../d3", "../utils/objectUtils"], function(module, d3, objectUtils) {
    var csvPath = module.config().d3datasource.csvPath;
    
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
    
    var getData = function(callback) {
        getDataFromCsv(csvPath, callback);
    };
    
    return {
        getData : getData
    };
});