/* global define */

define(["./utils/objectUtils"], function(objectUtils) {
    var init = function(margin) {
        // TODO: pass these into a constructor / make it configurable
        // TODO: separate d3-related stuff from conceptual stuff (i.e. chart from data in here)
        // TODO: memoize the calculations in here
        // TODO: this entire object is gash--bin it
        var chartWidth = 900,
            maxElementDimension = 20,
            headerPad = 10;

        var setChartArea = function(chart, width, height) {        
            chart.attr("width", width)
                 .attr("height", height);
        };

        var calculateElementSize = function(data) {
            var numColumns = objectUtils.numProperties(data[0]),
                idealElementSize = chartWidth / numColumns,
                elementSize = Math.min(maxElementDimension, idealElementSize);

            return elementSize;
        };

        var calculateChartArea = function(gridArea, elementSize, headerHeight) {
            return {
                height : margin.top + margin.bottom + headerHeight + headerPad + gridArea.height,
                width : margin.left + margin. right + gridArea.width
            };
        };

        var calculateGridArea = function(data, elementSize) {
            return {
                height: data.length * elementSize,
                width: objectUtils.numProperties(data[0]) * elementSize
            };
        };

        var setupChartArea = function(chart, data, headerHeight) {
            var elementSize = calculateElementSize(data),
                gridArea = calculateGridArea(data, elementSize, headerHeight),
                chartArea = calculateChartArea(gridArea, elementSize, headerHeight);

            setChartArea(chart, chartArea.width, chartArea.height);
        };

        var getGridOrigin = function(chart, headerHeight) {
            return {
                x: margin.left,
                y: margin.top + headerHeight + headerPad
            };
        };
        
        return {
            setupChartArea: setupChartArea,
            getOrigin: function() { return { x: margin.left, y: margin.top }; },
            getGridOrigin: getGridOrigin,
            getElementSize: calculateElementSize
        };
    };
    
    return {
        init: init
    };
});