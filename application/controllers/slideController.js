module.controller('slideController', ['$scope', function ($scope) {
    $scope.questions = 0;
    $scope.setQuestions = function (value) {
        return $scope.questions = value;
    };
}]);