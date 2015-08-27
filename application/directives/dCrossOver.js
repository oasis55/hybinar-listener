module.directive('dCrossOver', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            var w = angular.element($window),
                event, offset, scroll,
                top = $(window).outerHeight(true) * .1;

            w.on('scroll', function () {

                offset = element.offset();

                scroll = {
                    top: w.scrollTop(),
                    left: w.scrollLeft()
                };

                if (offset.top === scroll.top && offset.left === scroll.left)
                    return false;

                if (scroll.top + top > offset.top &&
                    scroll.top + top < offset.top + element.height()) {
                    if (!event) {
                        event = true;
                        scope.$apply(attributes.dCrossOver);
                    }
                } else
                    event = false;

            });
        }
    }
}]);