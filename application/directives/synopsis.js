module.directive('synopsis', [function () {
    return {
        restrict: 'E',
        transclude: true,
        controller: ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
            $scope.once = $scope.$watch('inited', function (value) {
                if (value) {

                    $scope.quantity = $scope.classPlayer.quantity();

                    $scope.questions = {
                        selectSlide: $scope.quantity - 1,
                        shift: (5 - $scope.quantity > 0) ? 0 : (5 - $scope.quantity),
                        shiftSelector: 4,
                        notes: [],
                        hashTag: $scope.conference.get('hashtag'),
                        remotePosts: []
                    };

                    $http.get('/private/' + $scope.config.conference_id).success(function (data, status) {
                        if (status === 200) {
                            $scope.questions.notes = angular.isArray(data) && data.reverse();
                        }
                    });

                    $scope.showItem = function ($index) {
                        if ($index > $scope.classPlayer.quantity() - 1)
                            return false;

                        return (
                            $scope.classPlayer.getQuestionsNumbers($index + 1) > 0 ||
                            $scope.getNotes($scope.config.boardEventsLog[$index].materialId, $scope.config.boardEventsLog[$index].slideNumber).length > 0 ||
                            $scope.showQuestionAdd($index)
                        );
                    };

                    $scope.showQuestionAdd = function ($index) {
                        return (
                            $scope.$route.current &&
                            $scope.$route.current.params.questions === 'questions' && !$scope.$route.current.params.commentId &&
                            $scope.$route.current.params.slideId == $index + 1
                        );
                    };

                    $scope.getNotes = function (materialId, slideNumber) {
                        return $scope.questions.notes.filter(function (element) {
                            return (element.material_id && (element.material_id === materialId) &&
                            element.slide_number && (element.slide_number === slideNumber))
                        });
                    };

                    $scope.$watch('config.boardEventsLog.length', function () {
                        $scope.questions.shift = 5 - $scope.config.boardEventsLog.length;
                    });

                    $scope.$watch('status', function (value) {
                        if (value === 1)
                            $scope.intervalId = $interval(function () {
                                // $scope.classPlayer.getRemotePosts($scope.questions.hashTag, $scope.questions.remotePosts);
                            }, 10000);
                        else
                            $interval.cancel($scope.intervalId);
                    });

                    $scope.$watch('conference.attributes.hashtag', function (value) {
                        $scope.questions.hashTag = value;
                        $scope.questions.remotePosts = [];
                        // $scope.classPlayer.getRemotePosts($scope.questions.hashTag, $scope.questions.remotePosts);
                    });

                    $scope.$parent.$on('noteWasSent', function () {
                        $scope.questions.notes.unshift(arguments[1]);
                    });

                    $scope.once();
                }
            });
        }],
        templateUrl: '/source/listener/ng-app/templates/synopsis.html',
        replace: true
    }
}]);