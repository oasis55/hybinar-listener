module.directive('dPosition', [function () {
    return {
        restrict: 'A',
        scope: {
            'dPosition': '='
        },
        link: function (scope, element) {

            element.on('mousemove', function (event) {
                scope.dPosition = event.offsetX / element.width() * 100;
                !scope.$$phase && scope.$parent.$digest();
            });

        }
    }
}]);