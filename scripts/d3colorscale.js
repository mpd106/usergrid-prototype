/* global define */
define(["./d3", "./lib/colorbrewer"], function(d3, colorbrewer) {
    var calculateDomain = function(min, max, elements) {
        var result = [],
            range = max - min,
            segmentWidth = range / (elements - 1),
            index;
        for (index = 0; index < elements; index++) {
            result[index] = index * segmentWidth;
        }
        
        return result;
    };
    
    var getScale = function(matrix) {
        var numberOfColors = 9;
        var domain = calculateDomain(0, matrix.max(), numberOfColors);
        var scale = d3.scale.linear()
            .domain(domain)
            .range(colorbrewer.PuBu[numberOfColors].reverse());
        
        return scale;
    };
    
    return {
        getScale : getScale
    };
});