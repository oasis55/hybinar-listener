module.directive('control', ['drawing', function (drawing) {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope, element) {

            drawing.listenerId = scope.config.listener_id;
            drawing.canvas = scope.stream.getCanvas();
            drawing.socket = scope.socket;

            scope.control = {
                user: scope.user,
                position: null,
                activeSlide: null,
                activeMaterial: null,
                palette: false,
                thickness: 1,
                color: 'blue',
                boardMode: scope.conference.get('board').get('mode'),
                pencilSelected: false,
                eraserSelected: false
            };

            scope.selectSlide = function ($index) {
                if (scope.control.activeMaterial) {
                    scope.boardMode('materials');
                    scope.control.activeSlide = $index + 1;
                    scope.control.activeMaterial.set('slide', $index + 1);
                }
            };
            scope.next = function () {
                if (scope.control.activeMaterial &&
                    scope.control.activeMaterial.get('slide') < scope.control.activeMaterial.get('count')) {

                    scope.boardMode('materials');
                    scope.control.activeSlide = scope.control.activeMaterial.get('slide') + 1;
                    scope.control.activeMaterial.set('slide', scope.control.activeMaterial.get('slide') + 1)

                }
            };
            scope.previous = function () {
                if (scope.control.activeMaterial &&
                    scope.control.activeMaterial.get('slide') > 1) {

                    scope.boardMode('materials');
                    scope.control.activeSlide = scope.control.activeMaterial.get('slide') - 1;
                    scope.control.activeMaterial.set('slide', scope.control.activeMaterial.get('slide') - 1);

                }
            };
            scope.boardMode = function (boardMode) {
                // whiteboard
                // materials

                function set_(boardMode) {
                    scope.control.boardMode = boardMode;
                    scope.conference.get('board').set('mode', boardMode);
                }

                if (boardMode)
                    set_(boardMode);
                else if (scope.control.boardMode === 'materials')
                    set_('whiteboard');
                else
                    set_('materials');

                drawing.clear();

            };
            scope.thickness = function () {

                scope.control.thickness = scope.control.thickness < 3 ? scope.control.thickness + 1 : 1;

                switch (scope.control.thickness) {
                    case 1:
                        drawing.setWidth(6);
                        break;
                    case 2:
                        drawing.setWidth(16);
                        break;
                    case 3:
                        drawing.setWidth(22);
                        break;
                    default:
                        drawing.setWidth(6);
                        break;
                }

            };
            scope.pencil = function () {
                scope.control.pencilSelected = true;
                scope.control.eraserSelected = false;
                drawing.enable().setMode('draw');
                scope.stream.canvasShow = true;
            };

            scope.pencil();

            scope.eraser = function () {
                scope.control.pencilSelected = false;
                scope.control.eraserSelected = true;
                drawing.enable().setMode('erase');
                scope.stream.canvasShow = true;
            };

            scope.$watch('control.color', function (value) {
                switch (value) {
                    case 'red':
                        drawing.setColor('#f05a64');
                        break;
                    case 'blue':
                        drawing.setColor('#306aff');
                        break;
                    case 'green':
                        drawing.setColor('#6dca24');
                        break;
                    case 'black':
                        drawing.setColor('#282828');
                        break;
                    default:
                        drawing.setColor('#306aff');
                        break;
                }
            });

            scope.$watch('stream.maximized', function (value) {
                drawing.scale = value ? drawing.screenDefaultWidth / 667 : drawing.screenDefaultWidth / scope.player.minPlayerWidth;
                drawing.setColor();
                drawing.setWidth();
            });

            scope.$watch('control.activeSlide', function () {
                drawing.clear();
            });

            element.on('$destroy', function () {
                scope.stream.canvasShow = false;
            });
        },
        templateUrl: '/source/listener/ng-app/templates/control.html',
        replace: true
    }
}]);