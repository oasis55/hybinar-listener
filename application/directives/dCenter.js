module.directive('dCenter', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            function set_() {
                var width = element.width() > 0 ? element.width() : width,
                    margin = ($window.innerWidth - width) / 2;

                if (margin < 0) margin = 0;

                element.css('margin-left', margin + 'px');
            }

            set_();
            angular.element($window).on('resize', function () {
                set_();
            });

        }
    }
}]);