(function () {
    'use strict';
    
    var mapGeoLocation = ['$window', function ($window) {
        
        var template = '<p><span id="status">looking up geolocation...</span></p>' +
                       '<br /><div id="map"></div>',
            mapContainer = null,
            status = null;
        
        function link(scope, elem, attrs) {
            
            status = angular.element(document.getElementById('status'));
            mapContainer = angular.element(document.getElementById('map'));
            
            // style mapContainer
            mapContainer.attr('style', 'height:' + scope.height + 'px;' +
                                       'width: ' + scope.width  + 'px;');
            
            // do the thing!
            $window.navigator.geolocation.getCurrentPosition(mapLocation, geoError);
        }
        
        // fires if above .getCurrentPosition succeeds:
        function mapLocation(pos) {
            status.html('Found your location! Longitude: ' + pos.coords.longitude +
                       ' Latitude: ' + pos.coords.latitude);
            
            // create google maps latlng object
            var latlng = new google.maps.LatLng(pos.coords.latitude,
                                                pos.coords.longitude),
                
                // create map options object
                options = {
                    zoom: 15,
                    center: latlng,
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                },
                
                // grab raw mapContainer DOM element, feed it our options
                map = new google.maps.Map(mapContainer[0], options),
                
                // create map marker
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: "Your location"
                });
        }
        
        // fires if above .getCurrentPosition fails:
        function geoError(error) {
            status.html('Failed lookup ' + error.message);
        }
        
        
        // ============= DDO =============
        return {
            restrict: 'EA',
            scope: {
                height: '@',  // only need string values from DOM attributes
                width:  '@'
            },
            link: link,
            template: template
        };
        
    }];
    
    
    angular.module('directivesModule', [])
    
        .directive('mapGeoLocation', mapGeoLocation);
    
}());