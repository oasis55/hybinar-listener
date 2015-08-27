module.directive('dSelect', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            'dSelect': '='
        },
        link: function (scope, element) {

            scope.$watch('dSelect', function () {
                scope.dSelect && $timeout(function () {
                    element.select();
                }, 10);
            });

        }
    };
}]);