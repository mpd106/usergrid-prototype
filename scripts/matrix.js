/* global define */

define(["./utils/objectUtils"], function(objectUtils) {
    // TODO: prototype to reuse methods
    var create = function(source) {
        var matrix = [];
        
        // Make properties available via array index
        var processRow = function(source, rowIndex, matrix) {
            matrix[rowIndex] = [];
            var sourceRow = source[rowIndex],
                resultRow = matrix[rowIndex],
                colIndex = 0;
            objectUtils.forEachProperty(sourceRow, function(obj, prop, count) {
                resultRow[count] = {
                    row: rowIndex,
                    col: colIndex,
                    count: obj[prop]
                };
                colIndex++;
            });
        };
        
        var processRows = function(source, matrix) {
            for (var rowIndex = 0; rowIndex < source.length; rowIndex += 1) {
                processRow(source, rowIndex, matrix);
            }
        };
        
        var getColNames = function(source) {
            var colNames = [];
            var firstSourceRow = source[0];
            objectUtils.forEachProperty(firstSourceRow, function(obj, prop, index) {
                colNames[index] = prop;
            });
            
            return colNames;
        };
        
        var forEachElement = function(matrix, callback) {
            var rowIndex, colIndex, row, current;
            for (rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
                row = matrix[rowIndex];
                for (colIndex = 0; colIndex < row.length; colIndex++) {
                    current = row[colIndex];
                    callback(current, rowIndex, colIndex);
                }
            }
        };
        
        processRows(source, matrix);
        matrix.colNames = getColNames(source);
        
        matrix.forEachElement = function(callback) {
            forEachElement(this, function(val, rowIndex, colIndex) {
                callback(val, rowIndex, colIndex);
            });
        };
        
        matrix.max = function() {
            var max = 0;
            forEachElement(this, function(val, rowIndex, colIndex) {
                max = Math.max(max, val.count);
            });
            return max;
        };
        
        matrix.threshold = function(min, max) {
            var current;
            forEachElement(this, function(val, rowIndex, colIndex) {
                current = val.count;
                current = Math.max(current, min);
                current = Math.min(current, max);
                matrix[rowIndex][colIndex].count = current;
            });
        };

        return matrix;
    };
    
    return {
        create : create
    };
});