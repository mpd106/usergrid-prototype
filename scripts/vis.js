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

require(["d3", "datasources/generativeDatasource", "matrix", "d3colorscale", "d3dimensions", "d3headerFactory", "d3gridFactory"],
        function(d3, datasource, matrix, d3colorscale, d3dimensions, d3headerFactory, d3gridFactory) {
    datasource.getData(function(error, data) {
        var mat = matrix.create(data),
            chart = d3.select(".chart"),
            // TODO: Pull this from the grd, or something
            dimensions = d3dimensions.init({top: 10, left: 10, bottom: 10, right: 10}),
            elementSize = dimensions.getElementSize(data),
            origin = dimensions.getOrigin(),
            scale = d3colorscale.getScale(mat),
            headerOrigin,
            headerHeight,
            d3header,
            d3grid,
            gridOrigin;
        
        headerOrigin = dimensions.getOrigin();
        d3header = d3headerFactory.create(headerOrigin, elementSize);
        d3header.renderHeaders(chart, mat.colNames);
        
        headerHeight = d3header.getHeaderHeight(chart);
        gridOrigin = dimensions.getGridOrigin(chart, headerHeight);
        
        mat.threshold(0, 50);
        // can only create the grid once we've rendered the header--ugh
        d3grid = d3gridFactory.create(gridOrigin, elementSize);
        d3grid.renderGrid(chart, mat, scale, d3header.getHeaderHeight(chart));
        
        dimensions.setupChartArea(chart, data, d3header.getHeaderHeight(chart));
    });
});