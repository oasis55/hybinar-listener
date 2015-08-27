module.directive('first', [function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '/source/listener/ng-app/templates/first.html',
        replace: true
    };
}]);