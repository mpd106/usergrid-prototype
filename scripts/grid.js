/* global define */
define(function() {
    var init = function(origin, elementSize) {
        var getRowYPos = function(i) {
            return origin.y + i * elementSize;
        };

        var getColXPos = function (i) {
            return origin.x + i * elementSize;
        };
        
        return {
            getColXPos: getColXPos,
            getRowYPos: getRowYPos,
            getOrigin: function() { return origin; },
            getElementSize: function() { return elementSize; }
        };
    };
    
    return {
        init: init
    };
});