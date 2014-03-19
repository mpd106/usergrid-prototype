/* global document, require, console */

require.config({
    paths : { d3: "http://d3js.org/d3.v3.min" },
    config : {
        "datasources/generativeDatasource" : {
            numberOfEvents : 3,
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
        margin = {top: 20, right: 20, bottom: 20, left: 20},
        headerPad = 10;

    var setChartArea = function(chart, width, height) {        
        chart.attr("width", width + margin.left + margin.right)
             .attr("height", height);
    };

    var calculateElementSize = function(data) {
        var numColumns = objectUtils.numProperties(data[0]),
            idealElementSize = chartWidth / numColumns,
            elementSize = Math.min(maxElementDimension, idealElementSize);
        
        return elementSize;
    };
            
    var calculateChartArea = function(data, elementSize) {
        return {
            // TODO: below needs header size
            height : margin.top + margin.bottom + headerPad + data.length * elementSize,
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
    
    var computeEventHeadersHeight = function(headers) {
            var headerDimensions = headers.node().getBBox(),
            headerHeight = headerDimensions.height;
        
        return headerHeight;
    };

    var addEventHeaders = function(chart, dimensions, m, elementSize) {        
        chart.append("g")
            .attr("class", "event-headers")
          .selectAll("text")
            .data(m.colNames)
          .enter()
            .append("g")
            .attr("transform", function(d, i) {
                var translation = svgHelpers.translate(getColXPos(i, elementSize) + elementSize / 2, 0),
                    rotation = "rotate(90)";
                return translation + ' ' + rotation;
            })
            .append("text")
            .attr("style", "writing-mode: rl")
            .attr("style", "alignment-baseline: middle")
            .attr("text-anchor", "end")
            .text(function(d) { return d; });
        
        var headers = chart.select("g.event-headers");
        var headerHeight = computeEventHeadersHeight(headers);
        
        headers.attr("transform", function(d, i) {
            return svgHelpers.translate(0, margin.top + headerHeight);
        });
    };
      
    var renderRows = function(chart, mat, elementSize, scale) {
        var headers = chart.select("g.event-headers");
        var headerHeight = computeEventHeadersHeight(headers);
        
        var rows = chart.selectAll(".row")
            .data(mat)
          .enter()
            .append("g")
            .attr("transform", function(d, i) {
                var y = margin.top + headerHeight + headerPad + i * elementSize;
                return svgHelpers.translate(0, y);})
            .attr("class", "row")
            .each(function(row) { renderRow(this, row, elementSize, scale); });
    };
            
    var renderRow = function(selection, rowData, elementSize, scale) {
        var cells = d3.select(selection).selectAll(".cell")
            .data(rowData)
          .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", function(d, i) {
                return getColXPos(i, elementSize);
            })
            .attr("width", elementSize)
            .attr("height", elementSize)
            .attr("fill", function(d) {
                return getElementColour(scale, d.count);
            });
    };
            
    var renderChart = function(chart, dimensions, m, elementSize, scale) {
        addEventHeaders(chart, dimensions, m, elementSize);
        renderRows(chart, m, elementSize, scale);
    };
            
    datasource.getData(function(error, data) {
        var chart = d3.select(".chart");
        var elementSize = calculateElementSize(data);
        var dimensions = calculateChartArea(data, elementSize);
        
        var m = matrix.create(data);
        m.threshold(0, 50);
        
        setChartArea(chart, dimensions.width, dimensions.height);
        
        var scale = d3colorscale.getScale(m);

        renderChart(chart, dimensions, m, elementSize, scale);
    });
});