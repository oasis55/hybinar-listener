module.directive('dAdhereTop', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var w = angular.element($window), top;

            w.on('scroll', function () {
                top = !top ? element.offset().top : top;
                top <= w.scrollTop() ? element.css('position', 'fixed') : element.css('position', 'relative');
            });

        }
    }
}]);