(function () {
    'use strict';
    
    var tableHelper = function () {
        
        // define container for directive.
        // we'll use jqLite to plug into this div
        var template = '<div class="tableHelper"></div>',
            
            link = function (scope, element, attrs) {
                
                // init required variables
                var headerCols = [],  // array of column names
                    tableStart = '<table>',
                    tableEnd   = '</table>',
                    table      = '',  // will be updated with values
                    visibleProps = [],  //
                    sortCol    = null,
                    sortDir    = 1;
                
                // need to know if datasource property changes,
                // if it does, need to update the table.
                // we use $watchCollection on 'datasource'
                // and call our render function if it changes.
                scope.$watchCollection('datasource', render);
                
                // immediately call
                wireEvents();
                
                function render() {
                    // if datasource exists with some length, build table
                    if (scope.datasource && scope.datasource.length) {
                        table += tableStart;
                        table += renderHeader();
                        table += renderRows() + tableEnd;
                        renderTable();
                    }
                }
                
                function wireEvents() {
                    element.on('click', function (event) {
                        // if any TH was clicked, grab the name of the column
                        if (event.srcElement.nodeName === 'TH') {
                            var val = event.srcElement.innerHTML;
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
                    scope.datasource.sort(function (a, b) {
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
                    for (var prop in scope.datasource[0]) {
                        var val = getColumnName(prop);
                        if (val) {
                            // Track visible properties to make it fast to check them later
                            visibleProps.push(prop);
                            tr += '<th>' + val + '</th>';
                        }
                    }
                    tr += '</tr>';
                    return tr;
                }
                
                // loop through data items in datasource,
                // for every item, create a new row.
                // loop through every property in each row object,
                // allowing only visible properties.
                function renderRows() {
                    var rows = '';
                    for (var i = 0, len = scope.datasource.length; i < len; i++) {
                        rows += '<tr>';
                        var row = scope.datasource[i];
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
                    table += '<br /><div class="rowCount">' + scope.datasource.length + ' rows</div>';
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
                    })
                }
                
                
            
            };
        
        // return the DDO object literal
        return {
            restrict: 'E',
            scope: {
                columnmap: '=',  // were passing an object, so we need the '='
                datasource: '='  // do want bi-directional binding
            },
            link: link,
            template: template
        };
        
    };
    
    angular.module('directivesModule')
    
        .directive('tableHelper', tableHelper);
    
}());