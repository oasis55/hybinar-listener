module.directive('flashStream', ['$http', '$window', function ($http, $window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            'stream': '=?',
            'mode_': '@mode',
            'deviceAllowed': '=?',
            'securityWindow': '=?',
            'creationComplete': '=?'
        },
        link: function (scope, element, attributes) {

            if ($window.flashEventEmitter === undefined) {
                $window.flashEventEmitter = {
                    subscribers: {},
                    emit: function (event, data) {
                        var subscribers = this.subscribers[data.objectID + ':' + event];
                        if (subscribers)
                            for (var subscriber, i = 0; subscriber = subscribers[i]; i++)
                                subscriber(data);
                    },
                    on: function (event, callback) {
                        if (!this.subscribers[event])
                            this.subscribers[event] = [];
                        if (this.subscribers[event].indexOf(callback) === -1)
                            this.subscribers[event].push(callback);
                    }
                };
            }

            scope.deviceAllowed = false;

            scope.modes = {
                'play': 'bufferTime=0&bufferTimeMax=0',
                'record': 'codec=Speex&videoCodec=H264Avc/baseline/3&cameraDimension=320x240&cameraQuality=100&cameraFPS=25',
                'mixed': 'codec=Speex&videoCodec=H264Avc/baseline/3&cameraDimension=320x240&cameraQuality=100&cameraFPS=25'
            };

            scope.mode = scope.modes[scope.mode_];

            scope['class'] = attributes['class'] ? attributes['class'] : '';

            $http
                .get('/source/listener/ng-app/templates/flashStream.html')
                .success(function (data) {
                    element.replaceWith(
                        element = angular.element(data.replace(/\{\{(.+)\}\}/g, function () {
                            return scope[arguments[1]];
                        }))
                    );
                    scope.embed = angular.element('embed[name=embed_' + scope.$id + ']');
                    scope.embed.on('$destroy', function () {
                        scope.embed = scope.creationComplete = null;
                        scope.$destroy();
                    });
                    scope.embed = scope.embed[0];
                });

            scope.$watch('stream', function () {
                if (scope.creationComplete) {
                    scope.embed.setProperty('src', scope.stream);
                }
            });

            $window.flashEventEmitter.on('embed_' + scope.$id + ':' + 'onCreationComplete', function () {
                if (scope.mode_ === 'play')
                    scope.embed.setProperty('src', scope.stream);
                else
                    scope.embed.setProperty('live', true);

                scope.creationComplete = true;
            });

            $window.flashEventEmitter.on('embed_' + scope.$id + ':' + 'onPropertyChange', function (event) {
                event.property === 'deviceAllowed' && (scope.deviceAllowed = event.newValue);
                event.property === 'securityWindow' && (scope.securityWindow = event.newValue);
            });
        },
        replace: true
    }
}]);