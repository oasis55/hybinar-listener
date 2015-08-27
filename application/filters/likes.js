module.filter('likes', [function () {
    return function (input) {
        if (input == 0) return '';
        if (input > 0) return '+' + input;
        return input;
    };
}]);