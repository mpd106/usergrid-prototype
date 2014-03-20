/* global define */

define(["d3", "utils/svgHelpers"], function(d3, svgHelpers) {
    var create = function(origin, elementSize) {
        var getRowYPos = function(i) {
            return origin.y + i * elementSize;
        };

        var getColXPos = function (i) {
            return origin.x + i * elementSize;
        };

        var getElementColour = function(scale, d) {
            return scale(d);
        };

        var renderRow = function(selection, rowData, scale) {
            var cells = d3.select(selection).selectAll(".cell")
                .data(rowData)
              .enter()
                .append("rect")
                .attr("class", "cell")
                .attr("x", function(d, i) {
                    return getColXPos(i);
                })
                .attr("width", elementSize)
                .attr("height", elementSize);
            
            cells = d3.select(selection).selectAll(".cell")
                .attr("fill", function(d) {
                    return getElementColour(scale, d.count);
                });
        };

        var renderRows = function(chart, mat, scale) {        
            var rows = chart.selectAll(".row")
                .data(mat)
              .enter()
                .append("g")
                .attr("transform", function(d, i) {
                    var y = getRowYPos(i);
                    return svgHelpers.translate(0, y);})
                .attr("class", "row");
            
            rows = chart.selectAll(".row")
                .each(function(row) { renderRow(this, row, scale); });
        };
        
        var refreshData = function(chart, mat) {
            chart.selectAll(".row")
                .data(mat);
        };
        
        return {
            renderGrid: renderRows,
            refreshData: refreshData
        };
    };
    
    return {
        create: create
    };
});