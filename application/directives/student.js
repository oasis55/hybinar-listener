module.directive('student', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: ['$scope', 'classPlayer', '$window', '$route', '$location', '$routeParams', '$translate', '$http', 'isMobile',
            function ($scope, classPlayer, $window, $route, $location, $routeParams, $translate, $http, isMobile) {
                //$window.$scope = $scope; // debug !!!!!!!!
                //$scope.$http = $http; // debug !!!!!!!!

                $scope.inited = false;
                $scope.conference = null;
                $scope.config = config;

                if ($scope.config.listener_id === '') syncTransport.send = function () {};

                Backbone.sync = function (method, model, options) {};

                $scope.socket = io.connect($scope.config.serverUrl);

                $scope.socket.on('connect', function () {

                    syncTransport.setSenderTransport(function () {
                        return $scope.socket;
                    });

                    $scope.socket.emit('listener_start', {
                        id: $scope.config.listener_id,
                        conference: $scope.config.conference_id,
                        sessionData: $scope.config.sessionData
                    });

                });
                $scope.socket.on('listener_init', function (conferenceData) {
                    if (!$scope.inited) {

                        var conference = new ConferenceModel();
                        conference.set(conferenceData);

                        $scope.conference = conference;
                        $scope.mobile = isMobile.any();
                        $scope.status = $scope.conference.get('status');
                        $scope.classPlayer = classPlayer;
                        $scope.classPlayer.scope = $scope;
                        $scope.player = $scope.classPlayer.player;
                        $scope.user = $scope.classPlayer.getUser();
                        $scope.$window = $window;
                        $scope.$route = $route;
                        $scope.$location = $location;
                        $scope.$routeParams = $routeParams;
                        $scope.$translate = $translate;
                        $scope.config.boardEventsLog.unshift({
                            timestamp: null,
                            materialId: 'hybinar',
                            slideNumber: 1,
                            start: 0
                        });
                        $scope.config.boardEventsLog = classPlayer.boardEventsLogRepeatFilter($scope.config.boardEventsLog);
                        $scope.inited = true;
                        $scope.$digest();

                        if ($scope.$route.current && !$scope.$route.current.params.questions &&
                            $scope.$route.current.params['slideId']) {
                            $scope.player.activeSlide = Number($scope.$route.current.params['slideId']);
                        }

                        $scope.socket.on('sync', function (data) {
                            syncTransport.msgRecived(data);
                            $scope.classPlayer.boardEventsLogPush();
                            $scope.$digest();
                        });

                        $scope.$watch('$location.$$path', function (value) {
                            classPlayer.anchorScroll(value);
                        });

                        $scope.$watch('conference.attributes.recordready', function (value) {
                            value === true && ($scope.conference.attributes.status = 3);
                        });

                        $scope.$watch('conference.attributes.status', function (value) {
                            $scope.status = value;

                            if (value !== 1) {
                                $scope.conference.get('board').set('videoStudent', null);
                            }
                        });

                        if ($scope.user) {
                            $scope.$watch('user.attributes.banned', function (value) {
                                value && $scope.$emit('banned');
                            });
                        }

                    }
                });
            }],
        templateUrl: '/source/listener/ng-app/templates/student.html',
        replace: true
    };
}]);