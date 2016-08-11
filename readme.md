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
