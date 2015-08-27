module.directive('dMouseWheel', [function () {
    return {
        restrict: 'A',
        scope: {
            'dMouseWheel': '=',
            'dMouseWheelShift': '=',
            'dMouseWheelLimit': '=?'
        },
        link: function (scope, element) {

            scope.dMouseWheelShift = scope.dMouseWheelShift || 0;

            element.on('mousewheel', function () {

                if (scope.dMouseWheelLimit.min >= scope.dMouseWheelLimit.max)
                    return true;

                scope.dMouseWheelShift += arguments[1];

                if (scope.dMouseWheelLimit) {
                    scope.dMouseWheelShift = scope.dMouseWheelShift < scope.dMouseWheelLimit.min ? scope.dMouseWheelLimit.min : scope.dMouseWheelShift;
                    scope.dMouseWheelShift = scope.dMouseWheelShift > scope.dMouseWheelLimit.max ? scope.dMouseWheelLimit.max : scope.dMouseWheelShift;
                }

                scope.$apply(scope.dMouseWheel);

                return false;
            });

        }
    };
}]);