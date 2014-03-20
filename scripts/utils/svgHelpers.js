/* global define */

define(function() {
    return {
        translate: function(x, y) {
            return "translate(" + x + ", " + y + ")";
        },
        rotate: function(deg) {
            return "rotate(" + deg + ")";   
        }
    };
});