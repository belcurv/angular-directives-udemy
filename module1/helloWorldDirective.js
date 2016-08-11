(function () {
    
    'use strict';
    
    var app = angular.module('directivesModule', []);
    
    app.directive('helloWorld', function () {
        
        // return a DDO, an object literal
        return {
            template: 'Hello World!'
        };
    });
    
}());