(function () {
    'use strict';
    
    var app = angular.module('directivesModule');
    
    app.directive('isolateScopeWithString', function () {
        return {
            scope: {
                name: '@'
            },
            template: 'Name: {{name}}'
        };
    });
    
}());