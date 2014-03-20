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
                .attr("height", elementSize)
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
                .attr("class", "row")
                .each(function(row) { renderRow(this, row, scale); });
        };
        
        return {
            renderGrid: renderRows
        };
    };
    
    return {
        create: create
    };
});