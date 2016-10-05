(function () {
    
    'use strict';
    
    var app = angular.module('myApp', []);
    
    app.controller('Controller', ['$scope', function ($scope) {
        $scope.customer = {
            name: 'David',
            street: '1234 Anywhere St.'
        };
    }]);
    
    app.directive('sharedScope', function () {
        return {
            template: 'Name: {{customer.name}} Street: {{customer.street}}'
        };
    });
    
    app.directive('isolateScope', function () {
        return {
            scope: {},    // isolate scope
            template: 'Name: {{customer.name}} Street: {{customer.street}}'
        };
    });
    
    app.directive('helloWorld', function () {
        
        // return a DDO, an object literal
        return {
            template: 'Hello World!'
        };
    });
    
}());