## Build AngularJS Custom Directives

**Udemy Course w/Dan Wahlin**

## Module 1

### The Role of Directives

**What are Directives**  The official AngularJS definition: Markers on a DOM element that tell Angular's HTML compiler ($compile) to attache a specific behavior to that DOM element...

There are 4 ways to attach directives to DOM elements.  For example, as an attribute: `<div my-directive></div>`.

What can directives do?
1.  Manipulate the DOM
2.  Iterate through Data
3.  Handle Events
4.  Modify CSS
5.  Validate Data
6.  Data Binding

Angular comes with a lot of built-in directives:
*   FORMS
    *  mg-maxlength
    *  ng-minlength
    *  ng-pattern
    *  ng-required
    *  ng-submit
*   BEHAVIOR
    *  ng-blur
    *  ng-change
    *  ng-checked
    *  ng-click
    *  ng-key*
    *  ng-mouse*
*   DATA BINDING
    *  ng-bind
    *  ng-href
    *  ng-init
    *  ng-model
    *  ng-src
    *  ng-style
*   APPLICATION
    *  ng-app
    *  ng-controller
*   DOM
    *  ng-disabled
    *  ng-cloak
    *  ng-hide
    *  ng-if
    *  ng-repeat
    *  ng-show
    *  ng-switch
    *  ng-view
    
And there are lots of 3rd Party Directives:
1.  UI Bootstrap
2.  AngularStrap
3.  Angular UI Gruid
4.  Angular Translate

### Creating a Hello World Directive

Turns out you don't need a main 'app.js' module file.  Who knew.  You can just do it all inside the directive js:

```javascript
    (function () {

        var app = angular.module('directivesModule', []);

        app.directive('helloWorld', function () {
            return {
                template: 'Hello World!'
            };
        });

    }());
```

### Directive Categories

Wahlin differentiates three general categories of directives.  It's easier to come up with the proper coding strategy to build custom directives if you keep these in mind:

1.  **DOM-Driven Directives**  - All about DOM manipulation (animations, etc).
2.  **Data-Driven Directives** - All about data, using other directives and a controller. Like a traditional view and controller, but a _baby view_ with a _baby controller_.
3.  **Behavior-Driven Directives** - All about handling DOM events. Ex. you might want to attach a directive to a button that, when clicked, just raises an event.

**Directive Types**

Angular gives us 4 different ways to define a directive in a page:

1.  **Attribute** directive (default):
    `<span my-dir="exp"></span>`
2.  **Element** directive (default): `<my-dir></my-dir>`
3.  **CSS Class** directive (uncommon): `<span class="my-dir: exp;"></span>`
4.  **Comment** directive (uncommon): `<!-- directive: my-dir exp -->`

### Directive Building Blocks

**Templates and Scope**

We're already used to writing views (templates) and merging data into them and binding using $scope.   With directives we do the same thing.  We write templates and merge them with data.  We could hard code the template or build it dynamically.  A DOM-driven directive might be all javascript.  A Data-driven directive might have a controller.

**$compile** - Sits at the bottom of the Angular stack; the engine that makes directives possible.  Part of the $compile provider is the **DDO**: Directive Definition Object.  It tells the $compile provider what it needs to work: here's my controller, here's my DOM manipulation code, here's my template, etc.

In a DDO we can define a template and also **scope** (inherited or **isolate** scope - we'll get to that later).

**The $compile provider** - per AngularJS docs: "Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together."
-- https://docs.angularjs.org/api/ng/service/$compile

The $compile process:

1.  We supply a Template
2.  Template is fed into $compile provider via the DDO
3.  Behind the scene, $compile returns a Template Function
4.  We then merge our data/scope in
5.  And it gives us back HTML

$compile and the DDO:

*   $compile provider relies on a DDO
*   Features of the DDO:
    1.  Defines the template for the directive
    2.  Can include DOM manipulation code (generating new children, updating a DIV, etc.)
    3.  Can define a controller for the directive
    4.  Controls the directive's scope
    5.  Defines how the directive can be used (Attribute, Element, etc)
    6.  More...

Key DDO Properties we'll talk about throughout the course:

1.  **restrict** - defines the directive type (Attribute, Element, etc.)
2.  **template** - a literal string
3.  **templateUrl** - refers to a separate template file
4.  **scope** - same scope we're used to with controllers
5.  **controller** - does exactly what we would expect
6.  **link** - a function, all about DOM manipulation

An example using directive properties:

```javascript
angular.module('moduleName')
    .directive('myDirective', function () {
        return {
            restrict: 'AE',
            scope: {},
            template: '<div>{{ myVal }}</div>',
            controller: controller,
            link: function (scope, element, attrs) {}
        };
    });
```

### Shared and Isolate Scope

(Refer to Module 2)

We're probably going to chose isolate scope with custom directives.

**Shared Scope** is built into AngularJS.  Parent Scope on top of Nested Child Scope.  Children inherit down from parent controllers.  You _can_ do this in Angular directives, but it makes custom directives less reusable because we shouldn't be counting on some property trickling down from a parent scope.  You don't know if you'll have access to that same required property in any other apps.

Shared scope might look like this:

```javascript
    var app = angular.module('myModule', []);

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
```

**Isolate Scope**  Also called local scope.  It's isolated from its parent and does not automatically inherit everything from a parent's scope.  But the parent _can_ pass specific things: events, function, properties.  

To **isolate scope** you add a `scope` property in the DDO like this:

```javascript
    angular.module('myModule')
        .directive('isolateScope', function () {
            return {
                scope: {},    // isolate scope
                template: 'Name: {{customer.name}} Street: {{customer.street}}'
            };
        });
```

Adding `scope: {}` blocks the automatic inheritance of the customer property from the parent scope.

So how do we get data from the parent to the child, and from the child to the parent?  There are three ways to "punch a hole" through the wall isolating the parent and child scopes:

1.  **`@` Local Scope Property** - creates a one-way binding letting us pass a string value to the directive.  Means "hey, you can pass me a string value".  Code looks like this:

    Javascript:
    ```javascript
    // In a controller
    $scope.first = 'Dave';
    
    // in a directive    
    scope: {
        name: '@'
    }

    ```
    
    HTML:
    ```
    <my-directive name={{first}}"></my-directive>
    ```
    
    So, the value of `$scope.first` is passed into the directive, via an attribute on the directive element in the HTML.
    

2.  **`=` Local Scope Property** - Creates a 2-way binding.  So if a value is passed through and the directive changes it, it's changed in the parent scope as well.

    Both strings **and objects** are 2-way bound with the `=`.
    
    Note that when passing a whole object, you don't use {{ squigley brackets }} in the DOM element attribute.  You just put the $scope property in quotes.
    
    Code looks like this:

    Javascript:
    ```javascript
    // In a controller - parent scope
    $scope.person = {
        name: 'Dave'
    };
    
    // in a directive - child scope
    scope: {
        customer: '='
    }

    ```
    
    HTML (note: no {{ squigley brackets }}:
    ```
    <my-directive customer="person"></my-directive>
    ```

3.  `&` Local Scope Property

### Documentation

When writing a directive, we need to document what properties the directive expects to receive via attributes and data binding expressions.  For example, in the below HTML our directive expects to receive a `name` property from the DOM:

```
<isolate-scope-with-string name="{{customer.name}}"></isolate-scope-with-string>
```
