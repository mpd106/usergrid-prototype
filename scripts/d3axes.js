/* global define */
define(["./d3"], function(d3) {
    var getAxisScale = function(axisNames, datumWidth) {
        var axisWidth = axisNames.length * datumWidth,
            axisScale = d3.scale.ordinal()
            .rangeRoundBands([0, axisWidth])
            .domain(axisNames);
        
        return axisScale;
    };
    
    return {
        getAxisScale : getAxisScale
    };
});