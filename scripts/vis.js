/* global require, console */

require.config({paths: {d3: "http://d3js.org/d3.v3.min"}});

require(["d3", "datasource", "./utils/objectUtils", "matrix", "./d3scale"],
        function(d3, datasource, objectUtils, matrix, d3scale) {
    var minElementDimension = 5;
    
    var realDataUrl = "all data no minimum usage 10-03-2014.csv";
    
    var setChartArea = function(chart, width, height) {        
        chart.attr("width", width)
             .attr("height", height);
    };
    
    var calculateChartArea = function(data) {        
        return {
            height : data.length * minElementDimension,
            width : objectUtils.numProperties(data[0]) * minElementDimension
        };
    };
    
    var getRowYPos = function(d, i) {
        var y = i * minElementDimension;
        return svgHelpers.translate(0, y);
    };
    
    var getColXPos = function (d, i) {
        return i * minElementDimension;
    };
    
    var getElementColour = function(scale, d) {
        return scale(d);
    };
    
    var svgHelpers = {
        translate : function(x, y) {
            return "translate(" + x + ", " + y + ")";
        }
    };
    
    datasource.getData(function(error, data) {
        var chart = d3.select(".chart");
        var dimensions = calculateChartArea(data);
        
        var m = matrix.create(data);
        m.threshold(0, 50);
        
        setChartArea(chart, dimensions.width, dimensions.height);
        
        var scale = d3scale.getScale(m);
        
        // Add rows
        var rows = chart.selectAll("g")
            .data(m)
          .enter()
            .append("g")
            .attr("transform", getRowYPos);

        // Add each element to each row
        var cols = rows.selectAll("g g")
            .data(function(d) {
                return d;
            })
          .enter()
            .append("rect")
            .attr("x", getColXPos)
            .attr("width", minElementDimension)
            .attr("height", minElementDimension)
            .attr("fill", function(d) { return getElementColour(scale, d); });
    }/*,
    realDataUrl*/);
});