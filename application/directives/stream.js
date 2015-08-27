module.directive('stream', ['$interval', function ($interval) {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope, element, attributes) {

            scope.getCanvas = function () {
                return !scope.stream.canvas ? (scope.stream.canvas = element.find('.player__stream_canvas')) : scope.stream.canvas;
            };

            scope.getVideoBoard = function () {
                return !scope.stream.videoBoard ? (scope.stream.videoBoard = element.find('.embed__board embed')[0]) : scope.stream.videoBoard;
            };

            scope.getVideoSpeaker = function () {
                return !scope.stream.videoSpeaker ? (scope.stream.videoSpeaker = element.find('.player__stream_videospeaker embed')[0]) : scope.stream.videoSpeaker;
            };

            scope.getVideoStudent = function () {
                return !scope.stream.videoStudent ? (scope.stream.videoStudent = element.find('.player__stream_video_student embed')[0]) : scope.stream.videoStudent;
            };

            scope.getVideoCamera = function () {
                return !scope.stream.videoCamera ? (scope.stream.videoCamera = element.find('.embed__camera embed')[0]) : scope.stream.videoCamera;
            };

            scope.securityWindowInit = function () {

                element.find('.embed__camera').css('visibility', 'hidden');
                scope.getVideoCamera() && scope.getVideoCamera().setProperty && scope.getVideoCamera().setProperty('src', 'none');
                scope.getVideoCamera() && scope.getVideoCamera().setProperty && scope.getVideoCamera().setProperty('gain', 0.7);

                if (scope.conference.get('board').get('videoStudent'))
                    element.find('.player__stream_video_student').css('visibility', 'visible');

                scope.stream.cameraInit = true;
            };

            scope.stream = {
                canvas: null,
                user: scope.user,
                hover: false,
                streamOff: false,
                fullscreen: false,
                screenMode: 'center',
                deviceAllowed: false,
                securityWindow: null,
                videoBoard: null,
                videoSpeaker: null,
                videoStudent: null,
                videoCamera: null,
                studentCreationComplete: null,
                volumeShow: false,
                camera: null,
                cameraContainer: '',
                cameraVisibility: 'visible',
                maximized: false,
                canvasShow: false,
                getCanvas: scope.getCanvas
            };

            scope.$parent.stream = scope.stream;

            scope.player.streamTime = scope.conference.get('duration');

            scope.interval = $interval(function () {
                scope.player.streamTime += 1000;
            }, 1000);

            scope.showHandUp = function () {
                if (scope.stream.user &&
                    scope.stream.user.id !== scope.conference.get('speaker') &&
                    scope.stream.user.get('avaible') && !scope.stream.user.get('banned') && !scope.stream.user.get('controller'))
                    return true
            };

            scope.streamOff = function () {
                scope.destroy();
                scope.stream.videoBoard = null;
                scope.stream.videoSpeaker = null;
                scope.stream.videoCamera = null;
                scope.stream.streamOff = true;
            };

            scope.setVolume = function (value) {
                scope.getVideoBoard() && scope.getVideoBoard().setProperty('volume', value / 100);
                scope.getVideoSpeaker() && scope.getVideoSpeaker().setProperty('volume', value / 100);
            };

            scope.maximized = function (value) {

                scope.getCanvas();

                scope.stream.maximized = value !== undefined ? value : !scope.stream.maximized;

                if (scope.stream.maximized)
                    scope.stream.canvas.attr({
                        width: 667,
                        height: 500
                    });
                else
                    scope.stream.canvas.attr({
                        width: scope.player.minPlayerWidth,
                        height: scope.player.minPlayerHeight
                    });

            };

            scope.fullScreen = function () {

                function fullScreen() {
                    scope.stream.fullscreen = !scope.stream.fullscreen;
                    scope.stream.screenMode = 'center'
                }

                !scope.player.fullscreen && fullScreen();
                scope.player.fullscreen = false;

            };

            scope.$watch('player.volume', function (value) {
                scope.setVolume(value);
            });

            scope.$watch('stream.deviceAllowed', function (value) {
                if (scope.stream.user) {

                    scope.stream.user.set('avaible', value);

                    if (value) {
                        if (!scope.stream.user.get('speaking') && !scope.stream.securityWindow) {
                            scope.securityWindowInit();
                        }
                    }
                }
            });

            scope.$watch('stream.securityWindow', function (value) {
                if (value === null)
                    return false;

                if (value) {

                    element.find('.player__stream_videospeaker').css('visibility', 'hidden');

                } else {

                    element.find('.player__stream_videospeaker').css('visibility', 'visible');

                    if (!scope.stream.cameraInit) {
                        scope.securityWindowInit();
                    }

                }

            });

            scope.$watch('stream.user.attributes.speaking', function (value, oldValue) {
                if (oldValue === value)
                    return false;

                if (value) {

                    scope.conference.get('board').set('videoStudent', scope.config.mediaServerUrl + '?play=' + scope.config.listener_id);

                } else {

                    scope.conference.get('board').set('videoStudent', null);
                    scope.stream.user.set('controller', false);

                }
            });

            scope.$watch('conference.attributes.board.attributes.videoStudent', function (value) {
                var speaking = scope.stream.user && scope.stream.user.get('speaking');

                if (value) {

                    if (speaking) {

                        scope.getVideoCamera() && scope.getVideoCamera().setProperty && scope.getVideoCamera().setProperty('src', scope.config.mediaServerUrl + '?publish=' + scope.config.listener_id);
                        element.find('.embed__camera').css('visibility', 'visible');

                    } else {

                        scope.getVideoStudent() && scope.getVideoStudent().setProperty && scope.getVideoStudent().setProperty('src', value);
                        element.find('.player__stream_video_student').css('visibility', 'visible');

                    }

                    scope.stream.cameraContainer = 'show';

                } else {

                    scope.stream.cameraInit && scope.getVideoCamera().setProperty('src', 'none');
                    scope.getVideoStudent() && scope.getVideoStudent().setProperty && scope.getVideoStudent().setProperty('src', 'none');
                    element.find('.embed__camera').css('visibility', 'hidden');
                    element.find('.player__stream_video_student').css('visibility', 'hidden');
                    scope.stream.cameraContainer = 'hide';

                }
            });

            scope.$watch('stream.user.attributes.controller', function (value) {
                if (!value) {
                    scope.maximized(false);
                }
            });

            scope.$watch('stream.user.attributes.banned', function (value) {
                if (value) {
                    scope.stream.videoCamera = null;
                }
            });

            scope.$watch('stream.studentCreationComplete', function (value) {
                if (value === null)
                    return false;

                var speaking = scope.stream.user && scope.stream.user.get('speaking');

                if (speaking) {



                } else {

                    var videoStudent = scope.conference.get('board').get('videoStudent');

                    if (videoStudent) {

                        scope.getVideoStudent() && scope.getVideoStudent().setProperty && scope.getVideoStudent().setProperty('src', videoStudent);

                        if (!scope.stream.user || (scope.stream.user && stream.user.get('banned'))) {

                            element.find('.player__stream_video_student').css('visibility', 'visible');

                        }
                    }
                }

                scope.setVolume(scope.player.volume);

            });

            element.on('$destroy', function () {

                $interval.cancel(scope.interval);
                scope.destroy();

            });

            scope.destroy = function () {

                scope.getVideoCamera() && scope.getVideoCamera().setProperty && scope.getVideoCamera().setProperty('src', null);
                scope.stream.cameraContainer = 'hide';

                if (scope.stream.user) {
                    scope.stream.user.set('avaible', false);
                    scope.stream.user.set('controller', false);
                    scope.stream.user.set('speaking', false);
                    scope.stream.user.set('requestingToSpeak', false);
                }

            }

        },
        templateUrl: '/source/listener/ng-app/templates/stream.html',
        replace: true
    }
}]);