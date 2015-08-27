module.directive('dScroll', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
    // type - horizontal
    // type - vertical
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attributes) {

            scope.config = scope.$eval(attributes.dScroll);

            if (angular.isObject(scope.config) &&
                scope.config.block &&
                scope.config.container &&
                scope.config.scrollbar &&
                scope.config.bar) {

                !(scope.config.type === 'horizontal' ||
                scope.config.type === 'vertical') &&
                (scope.config.type = 'vertical');
                scope.block = element.find(scope.config.block);
                scope.container = element.find(scope.config.container);
                scope.scrollbar = element.find(scope.config.scrollbar);
                scope.bar = element.find(scope.config.bar);

                if (scope.block.length === 1 &&
                    scope.container.length === 1 &&
                    scope.scrollbar.length === 1 &&
                    scope.bar.length === 1) {
                    scope.delta = 40;
                    scope.shift = 0;
                    scope.blockSize = 0;
                    scope.containerSize = 0;
                    scope.scrollSize = 0;
                    scope.proportion = 0;
                    scope.time = 0;
                    scope.timeoutId = null;

                    if (scope.config.type === 'vertical') {
                        scope.margin = 'margin-top';
                        scope.offsetAxis = 'offsetY';
                        scope.offsetDirection = 'top';
                        scope.scrollDirection = 'scrollHeight';
                        scope.size = 'height'
                    } else {
                        scope.margin = 'margin-left';
                        scope.offsetAxis = 'offsetX';
                        scope.offsetDirection = 'left';
                        scope.scrollDirection = 'scrollWidth';
                        scope.size = 'width'
                    }

                    scope.resize = function () {

                        if (scope.time + 200 > Date.now()) {
                            $timeout.cancel(scope.timeoutId);
                            scope.timeoutId = $timeout(function () {
                                scope.resize()
                            }, 201);
                            return false;
                        }

                        scope.time = Date.now();
                        scope.scroll = false;
                        scope.scrollbar.hide();

                        if ((scope.containerSize = scope.container[0][scope.scrollDirection]) > (scope.blockSize = scope.block[scope.size]())) {
                            scope.bar[scope.size](scope.scrollSize = scope.blockSize * scope.blockSize / scope.containerSize);
                            scope.shift = Number(scope.container.css(scope.margin).replace(/[^-\d\.]/g, ''));
                            scope.proportion = (scope.containerSize - scope.blockSize) / (scope.blockSize - scope.scrollSize);
                            scope.scrollbar.show();
                            scope.scroll = true;
                        }

                    };

                    scope.resize();

                    scope.scrollbar.on('mousedown', function (event) {
                        scope.mozOffsetFix(event);
                        scope.offset = event[scope.offsetAxis];
                        scope.shiftOld = scope.shift / scope.proportion;
                        scope.bar.margin = Number(scope.bar.css(scope.margin).replace(/[^-\d\.]/g, ''));
                        if (event[scope.offsetAxis] >= scope.bar.margin &&
                            event[scope.offsetAxis] <= scope.bar.margin + scope.scrollSize) {
                            scope.aboveBar = true;
                        }
                    });

                    scope.scrollbar.on('mouseup', function (event) {
                        if (!scope.aboveBar) {
                            scope.mozOffsetFix(event);
                            scope.shift = (scope.scrollSize / 2 - event[scope.offsetAxis]) * scope.proportion;
                            scope.setShift();
                        }
                        scope.aboveBar = false;
                    });

                    scope.scrollbar.on('mousemove', function (event) {
                        if (scope.aboveBar) {
                            scope.mozOffsetFix(event);
                            scope.shift = (scope.shiftOld + scope.offset - event[scope.offsetAxis]) * scope.proportion;
                            scope.setShift();
                        }
                    });

                    $document.on('mouseup mouseleave', function () { // moz fix
                        scope.aboveBar = false;
                    });

                    element.on('mousewheel', function (event, delta) {
                        if (scope.scroll) {
                            if (scope.shift === 0 && delta > 0) return true;
                            if (scope.shift === scope.blockSize - scope.containerSize && delta < 0) return true;
                            scope.shift += delta * scope.delta;
                            scope.setShift();
                            return false;
                        }
                    });

                    element.on('$destroy', function () {
                        angular.element($window).off('resize', scope.resize);
                        element.off('DOMSubtreeModified propertychange', scope.resize);
                    });

                    element.on('DOMSubtreeModified propertychange', scope.resize);

                    angular.element($window).on('resize', scope.resize);

                    scope.setShift = function () {
                        scope.shift > 0 && (scope.shift = 0);
                        scope.shift < scope.blockSize - scope.containerSize && (scope.shift = scope.blockSize - scope.containerSize);
                        scope.container.css(scope.margin, scope.shift);
                        scope.bar.css(scope.margin, (scope.scrollSize - scope.blockSize) / (scope.containerSize - scope.blockSize) * (scope.shift));
                    };

                    scope.mozOffsetFix = function (event) {
                        if (typeof event.offsetX === "undefined" || typeof event.offsetY === "undefined") {
                            var targetOffset = angular.element(event.target).offset();
                            event.offsetX = event.pageX - targetOffset.left;
                            event.offsetY = event.pageY - targetOffset.top;
                        }
                    }

                } else
                    scope.scrollbar.length === 1 && scope.scrollbar.hide();
            }
        }
    };
}]);