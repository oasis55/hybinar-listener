module.directive('dHide', ['$timeout', function ($timeout) {
    return {
        scope: {
            'dHide': '=',
            'dHideTimeout': '=?',
            'dHideEval': '=?'
        },
        link: function (scope, element) {

            scope.dHideTimeout = scope.dHideTimeout || 3000;

            scope.$watch('dHide', function (value) {
                if (value) {
                    $timeout(function () {
                        element.addClass('ng-hide');
                        scope.$apply(scope.dHideEval);
                    }, scope.dHideTimeout);
                }
            });

        }
    };
}]);