/* global define */

define(function() {
    var forEachProperty = function(obj, callback) {
        var count = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                callback(obj, prop, count);
                count += 1;
            }
        }
    };
    
    var numProperties = function(obj) {
        var count = 0;
        forEachProperty(obj, function() {
            count += 1;
        });
        
        return count;
    };
    
    return {
        forEachProperty : forEachProperty,
        numProperties : numProperties
    };
});