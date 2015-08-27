module.directive('onFullscreen', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            function onFullscreen() {
                scope.$apply(attributes.onFullscreen);
            }

            $document[0].addEventListener('MSFullscreenChange', onFullscreen);
            $document[0].addEventListener('fullscreenchange', onFullscreen);
            $document[0].addEventListener('webkitfullscreenchange', onFullscreen);
            $document[0].addEventListener('msfullscreenchange', onFullscreen);
            $document[0].addEventListener('mozfullscreenchange', onFullscreen);

            element.on('$destroy', function () {

                $document[0].removeEventListener('MSFullscreenChange', onFullscreen);
                $document[0].removeEventListener('fullscreenchange', onFullscreen);
                $document[0].removeEventListener('webkitfullscreenchange', onFullscreen);
                $document[0].removeEventListener('msfullscreenchange', onFullscreen);
                $document[0].removeEventListener('mozfullscreenchange', onFullscreen);

            });
        }
    }
}]);