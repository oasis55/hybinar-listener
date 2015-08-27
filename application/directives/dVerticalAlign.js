module.directive('dVerticalAlign', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        scope: {
            dVerticalAlign: '=?'
        },
        link: function (scope, element) {

            function set_() {

                if (scope.dVerticalAlign === false) {
                    element.css('top', 0);
                    return false;
                }

                if (element.parent().height() < element.height())
                    return false;

                element.css('top', (element.parent().height() - element.height()) / 2);

            }

            set_();

            angular.element($window).on('resize', function () {
                set_();
                $timeout(function () {
                    set_();
                }, 10);
            });

        }
    };
}]);