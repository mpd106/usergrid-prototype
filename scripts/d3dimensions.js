/* global define */

define(["./utils/objectUtils"], function(objectUtils) {
    // TODO: pass these into a constructor / make it configurable
    // TODO: separate d3-related stuff from conceptual stuff (i.e. chart from data in here)
    // TODO: memoize the calculations in here
    var chartWidth = 800,
        maxElementDimension = 20,
        margin = {top: 20, right: 20, bottom: 20, left: 20},
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
    
    var calculateHeaderHeight = function(chart) {
        var header = chart.select("g.event-headers"),
            headerDimensions = header.node().getBBox(),
            headerHeight = headerDimensions.height;
        
        return headerHeight;
    };
    
    var calculateChartArea = function(cellArea, elementSize, headerHeight) {
        return {
            height : margin.top + margin.bottom + headerHeight + headerPad + cellArea.height,
            width : margin.left + margin. right + cellArea.width
        };
    };
    
    var calculateCellArea = function(data, elementSize) {
        return {
            height: data.length * elementSize,
            width: objectUtils.numProperties(data[0]) * elementSize
        };
    };
    
    var setupChartArea = function(chart, data) {
        var elementSize = calculateElementSize(data),
            headerHeight = calculateHeaderHeight(chart),
            cellArea = calculateCellArea(data, elementSize, headerHeight),
            chartArea = calculateChartArea(cellArea, elementSize, headerHeight);
        
        setChartArea(chart, chartArea.width, chartArea.height);
    };
    
    var getGridOrigin = function(chart) {
        var headerHeight = calculateHeaderHeight(chart);
        return {
            x: margin.left,
            y: margin.top + headerHeight + headerPad
        };
    };
    
    return {
        setupChartArea: setupChartArea,
        getOrigin: function() { return { x: margin.left, y: margin.top }; },
        getGridOrigin: getGridOrigin,
        getHeaderHeight: calculateHeaderHeight,
        getElementSize: calculateElementSize
    };
});