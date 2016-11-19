(function () {
    'use strict';
    
    var useLinkOrNot = function () {
        
        var template = '<button id="addItem">Add Item</button><div></div>',
            
            link = function (scope, element, attrs) {
                
                // Create a copy of the original data that's passed in
                var items = angular.copy(scope.datasource),
                    button = angular.element(document.getElementById('addItem'));

                button.on('click', addItem);
                render();


                function addItem() {
                    var name = 'New Directive Customer';

                    // Call external function passed in with &
                    scope.$apply(function () {
                        scope.add()(name);
                    });

                    // Add new customer to the local collection
                    items.push({
                        name: name
                    });

                    render();
                }

                function render() {
                    var html = '<ul>',
                        i,
                        len = items.length;
                    for (i = 0; i < len; i += 1) {
                        html += '<li>' + items[i].name + '</li>';
                    }
                    html += '</ul>';

                    element.find('div').html(html);
                }
            

            };


        return {
            restrict: 'EA',
            scope: {
                datasource: '=',
                add: '&'
            },
            link: link,
            template: template
        };
    };
    
    angular.module('directivesModule')
        .directive('useLinkOrNot', useLinkOrNot);
    
}());