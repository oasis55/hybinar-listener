module.directive('dMouseHover', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            var hoverIntentPromise,
                delay = scope.$eval(attributes.dMouseHoverDelay),
                event = attributes.dMouseHoverEvent,
                antonym;

            delay === undefined && (delay = 500);
            event === undefined && (event = 'mouseenter');
            antonym = event === 'mouseenter' ? 'mouseleave' : 'mouseenter';

            element.on(event, function (event) {
                hoverIntentPromise = $timeout(function () {
                    scope.$eval(attributes.dMouseHover, {$event: event});
                }, delay);
            });

            element.on(antonym, function () {
                $timeout.cancel(hoverIntentPromise);
            });

        }
    };
}]);