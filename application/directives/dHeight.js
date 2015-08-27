module.directive('dHeight', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            function set_() {
                var height = attributes.dHeight;

                height = height.replace(/([0-9]+)%/g, function () {
                    return $window.innerHeight * arguments[1] / 100;
                });

                height = height.replace(/([0-9]+)px/g, function () {
                    return arguments[1];
                });

                element.css('height', scope.$eval(height) + 'px');

            }

            set_();
            angular.element($window).on('resize', function () {set_();});
        }
    }
}]);