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

require(["d3", "datasources/generativeDatasource", "utils/objectUtils", "matrix", "d3colorscale", "d3axes", "d3dimensions", "grid"],
        function(d3, datasource, objectUtils, matrix, d3colorscale, d3axes, d3dimensions, grid) {
    
    var getElementColour = function(scale, d) {
        return scale(d);
    };
    
    var svgHelpers = {
        translate : function(x, y) {
            return "translate(" + x + ", " + y + ")";
        }
    };

    var renderHeaders = function(chart, colNames, elementSize, grd) {
        chart.append("g")
            .attr("class", "event-headers")
          .selectAll("text")
            .data(colNames)
          .enter()
            .append("g")
            .attr("transform", function(d, i) {
                var x = grd.getColXPos(i, elementSize) + elementSize / 2;
                var translation = svgHelpers.translate(x, 0),
                    rotation = "rotate(90)";
                return translation + ' ' + rotation;
            })
            .append("text")
            .attr("style", "writing-mode: rl")
            .attr("style", "alignment-baseline: middle")
            .attr("text-anchor", "end")
            .text(function(d) { return d; });
        
        var header = chart.select("g.event-headers");
        var headerHeight = d3dimensions.getHeaderHeight(chart);
        var origin = d3dimensions.getOrigin();
        
        header.attr("transform", function(d, i) {
            return svgHelpers.translate(0, origin.y + headerHeight);
        });
    };
      
    var renderRows = function(chart, mat, elementSize, scale, grd) {
        var headerHeight = d3dimensions.getHeaderHeight(chart),
            origin = d3dimensions.getGridOrigin(chart);
        
        var rows = chart.selectAll(".row")
            .data(mat)
          .enter()
            .append("g")
            .attr("transform", function(d, i) {
                var y = origin.y + i * elementSize;
                return svgHelpers.translate(0, y);})
            .attr("class", "row")
            .each(function(row) { renderRow(this, row, elementSize, scale, grd); });
    };
            
    var renderRow = function(selection, rowData, elementSize, scale, grd) {
        var cells = d3.select(selection).selectAll(".cell")
            .data(rowData)
          .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", function(d, i) {
                return grd.getColXPos(i, elementSize);
            })
            .attr("width", elementSize)
            .attr("height", elementSize)
            .attr("fill", function(d) {
                return getElementColour(scale, d.count);
            });
    };
            
    var renderChart = function(chart, mat, elementSize, grd, scale) {
        renderHeaders(chart, mat.colNames, elementSize, grd);
        renderRows(chart, mat, elementSize, scale, grd);
    };
            
    datasource.getData(function(error, data) {
        var mat = matrix.create(data),
            chart = d3.select(".chart"),
            elementSize = d3dimensions.getElementSize(data),
            origin = d3dimensions.getOrigin(),
            grd = grid.init(origin, elementSize),
            scale = d3colorscale.getScale(mat);
        
        renderChart(chart, mat, elementSize, grd, scale);
        
        mat.threshold(0, 50);
        d3dimensions.setupChartArea(chart, data);
        d3dimensions.setupChartArea(chart, data);
    });
});