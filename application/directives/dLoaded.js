module.directive('dLoaded', [function () {
    return {
        link: function (scope, element, attributes) {
            element.on('load', function () {
                scope.$apply(attributes.dLoaded);
            })
        }
    }
}]);