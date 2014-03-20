/* global define */

define(["d3", "utils/svgHelpers"], function(d3, svgHelpers) {
    var getElementColour = function(scale, d) {
        return scale(d);
    };
    
    var renderRow = function(selection, rowData, scale, grd) {
        var elementSize = grd.getElementSize();
        var cells = d3.select(selection).selectAll(".cell")
            .data(rowData)
          .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", function(d, i) {
                return grd.getColXPos(i);
            })
            .attr("width", elementSize)
            .attr("height", elementSize)
            .attr("fill", function(d) {
                return getElementColour(scale, d.count);
            });
    };
    
    var renderRows = function(chart, mat, scale, grd, headerSize) {        
        var rows = chart.selectAll(".row")
            .data(mat)
          .enter()
            .append("g")
            .attr("transform", function(d, i) {
                var y = grd.getRowYPos(i) + headerSize;
                return svgHelpers.translate(0, y);})
            .attr("class", "row")
            .each(function(row) { renderRow(this, row, scale, grd); });
    };
    
    return {
        renderGrid: renderRows
    };
});