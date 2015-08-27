module.directive('player', ['$window', '$interval', '$timeout', '$sce', function ($window, $interval, $timeout, $sce) {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope, element) {

            scope.fullScreen = function () {

                function fullScreen() {
                    scope.player.fullscreen = !scope.player.fullscreen;
                    scope.player.slidesOpen = false;
                }

                if (scope.stream) {

                    !scope.stream.fullscreen && fullScreen();
                    scope.stream.fullscreen = false;

                } else
                    fullScreen();

            };

            scope.player.video = element.find('video')[0];

            if (scope.player.video && scope.player.video.play) {

                scope.interval = $interval(function () {
                    scope.player.videoOpen && !scope.$$phase && scope.$digest();
                }, 1000, 0, false);

                scope.player.video.volume = scope.player.volume / 100;

                scope.player.video.onended = function () {
                    scope.player.play = false;
                    scope.player.video.currentTime = 0;
                    scope.player.activeSlide = scope.classPlayer.quantity();
                    scope.player.videoOpen = false;
                    scope.$apply();
                };

                scope.key = function ($event) {
                    if ($event.keyCode === 37) scope.classPlayer.previous();
                    if ($event.keyCode === 39) scope.classPlayer.next();
                };

                scope.mousemove = function () {

                    function set_() {
                        scope.timeout = $timeout(function () {
                            scope.player.videoCtrlOpen = false;
                            scope.player.volumeOpen = false;
                            scope.timeout = null;
                            element.css('cursor', 'none');
                        }, 2000, 0, false);
                    }

                    scope.player.videoCtrlOpen = true;
                    element.css('cursor', 'default');
                    $timeout.cancel(scope.timeout);
                    scope.timeout = null;
                    scope.player.fullscreen && set_();
                };

                scope.$watch('player.play', function (value) {
                    value ? scope.player.video.play() : scope.player.video.pause();
                });

                scope.$watch('player.volume', function (value) {
                    scope.player.video.volume = value / 100;
                });

                scope.$watch('player.videoSrc', function () {
                    scope.player.video.load();
                });

                scope.$watch('status', function (value) {
                    if (value === 3) {
                        scope.player.videoSrc = $sce.trustAsResourceUrl('/video/video' + scope.conference.id + '.mp4');
                    }
                });

                element.on('$destroy', function () {
                    $interval.cancel(scope.interval);
                });
            }
        },
        templateUrl: '/source/listener/ng-app/templates/player.html',
        replace: true
    }
}]);