module.directive('dKeydown', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            function _do(event) {
                scope.$event = event;
                scope.$apply(attributes.dKeydown);
            }

            $document.on('keydown', _do);

            element.on('$destroy', function () {
                $document.off('keydown', _do);
            });

        }
    }
}]);