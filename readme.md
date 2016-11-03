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

### MODULE 2 - Shared and Isolate Scope

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

1.  **`@` Local Scope Property** - creates a one-way binding letting us pass a string value to the directive.  If the directive changes the value, nothing happens to it back in the outer scope that passed it in.  Means "hey, you can pass me a string value".  Code looks like this:

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

    Both strings **and objects** can be passed are 2-way bound with the `=`.
    
    Note that when passing a whole object, you don't use {{ squigley brackets }} in the DOM element attribute.  You just put the $scope property in quotes.
    
    Code looks like this:

    Javascript:
    ```javascript
    // In a controller - parent scope
    $scope.person = {
        name: 'Dave'
    };
    
    // in a directive - child scope
    return {
        scope: {
            customer: '='  // two-way binding
        },
        template: '...'
    }
    ```
    
    HTML (note: no {{ squigley brackets }}:
    ```
    <my-directive customer="person"></my-directive>
    ```

3.  **`&` Local Scope Property** - Allows us to pass a function (or expression) from parent scope to isolate scope.  It allows a directive with isolate scope to invoke an external function. This is useful if you want to notify the outside world "across the wall" that something changed. You might have a direcive that gets data and updates it via two-way binding `'='` but you might want to know when the user is officially done - by clicking a save button or something.

    From a code standpoint...

    Javascript:
    ```javascript
    // in a controller:
    $scope.click = function () {
        //do stuff
    };
    
    // in the directive:
    return {
        scope: {
            action: '&'  // 'action' is an alias to the function
        },
        template: '...'
    };
    ```
    
    HTML:
    
    ```
    <my-directive action="click()"></my-directive>
    ```
    
    Note that `action` refers to the directive's isolate scope property 'action', which takes the `click()` parent $scope function.  We pass the $scope method `click()` to the directive via the HTML directive's `action` attribute.
    

### MODULE 3 - The `link()` Function

This module is all about DOM manipulation.  We'll integrate several other Angular pieces in directives.

Outline:

1.  The `link()` function. How it works.

2.  Build a `TableHelper` Directive.  Like a data grid - takes tabular data, writes it out.  Instead of having to manually do ng-repeat, we'll build a reusable directive that makes it easy to take any type of data and map it out to a table.

3.  Tweak our `TableHelper` Directive.  Integrate `ngModel` using require\include.

4.  Use `$parse` (a service) and `$eval` (a `$scope` function that calls `$parse`).  We might have an object that's passed into a directive as a string, and it needs to be converted into something else.  With `$parse` and `$eval` we can convert string values into objects and other types of things.

5.  Build a Google Maps directive using html5 geolocation

6.  Using `$compile` and `$interpolate` - `$compile` is actually used behind the scenes; normally you don't need it because of the `link()` function. But when you need to get more involved, you can use `$compile`.

7.  Wrap up: Is `link()` Always Appropriate?

#### The `link()` Function

Various properties can be defined on a DDO:

```javascript
angular.module('moduleName')

    .directive('myDirective', function () {
        return {
            restrict: 'EA',
            scope: {},
            template: '<div>{{ myVal }}</div>',
            controller: controller,
            link: function (scope, element, attrs) {} // you are here!
        };
    });
```

We're going to focus on the `link()` function, which is focused on DOM manipulation.

_Aside: how author likes to structure his directives_:

```javascript
    (function () {
        var linkDemo = function () {
            return {



                link: function (scope, element, attrs) { }


            };
        };

        angular.module('moduleName')
            .directive('linkDemo', linkDemo);

    }());
```
_He does this for controllers, services, factories, etc. It focuses more on  functionality and less on Angular._  

The `link()` function connects the directive template to the scope.  Or, links the data to the view.  Directives are sort of like a small scale view-controller thing.

**Link Function Parameters**

You always get the same three parameters:

1.  **scope** - either the shared scope or the isolate scope, depending on how you set up the DDO
2.  **element** - represents either the element that your directive is applied to, if it's an attribute, or it's going to be the directive tag itself.
3.  **attrs** - all the different attributes on the directive's tag.

**DOM Manipulation with jqLite**

You can write vanilla JS inside link functions, but Angular includes **jqLite**, a tiny, API-compatible subset of jQuery designed for DOM manipulation.  The middle-man between the DOM and your directive.  The benefit of using jqLite is that it's cross-browser compatible by design.

For more info, see the official docs:

https://docs.angularjs.org/api/ng/function/angular.element

Key jqLite Functions:

1.  `angular.element()` - selects the element we want to work with. Akin to jQuery's `$("_element_")`
2.  `addClass()` - adds a CSS class selector.
3.  `css()` - adds CSS inline.
4.  `attr()` - used to get attributes and manipulate them.
5.  `on()` / `off()` - for different types of events.
6.  `find()` - finds tags _only_.  In jQuery you can find by class or ID.  In jqLite, you can only find by tag name.
7.  `append()` / `remove()` - for adding and removing child nodes.
8.  `html()` / `text()` - for updating the inner html or inner text of an element.
9. `ready()` - function to be notified when the DOM is officially loaded.

**Building The TableHelper Directive**

Refer to: `tableHelper.js`.

There may be times when you want to use other built-in Angular directives, or your own custom directives.  We do this using a `require` property in our DDO.  Refer to: `tableHelperWithNgModel.js`.  The DDO would look something like this:

```javascript
    return {
        restrict: 'E',
        require: 'ngModel',  // include other directive
        scope: {
            columnmap: '=',  // remove 'datasource' from scope
        },
        link: link,
        template: template
    };
```

Note that in the `scope` property, we've removed the reference to 'datasource'. We no longer need it because ngModel connects directly to the parent $scope.

The `require` property is going to look for a 'ngModel' attribute on the DOM directive tag itself (see helow HTML). If the ngModel attribute was missing, Angular would throw an error.  So, Angular lets us define required directives as:

1.  optional, using a question mark: `require: ?ngModel`
2.  existing on the element _or_ on the parent element using a carat: `require: ^ngModel`
3.  existing _only_ on the parent element using two carats: `require: ^^ngModel`
4.  optional on the directive itself or the parent element: `require: ?^ngModel`

HTML:
```
    <table-helper-with-ng-model
        ng-model="customers"
        columnmap="[{name: 'Name'}, {street: 'Street'}, {age: 'Age'}, {url: 'URL', hidden: true}]">
    </table-helper-with-ng-model>
```

`ng-model` is doing the same thing that our prior datasource alias was doing.  But any Angular dev who sees ng-model will know precicely what it's doing there.

Now that we've required ngModel, we add it as an attribute to our link function:

```javascript
var link = function (scope, element, attrs, ngModel) {
    // do stuff
};
```

This ngModel is actually passing `ngModelController` which does a bit more than just databinding.  We use 'ngModel' as shorthand for it.  

ngModel is quite powerful. You can do data validation with it, for example. For everything it does, see:

https://docs.angularjs.org/api/ng/type/ngModel.NgModelController

Ok, so we have required ngModel and gained access to it via the link function.  Now we need to know when the model (ngModel) actually changes (when our $scope data changes).  Our custome render() function needs to know when the model data changes so it can re-render the table.  It needs to know this first when the page initially loads and then when any future changes are made to the table.

Dan describes four ways to monitor ngModel for changes.

1.  Using `$observe` to watch changes on the directive's attributes:
    ```javascript
    attrs.$observe('ngModel', function(value) {
        // value = whatever I want to watch in ngModel
        scope.$watch(value, function(newValue) {
            render();
        });
    });
    ```

2.  Using `scope.$watch` to monitor `attrs.ngModel` for changes:
    ```javascript
    scope.$watch(attrs.ngModel, render);
    ```
    
3.  Using `scope.$watch` again but giving it a function. Inside the function we set whatever it is we specifically want to watch for. ngModel gives us two things to watch: `$modelValue` and `$viewValue`. We are more interested in `$modelView` since nothing has been attached to a view at this point.  The below allows us to specifically watch `$modelValue` for changes, and when it does we pass newValue to the chained function:
    ```javascript
    scope.$watch(attrs.ngModel, function() {
        return ngModel.$modelValue;
    }, function(newValue) {
        render();
    });
    ```
    
4.  Using the `$render()` function built into NGModelController.  `$render()` is invoked when `$modelValue` and `$viewValue` are different from their previous values. We don't have to do a $watch on anything. We just let ngModel 'notify' us when it thinks the internals (`$modelValue`, `$viewValue`) have change. When it thinks the internals have changed, it fires a `$render()` and we give that a function:
    ```javascript
    ngModel.$render = function() {
        render();
    };
    ```

**Using $parse And $eval**

(refer to `tableHelperWithParse.js`)

When you need to convert something that a user supplies via an attribute into an object, but you don't want to use an isolate scope property, you can use Angular's $parse service and $eval function.

In the code, we revert back to using `datasource` in our DDO's isolate scope property, but we've removed `columnmap`.  We're now passing `columnmap` as an attribute, and we want to use it in our directive.  But passing it as-is means it will be received as a string.  When we were using the isolate scope '=' property, Angular automatically converted the passed string to an object for us. Now that we're _not_ using the '=' isolate scope property, what can we do?

1.  use the `$eval` function.  Angular gives us `$eval` via the 'scope' property we already have in our directive's link function.  `$eval` takes the attributes we want to get to, and automatically converts strings to objects.  Under the covers, `$eval` calls the `$parse` service.
    ```javascript
        columnmap = scope.$eval(attrs.columnmap);
    ```
2.  use the `$parse` service, passing the attributes.  First we need to inject the $parse service before we can use it. We do that with some Angular injection syntax:
    ```javascript
    var tableHelperWithParse = function () { ... };
    ```
    ... becomes ...
    ```javascript
    var tableHelperWithParse = ['$parse', function ($parse) { ... }];
    ```
    Then we can use $parse:
    ```javascript
    columnmap = $parse(attrs.columnmap)();
    ```
    Note: **easy to forget** - we have to immediately invoke `$parse` with the trailing `()`. This is because `$parse` really returns a function.  When we use it, we don't want the function, we want the output of the function.  So we have to invoke it right away.

Both of the above work the same.  `scope.$eval` saves some typing since you don't have to inject $parse.

**Note:** since we are no longer binding `columnmap` through isolate scope, we need to change all references of `scope.columnmap` to just our new `columnmap` variable.

**Building a Google Maps Directive**

Dan uses the link() function to build a Google maps directive that ties into the html5 geo-location API.  We want using the directive to look like this:

```
    <map-geo-location height="400" width="600"></map-geo-location>
```

We have to include Angular's $window service:

```javascript
    (function () {
    
        // directive shell
        var mapGeoLocation = ['$window', function ($window) {
        
        
            var template = '<p><span id="status">Looking up geolocation...</span></p>' +
                           '<br /><div id="map"></div>',
                mapContainer = null,   // will target the above <div id="map">
                status = null;         // will target the above <span id="status">


            function link(scope, elem, attrs) {
                
                /* Notes on use of angular.element() below:
                   Wrapping 'document.getElementById()' in angular.element()
                   gives all the jqLite functionality to 'status' &
                   'mapContainer' variables.  Then they can call any of the
                   jqLite methods.
                /*

                // find status element and assign it to 'status' var
                status = angular.element(document.getElementById('status'));
                
                // find map element and assign it to 'mapContainer' var
                mapContainer = angular.element(document.getElementById('map'));
                
                // style mapContainer using jqLite's 'attr' method, and the
                // 'height' property from our DDO's scope
                mapContainer.attr('style', 'height:' + scope.height + 'px;' +
                                            'width:' + scope.width + 'px;');
                                            
                /* use $window object to get to navigator object, which gives
                   us access to geolocation API.  It has an API function called
                   'getCurrentLocation' which takes success and failure
                   callbacks. We name success 'mapLocation', the failure
                   'geoError' and define them below.
                */
                $window.navigator.geolocation.getCurrentPosition(mapLocation, geoError);
            }
            
            
            // mapLocation() getCurrentPosition() success callback function.
            /* The getCurrentPosition function returns a position object and
               gives it to the success callback (the 'pos' param). 'pos' gives us
               the 'coords' property, which has all the GPS features you might want.
            */
            function mapLocation(pos) {
                // Use jqLite to add html to our status variable from above
                status.html('Found your location! Longitude: ' + pos.coords.longitude +
                            ' Latitude: ' + pos.coords.latitude);

                // create a google maps 'latlng' object from the coords
                // we received via 'pos' parameter
                var latlng = new google.maps.LatLng(pos.coords.latitude,
                                                    pos.coords.longitude),

                // create map options object
                options = {
                    zoom: 15,
                    center: latlng,
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                },

                /* grab the raw map DOM element from our jqLite-wrapped
                   'mapContainer' by referencing mapContainer[0]. Feed that
                   our options.
                */
                map = new google.maps.Map(mapContainer[0], options),

                // create map marker for where we are
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: "Your location"
                });
            }

            
            // mapLocation() getCurrentPosition() failure callback function.
            /* Takes the error info that html5 geolocation API passes.
               We use jqLite's .html() method to output a message.
            */
            function geoError(error) {
                status.html('Failed lookup ' + error.message);
            }
            
            
            // Return the DDO object literal
            return {
                restrict: 'E',
                scope: {
                    height: '@',    // attributes to be passed in via
                    width: '@'      // the directive element in the view
                },
                link: link,         // refers to our link function above
                template: template  // refers to our template above
            }
                           
            
        }];
    
        angular.module('directivesModule', [])
        
            .directive('mapGeoLocation', mapGeoLocation);
    
    }());
```

**Using $parse And $eval**

We earlier talked about the $compile service and how it's used behind the scenes.  There's more to that story.

**The compile() function**



$interpolate service


### GENERAL NOTES

**Documentation**

When writing a directive, we need to document what properties the directive expects to receive via attributes and data binding expressions.  For example, in the below HTML our directive expects to receive a `name` property from the DOM:

```
<isolate-scope-with-string name="{{customer.name}}"></isolate-scope-with-string>
```
