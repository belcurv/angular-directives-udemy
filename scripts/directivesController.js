(function () {
    'use strict';
    
    var app = angular.module('directivesModule', []);
    
    var injectParams = ['$scope'];
    
    var CustomersController = function ($scope) {
        var counter = 0;
        
        $scope.tasks = [{ title: 'Task 1' }];
        $scope.customer = {
            name: 'Jesus',
            street: '1234 Anywhere St.'
        };
        
        $scope.customers = [
            {
                name: 'David',
                street: '1234 Anywhere St.',
                age: 25,
                url: 'www.david.html'
            },
            {
                name: 'Tina',
                street: '1800 Crest St.',
                age: 35,
                url: 'www.tina.html'
            },
            {
                name: 'Michelle',
                street: '890 Main St.',
                age: 29,
                url: 'www.michelle.html'
            },
            {
                name: 'John',
                street: '444 Cedar St.',
                age: 18,
                url: 'www.john.html'
            }
        ];
        
        $scope.addCustomer = function (name) {
            counter += 1;
            var newName = (name) ? name : 'New Customer' + counter;
            console.log(newName);
            $scope.customers.push({
                // name: (name) ? name : 'New Customer' + counter,
                name: newName,
                street: counter + ' Cedar Point St.',
                age: counter
            });
        };
        
        $scope.changeData = function () {
            counter += 1;
            $scope.customer = {
                name: 'James',
                street: counter + ' Cedar Point St.'
            };
        };
        
    };
    
    CustomersController.$inject = injectParams;
        
    app.controller('CustomersController', CustomersController);
    
}());