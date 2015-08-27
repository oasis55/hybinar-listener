module.controller('commentsController', ['$scope', function ($scope) {
    $scope.commentsNumbers = 0;
    $scope.commentsShow = false;
    $scope.setCommentsNumbers = function (value) {
        return $scope.commentsNumbers = value;
    };
}]);