/* global define */

define(["./utils/svgHelpers"], function(svgHelpers) {
    var create = function(headerOrigin, headerWidth) {
        // TODO: DRY this up
        var getHeaderXPos = function(colIndex) {
            return (headerOrigin.x + colIndex * headerWidth) + headerWidth / 2;
        };

        var renderHeaders = function(chart, colNames, grd) {
            var header,
                headerHeight;

            chart.append("g")
                .attr("class", "event-headers")
              .selectAll("text")
                .data(colNames)
              .enter()
                .append("g")
                .attr("transform", function(d, i) {
                    var x = getHeaderXPos(i, grd);
                    var translation = svgHelpers.translate(x, 0),
                        rotation = svgHelpers.rotate(90);
                    return translation + ' ' + rotation;
                })
                .append("text")
                .attr("style", "writing-mode: rl")
                .attr("style", "alignment-baseline: middle")
                .attr("text-anchor", "end")
                .text(function(d) { return d; });

            header = chart.select("g.event-headers");
            headerHeight = calculateHeaderHeight(chart);

            header.attr("transform", function(d, i) {
                return svgHelpers.translate(0, headerOrigin.y + headerHeight);
            });
        };

        var calculateHeaderHeight = function(chart) {
            try{
                var header = chart.select("g.event-headers"),
                    headerDimensions = header.node().getBBox(),
                    headerHeight = headerDimensions.height;

                    return headerHeight;
            } catch(error) {
                throw {
                    message: "Could not find header--graph header must be initialized first",
                    error: error
                };
            }
        };
        
        return {
            renderHeaders: renderHeaders,
            getHeaderHeight: calculateHeaderHeight
        };
    };
    
    return {
        create: create
    };
});