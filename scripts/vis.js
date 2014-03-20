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

require(["d3", "datasources/d3datasource", "matrix", "d3colorscale", "d3dimensions", "d3headerFactory", "d3gridFactory"],
        function(d3, datasource, matrix, d3colorscale, d3dimensions, d3headerFactory, d3gridFactory) {
    datasource.getData(function(error, data) {
        var mat = matrix.create(data),
            chart = d3.select(".chart"),
            // TODO: Put this in a config somewhere
            dimensions = d3dimensions.init({top: 10, left: 10, bottom: 10, right: 10}),
            elementSize = dimensions.getElementSize(data),
            origin = dimensions.getOrigin(),
            headerOrigin,
            headerHeight,
            d3header,
            d3grid,
            gridOrigin,
            scale;
        
        var setupSort = function(chart, mat, d3header, d3grid, scale) {
            d3header.onHeaderClick(chart, function(header) {
                mat.sortByColumn(header.index, "desc");
                d3grid.renderGrid(chart, mat, scale, d3header.getHeaderHeight(chart));
            });
        };
        
        headerOrigin = dimensions.getOrigin();
        d3header = d3headerFactory.create(headerOrigin, elementSize);
        d3header.renderHeaders(chart, mat.columnHeaders);
        
        headerHeight = d3header.getHeaderHeight(chart);
        gridOrigin = dimensions.getGridOrigin(chart, headerHeight);
        
        mat.threshold(0, 50);
        scale = d3colorscale.getScale(mat);
        // can only create the grid once we've rendered the header--ugh
        d3grid = d3gridFactory.create(gridOrigin, elementSize);
        d3grid.renderGrid(chart, mat, scale, d3header.getHeaderHeight(chart));
        
        dimensions.setupChartArea(chart, data, d3header.getHeaderHeight(chart));
        setupSort(chart, mat, d3header, d3grid, scale);
    });
});