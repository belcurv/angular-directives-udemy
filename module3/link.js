(function () {
    'use strict';
    
    var linkDemo = function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                // jqLite stuff
                elem.on('click', function () {
                    elem.html('You clicked me');
                });
                elem.on('mouseenter', function () {
                    elem.css('background-color', 'yellow');
                });
                elem.on('mouseleave', function () {
                    elem.css('background-color', 'white');
                });
            }
        };
    };
    
    angular.module('directivesModule', [])
        
        .directive('linkDemo', linkDemo);
    
}());