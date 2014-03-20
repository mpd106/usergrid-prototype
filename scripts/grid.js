/* global define */
define(function() {
    var init = function(origin, elementSize) {
        var getRowYPos = function(i, elementSize) {
            return origin.y + i * elementSize;
        };

        var getColXPos = function (i, elementSize) {
            return origin.x + i * elementSize;
        };
        
        return {
            getColXPos: getColXPos,
            getRowYPos: getRowYPos
        };
    };
    
    return {
        init: init
    };
});