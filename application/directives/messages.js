module.directive('messages', [function () {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope) {

            scope.messages = {
                notAuthorized: false,
                banned: false
            };

            scope.$on('notAuthorized', function () {
                scope.messages.notAuthorized = true;
            });

            scope.$on('banned', function () {
                scope.messages.banned = true;
            });

        },
        templateUrl: '/source/listener/ng-app/templates/messages.html',
        replace: true
    };
}]);