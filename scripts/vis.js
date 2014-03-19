/* global require, console */

require.config({
    paths : { d3: "http://d3js.org/d3.v3.min" },
    config : {
        "datasources/generativeDatasource" : {
            numberOfEvents : 10,
            numberOfUsers  : 50
        },
        "datasources/d3datasource" : {
            csvPath : "all data no minimum usage 10-03-2014.csv"
        }
    }
});

require(["d3", "datasources/generativeDatasource", "utils/objectUtils", "matrix", "d3colorscale", "d3axes"],
        function(d3, datasource, objectUtils, matrix, d3colorscale, d3axes) {
    var chartWidth = 800,
        maxElementDimension = 20,
        margin = {top: 20, right: 20, bottom: 20, left: 40};

    var setChartArea = function(chart, width, height) {        
        chart.attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom);
    };

    var calculateElementSize = function(data) {
        var numColumns = objectUtils.numProperties(data[0]),
            idealElementSize = chartWidth / numColumns,
            elementSize = Math.min(maxElementDimension, idealElementSize);
        
        return elementSize;
    };
            
    var calculateChartArea = function(data, elementSize) {
        return {
            height : data.length * elementSize,
            width : objectUtils.numProperties(data[0]) * elementSize
        };
    };
    
    var getRowYPos = function(i, elementSize) {
        var y = margin.top + i * elementSize;
        return svgHelpers.translate(0, y);
    };
    
    var getColXPos = function (i, elementSize) {
        return margin.left + i * elementSize;
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
        var elementSize = calculateElementSize(data);
        var dimensions = calculateChartArea(data, elementSize);
        
        var m = matrix.create(data);
        m.threshold(0, 50);
        
        setChartArea(chart, dimensions.width, dimensions.height);
        
        var scale = d3colorscale.getScale(m);
        var xAxis = d3.svg.axis()
            .scale(d3axes.getAxisScale(m.colNames, elementSize))
            .orient("top");
        
        // Add xAxis
/*        
        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + 50 + ", " + 10 + ")")
            .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-90)" ;
            });
*/        
        // Better xAxis
        chart.append("g")
            .attr("class", "x axis")
          .selectAll("text")
            .data(m.colNames)
          .enter()
            .append("g")
            .attr("transform", function(d, i) {
                var translation = svgHelpers.translate(getColXPos(i, elementSize) + elementSize / 2, 0),
                    rotation = "rotate(90)";
                return translation;
            })
            .append("text")
            .attr("style", "writing-mode: tb")
            .text(function(d) { return d; });
        
        // Add rows
        var rows = chart.selectAll("g")
            .data(m)
          .enter()
            .append("g")
            .attr("transform", function(d, i) { return getRowYPos(i, elementSize); });

        // Add each element to each row
        var cols = rows.selectAll("g g")
            .data(function(d) {
                return d;
            })
          .enter()
            .append("rect")
            .attr("x", function(d, i) { return getColXPos(i, elementSize); })
            .attr("width", elementSize)
            .attr("height", elementSize)
            .attr("fill", function(d) { return getElementColour(scale, d); });
    });
});