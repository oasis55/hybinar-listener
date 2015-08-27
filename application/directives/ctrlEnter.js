module.directive('ctrlEnter', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            function _keydown(event) {
                if (event.ctrlKey && event.keyCode === 13) {
                    event.preventDefault();
                    element.blur();
                    scope.$apply(attributes.ctrlEnter);
                }
            }

            element.on('keydown', _keydown);
            element.on('$destroy', function () {
                element.off('keydown', _keydown);
            });

        }
    }
}]);