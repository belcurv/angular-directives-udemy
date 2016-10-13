(function () {
    'use strict';
    
    var tableHelper = function () {
        
        // define container for directive.
        // we'll use jqLite to plug into this div
        var template = '<div class="tableHelper"></div>',
            
            //ngModel object will be passed in due to require: 'ngModel' in DDO below
            link = function (scope, element, attrs, ngModel) {
                
                // init required variables
                var headerCols = [],  // array of column names
                    tableStart = '<table>',
                    tableEnd   = '</table>',
                    table      = '',  // will be updated with values
                    visibleProps = [],  //
                    datasource,
                    sortCol    = null,
                    sortDir    = 1;
                
                
                // Watch for ngModel to change. Required since the $modelValue
                // will be NaN initially.
                // FOUR ways to watch for changes to ngModel:
                
//                attrs.$observe('ngModel', function (value) {
//                    // value represents what I want to watch in ngModel
//                    scope.$watch(value, function(newValue) {
//                        render();
//                    });
//                });
                
                scope.$watch(attrs.ngModel, render);
                
//                scope.$watch(function() {
//                    // what do we specifically want to watch for?
//                    // ngModel has $modelValue and $viewValue.
//                    // we just want to get to the raw data - the $modelValue
//                    return ngModel.$modelValue;
//                }, function(newValue) {
//                    render();
//                });

//                Author's Favorite:
//                ngModel.$render = function () {
//                    render();
//                };

                
                // immediately call
                wireEvents();
                
                function render() {
                    if (ngModel && ngModel.$modelValue.length) {
                        datasource = ngModel.$modelValue;
                        table += tableStart;
                        table += renderHeader();
                        table += renderRows() + tableEnd;
                        renderTable();
                    }
                }
                
                function wireEvents() {
                    element.on('click', function (event) {
                        // if any TH was clicked, grab the name of the column
                        // NOTE: using '.target' instead of '.srcElement'
                        // FF doesn't understand '.srcElement'
                        // Chrome and FF both understand '.target'
                        if (event.target.nodeName === 'TH') {
                            var val = event.target.innerHTML;
                            var col = (scope.columnmap) ? getRawColumnName(val) : val;
                            if (col) {
                                sort(col);
                            }
                        }
                    });
                }
                
                function sort(col) {
                    // See if they clicked on the same header
                    // If they did, then reverse the sort
                    if (sortCol === col) {
                        sortDir = sortDir * -1;
                    }
                    sortCol = col;
                    datasource.sort(function (a, b) {
                        if (a[col] > b[col]) {
                            return 1 * sortDir;
                        }
                        if (a[col] < b[col]) {
                            return -1 * sortDir;
                        }
                        return 0;
                    });
                    render();
                }
                
                // iterates through properties and gets the mapped versions of them:
                // lowercase name maps to Upper Case Name,
                // and generates table column headers 
                function renderHeader() {
                    var tr = '<tr>';
                    for (var prop in datasource[0]) {
                        var val = getColumnName(prop);
                        if (val) {
                            // Track visible properties to make it fast to check them later
                            visibleProps.push(prop);
                            tr += '<th>' + val + '</th>';
                        }
                    }
                    tr += '</tr>';
                    tr = '<thead>' + tr + '</thead>';
                    return tr;
                }
                
                // loop through data items in datasource,
                // for every item, create a new row.
                // loop through every property in each row object,
                // allowing only visible properties.
                function renderRows() {
                    var rows = '';
                    for (var i = 0, len = datasource.length; i < len; i++) {
                        rows += '<tr>';
                        var row = datasource[i];
                        for (var prop in row) {
                            if (visibleProps.indexOf(prop) > -1) {
                                rows += '<td>' + row[prop] + '</td>';
                            }
                        }
                        rows += '</tr>';
                    }
                    rows = '<tbody>' + rows + '</tbody>';
                    return rows;
                }
                
                //
                function renderTable() {
                    table += '<br /><div class="rowCount">' + datasource.length + ' rows</div>';
                    element.html(table);
                    table = '';
                }
                
                function getRawColumnName(friendlyCol) {
                    var rawCol;
                    scope.columnmap.forEach(function (colMap) {
                        for (var prop in colMap) {
                            if (colMap[prop] === friendlyCol) {
                                rawCol = prop;
                                break;
                            }
                        }
                        return null;
                    });
                    return rawCol;
                }
                
                function filterColumnMap(prop) {
                    var val = scope.columnmap.filter(function (map) {
                        if (map[prop]) {
                            return true;
                        }
                        return false;
                    });
                    return val;
                }
                
                function getColumnName(prop) {
                    if (!scope.columnmap) {
                        return prop;
                    }
                    var val = filterColumnMap(prop);
                    if (val && val.length && !val[0].hidden) {
                        return val[0][prop];
                    } else {
                        return null;
                    }
                }
                
            };
        
        // return the DDO object literal
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                columnmap: '='
            },
            link: link,
            template: template
        };
        
    };
    
    angular.module('directivesModule')
    
        .directive('tableHelperWithNgModel', tableHelper);
    
}());