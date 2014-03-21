/* global define */
define(function() {
    var defaultSortfunction = function(a, b) {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        
        return 0;
    };
    
    var swapAtIndex = function(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    };
    
    var insertionSort = function(arr, sortfunction) {
        var i, j;
        
        sortfunction = sortfunction || defaultSortfunction;
        
        for (i = 1; i < arr.length; i++) {
            j = i;
            while (j > 0 && sortfunction(arr[j-1], arr[j]) > 0) {
                swapAtIndex(arr, j, j-1);
                j--;
            }
        }
    };
    
    var test = [1, 4, 8, 3, 2, 8, 7, 4, 4, 1, 0, 19, 65, 43, 21];
    var result = insertionSort(test);
    
    return {
        insertionSort : insertionSort
    };
});