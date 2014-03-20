/* global document, require, console */

require.config({
    paths : { d3: "http://d3js.org/d3.v3.min" },
    config : {
        "datasources/generativeDatasource" : {
            numberOfEvents : 9,
            numberOfUsers  : 60
        },
        "datasources/d3datasource" : {
            csvPath : "all data no minimum usage 10-03-2014.csv"
        }
    }
});

require(["d3", "datasources/generativeDatasource", "matrix", "d3colorscale", "d3dimensions", "grid", "d3header", "d3grid"],
        function(d3, datasource, matrix, d3colorscale, d3dimensions, grid, d3header, d3grid) {
            
    var renderChart = function(chart, mat, elementSize, grd, scale) {
        d3header.renderHeaders(chart, mat.colNames, grd);
        d3grid.renderGrid(chart, mat, scale, grd, d3header.getHeaderHeight(chart));
    };
            
    datasource.getData(function(error, data) {
        var mat = matrix.create(data),
            chart = d3.select(".chart"),
            // TODO: Pull this from the grd, or something
            dimensions = d3dimensions.init({top: 10, left: 10, bottom: 10, right: 10}),
            elementSize = dimensions.getElementSize(data),
            origin = dimensions.getOrigin(),
            grd = grid.init(origin, elementSize),
            scale = d3colorscale.getScale(mat);
        
        renderChart(chart, mat, elementSize, grd, scale);
        
        mat.threshold(0, 50);
        dimensions.setupChartArea(chart, data, d3header.getHeaderHeight(chart));
    });
});