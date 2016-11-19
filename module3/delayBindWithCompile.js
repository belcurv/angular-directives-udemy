(function () {
    'use strict';
    
	/* must inject $interpolate service.
	 * This parses DOM bindings:
	 *   delay-bind="{{::cust.street}}"
	*/
    var delayBindWithCompile = ['$interpolate', function ($interpolate) {
        
		/* Our compile function takes two params
		 *   tElem = our template element: the <li> and <a> elements in our DOM
		 *   tAttrs = attributes of our template element
		 *
		 * tElem "caches" the template element into memory
		*/
        var compile = function (tElem, tAttrs) {
			
			// talk to us
			console.log('In compile');
			
			// $interpolate grabs "delayBind" template element
			// attribute and caches it AS A FUNCTION
			var interpolateFunc = $interpolate(tAttrs.delayBind);
			
			// now that delayBind is cached, we clear out the delayBind
			// attribute value so no bindings actually occur in the DOM.
			// We'll add it back later as user triggers (mouseenter).
			tAttrs.$set('delayBind', null);
			
			// return compile object literal
			return {
				pre: function (scope, elem, attrs) {
					// just talk to us
					console.log('In delay bind PRE ' + elem[0].tagName);
				},
				post: function (scope, elem, attrs) {
					// talk to us
					console.log('In delay bind POST ' + elem[0].tagName);
					
					// listen for use to mouseover element (li or a in our case),
					// then call a function
					elem.on(attrs.trigger, function (event) {
						// grab the actual attribute we want to update (title
						// or href in our case)
						var attr = attrs.attribute,
							// invoke the binding function to get the value (the
							// title or URL value, in our case)
							val  = interpolateFunc(scope);
						if (attr && !elem.attr(attr)) {
							// then find the element and set its title or
							// href attribute to the appropriate value
							elem.attr(attr, val);
						}
					});
				}
			};
		};
        
        return {
            restrict: 'A',
            compile: compile
        };
        
    }];
    
    
    angular.module('directivesModule')
        .directive('delayBind', delayBindWithCompile);
    
}());