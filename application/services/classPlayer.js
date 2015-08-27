module.factory('classPlayer', ['$sce', '$timeout', '$window', '$document', '$http', function ($sce, $timeout, $window, $document, $http) {
    var timeoutId;
    return {
        scope: null,
        player: {
            activeSlide: 1,
            timeline: false,
            videoCtrlOpen: false,
            fullscreen: false,
            slidesOpen: false,
            shareOpen: false,
            videoOpen: false,
            volumeOpen: false,
            headOpen: true,
            shift: 0,
            play: false,
            video: null,
            videoSrc: null,
            videoType: 'video/mp4',
            volume: 50,
            streamTime: 0,

            minPlayerWidth: 512,
            minPlayerHeight: 384,
            minSlidePreviewWidth: 43,
            slidePreviewWidth: 74
        },
        play: function (time) {
            if (this.scope) {
                if (this.player.videoSrc) {
                    time = (time || this.scope.config.boardEventsLog[this.player.activeSlide - 1].start) / 1000;
                    this.player.video.currentTime = time;
                }
                this.player.videoOpen = true;
                this.player.slidesOpen = false;
                this.player.play = true;
            }
        },
        rewind: function ($index) {
            if (this.scope) {
                this.player.activeSlide = $index + 1;
                if (this.scope.status === 2) {
                    this.player.videoOpen = false;
                } else {
                    if (this.player.videoOpen) {
                        this.play();
                    }
                }
            }
        },
        seek: function (percent) {
            if (this.scope) {
                this.player.video.currentTime = this.player.video.duration * percent / 100;
            }
        },
        volumeOff: function () {
            if (this.player.volume > 0) {
                this.player.previousVolume = this.player.volume;
                this.player.volume = 0;
            } else {
                this.player.volume = this.player.previousVolume;
            }
        },
        next: function () {
            var quantity = this.quantity();

            if (quantity > 0) {
                this.player.activeSlide = this.player.activeSlide < quantity ? this.player.activeSlide + 1 : quantity;
                this.slidesShiftLimits();
            }
        },
        previous: function () {
            this.player.activeSlide = this.player.activeSlide > 1 ? this.player.activeSlide - 1 : this.player.activeSlide;
            this.slidesShiftLimits();
        },
        quantity: function () {
            if (this.scope) {
                return this.scope.config.boardEventsLog.length;
            }
        },
        previewFullscreen: function ($index) {
            this.player.activeSlide = $index + 1;
            this.player.videoOpen = false;
            this.player.play = false;
            this.toggleFullscreen('.player');
        },
        getBaseUrl: function (materialId) {
            if (this.scope) {
                var material = this.scope.conference.get('materials').findWhere({id: materialId});
                if (material) return material.get('baseurl');
            }
            return false;
        },
        getImageSource: function (index, size) {
            // size
            // medium - 512x384 max-width 512 quality 90-80, @2x
            // small - 69x52 max-width 40 quality 90-80, @2x
            // minimum - 40x30 max-width 40 quality 90-80, @2x
            // maximum - 1280, @2x

            if (index === undefined ||
                index < 0 || !this.scope.config || !this.scope.config.boardEventsLog ||
                this.scope.config.boardEventsLog.length - 1 < index || !this.scope || !this.scope.conference) return undefined;

            size = size || 'minimum';

            var obj = config.boardEventsLog[index],
                path;

            if (obj.materialId === 'hybinar') {

                if (this.scope.conference.get('image')) {
                    return config.staticUrl + '/' + this.scope.conference.get('image');
                } else {
                    switch (size) {
                        case 'minimum':
                            path = '/source/listener/img/hybinar__logo_small.png';
                            break;
                        case 'small':
                            path = '/source/listener/img/hybinar__logo_medium';
                            break;
                        case 'medium':
                            path = '/source/listener/img/hybinar__logo.png';
                            break;
                        case 'maximum':
                            path = '/source/listener/img/hybinar__logo.png';
                            break;
                    }
                    return path;
                }

            } else {
                switch (size) {
                    case 'minimum':
                        path = '/slides/small/';
                        break;
                    case 'small':
                        path = '/slides/small/';
                        break;
                    case 'medium':
                        path = '/';
                        break;
                    case 'maximum':
                        path = '/';
                        break;
                }
                return this.scope.config.staticUrl + path + this.getBaseUrl(obj.materialId) + '/1280/' + obj.slideNumber + '.jpg';
            }
        },
        getQuestionsNumbers: function (index) {
            return this.getPosts(index).length;
        },
        getCommentsNumbers: function (post) {
            return this.getComments(post).length;
        },
        selectPosts: function (materialId, slideNumber) {
            if (this.scope && materialId && slideNumber) {
                return this.scope.conference.get('questions').where({
                    'parent_id': '0',
                    'material_id': materialId,
                    'slide_number': slideNumber
                });
            }
            return [];
        },
        getPosts: function (index) {
            //c('classPlayer.getPosts');
            if (this.scope && this.scope.config.boardEventsLog.length > 0) {
                index = (index > this.scope.config.boardEventsLog.length) ? this.scope.config.boardEventsLog.length : index;
                index = index - 1;
                index = index < 0 ? 0 : index;
                return this.selectPosts(this.scope.config.boardEventsLog[index].materialId, this.scope.config.boardEventsLog[index].slideNumber);
            }
            return [];
        },
        getComments: function (post) {
            if (this.scope && post)
                return this.scope.conference.get('questions').where({parent_id: post.get('id')});
            return [];
        },
        toggleFullscreen: function (selector) {
            if (!$document[0].fullscreenElement && !$document[0].webkitFullscreenElement && !$document[0].msFullscreenElement && !$document[0].mozFullScreenElement) {

                var $obj = angular.element(selector || '.player').eq(0);

                if ($obj.length > 0) {
                    var fullscreen =
                        $obj[0].requestFullscreen ||
                        $obj[0].webkitRequestFullscreen ||
                        $obj[0].msRequestFullscreen ||
                        $obj[0].mozRequestFullScreen;

                    fullscreen && fullscreen.call($obj[0]);
                    return true;
                }
            } else {
                var exit =
                    $document[0].exitFullscreen ||
                    $document[0].webkitExitFullscreen ||
                    $document[0].msExitFullscreen ||
                    $document[0].mozCancelFullScreen;

                exit && exit.call($document[0]);
                return false;
            }
            return false;
        },
        anchorScroll: function (id) {
            id = id.split('/').splice(-1);
            id && setTimeout(function () {
                angular.element('#questions' + id + ' textarea').focus();
            }, 200);
        },
        getUser: function (id) {
            if (this.scope) {
                id = id || this.scope.config.listener_id;
                var user = this.scope.conference.get('users').findWhere({id: id});
                if (user) return user;
            }
            return false;
        },
        submitMessage: function (scope, $index, isNote) {
            // events:
            // notAuthorized
            // banned
            // noteWasSent

            if ($index === undefined || $index === false) $index = scope.$index;
            if (!this.scope || !scope.textarea || scope.textarea.length === 0 || !($index >= 0)) return false;

            var context = this,
                message,
                user = this.getUser(),
                time = Date.now();

            if (!user) {
                this.scope.$emit('notAuthorized');
                return false;
            }

            if (user.get('banned')) {
                this.scope.$emit('banned');
                return false;
            }

            message = {
                id: this.scope.config.conference_id + '_' + this.scope.config.listener_id + '_' + time,
                parent_id: (scope.post && scope.post.get('id')) || '0',
                user_id: this.scope.config.listener_id,
                user_photo: user.get('photo'),
                timestamp: time,
                questiontext: scope.textarea,
                name: user.get('name'),
                likes: [],
                dislikes: [],
                material_id: this.scope.config.boardEventsLog[$index].materialId || 0,
                slide_number: this.scope.config.boardEventsLog[$index].slideNumber || 1,
                public_: user.get('public_')
            };

            if (isNote) {
                $http.post('/private/' + this.scope.config.conference_id, message)
                    .success(function (data, status) {
                        if (status === 200) {
                            context.scope.$emit('noteWasSent', message);
                        }
                    })
                    .error(function () {
                    });
            } else {
                scope.conference.get('questions').add(message);
            }

            scope.textarea = '';
            return true;
        },
        boardEventsLogRepeatFilter: function (log) {
            var log_ = [], c, logReverse = log.reverse();
            for (c = 0; c < log.length; c++)
                if (!log_.some(function (element) {
                        return (element.materialId === logReverse[c].materialId && element.slideNumber === logReverse[c].slideNumber)
                    }))
                    log_.push(logReverse[c]);
            return log_.reverse();
        },
        boardEventsLogPush: function () {
            if (this.scope.status !== 1) return false;

            var context = this,
                activeMaterial = null,
                activeSlide = null,
                in_ = false,
                index_ = null;

            function _set() {
                timeoutId = $timeout(function () {
                    if (context.scope.conference.get('board').get('mode') === 'materials') {

                        activeMaterial = context.getActiveMaterial();
                        activeSlide = context.getActiveSlide(activeMaterial);
                        if (!activeMaterial || !activeSlide) return false;

                        angular.forEach(context.scope.config.boardEventsLog, function (element, index) {
                            if (element.materialId === activeMaterial.id && element.slideNumber === activeSlide) {
                                index_ = index;
                                in_ = true;
                            }
                        });

                        if (!in_) {
                            context.scope.config.boardEventsLog.push({
                                timestamp: null,
                                materialId: activeMaterial.id,
                                slideNumber: activeSlide,
                                start: context.player.streamTime - 4000
                            });
                        } else {
                            context.scope.config.boardEventsLog.push(context.scope.config.boardEventsLog.splice(index_, 1)[0]);
                        }
                    } else {

                    }

                    timeoutId = null;
                }, 4000, 0, false);
            }

            if (!timeoutId)
                _set();
            else {
                $timeout.cancel(timeoutId);
                timeoutId = null;
                _set();
            }
        },
        setLikes: function (post, up) {
            if (!post) return false;

            var user = this.getUser(),
                likesArray = post.get('likes'),
                dislikeArray = post.get('dislikes'),
                tempArray;

            if (!user) {
                this.scope.$emit('notAuthorized');
                return false;
            }

            if (user.get('banned')) {
                this.scope.$emit('banned');
                return false;
            }

            if (up) {
                tempArray = likesArray.filter(function (element) {
                    return element !== user.id;
                });
                post.set('likes', []);
                post.set('likes', tempArray);
                tempArray = dislikeArray.filter(function (element) {
                    return element !== user.id;
                });
                (tempArray.length === dislikeArray.length) && tempArray.push(user.id);
                post.set('dislikes', []);
                post.set('dislikes', tempArray);
            } else {
                tempArray = dislikeArray.filter(function (element) {
                    return element !== user.id;
                });
                post.set('dislikes', []);
                post.set('dislikes', tempArray);
                tempArray = likesArray.filter(function (element) {
                    return element !== user.id;
                });
                (tempArray.length === likesArray.length) && tempArray.push(user.id);
                post.set('likes', []);
                post.set('likes', tempArray);
            }
        },
        formatTime: function (seconds) {
            if (moment && seconds) {
                var time = moment(0).seconds(seconds).utc();
                return time.hours() > 0 ? time.format('H:mm:ss') : time.format('m:ss');
            }
            return '0:00';
        },
        declOfNum: function (number, titles) {
            var cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
        },
        round: function (value) {
            return Math.round(value);
        },
        getActiveMaterial: function () {
            if (this.scope.conference) {
                var material = this.scope.conference.get('materials').findWhere({active: true});
                if (material)
                    return material;
            }
            return false;
        },
        getActiveSlide: function (material) {
            if (material)
                return material.get('slide');
            return false;
        },
        slidesAmount: function () {
            return this.player.fullscreen ? (angular.element($window).outerWidth(true) / this.getSlideWidth()) : 12;
        },
        getSlideWidth: function () {
            return this.player.fullscreen ? this.player.slidePreviewWidth : this.player.minSlidePreviewWidth;
        },
        playerWidth: function () {
            return this.player.fullscreen ? $window.screen.width : this.player.minPlayerWidth;
        },
        windowScale: function () {
            return angular.element($window).outerHeight(true) / angular.element($window).outerWidth(true);
        },
        slidesShiftLimits: function () {
            this.player.shift = (this.player.activeSlide + this.player.shift <= this.slidesAmount()) ? this.player.shift : (this.slidesAmount() - this.player.activeSlide);
            this.player.shift = (this.player.activeSlide + this.player.shift > 0) ? this.player.shift : (1 - this.player.activeSlide);
        },
        requestingToSpeak: function (user) {
            if (!user)
                return false;
            else {
                if (user.get('speaking')) {
                    user.set('speaking', false);
                    user.set('controller', false);
                } else
                    user.set('requestingToSpeak', !user.get('requestingToSpeak'));
            }
        },
        renderKatex: function (str) {
            if ($window.katex)
                return katex.renderToString(str);
            return str;
        },
        parseMessage: function (str) {
            var context = this,
                a = document.createElement('a'),
                type;

            str = str
                .replace('<', '&lt;')
                .replace('>', '&gt;');

            str = str.replace(/\[\[(.+)\]\]/g, function (s, p) {

                a.href = p;

                if (!(a.host === $window.location.host || a.host === '')) {

                    type = a.pathname.slice(-3).toLowerCase();

                    if (a.host === 'www.youtube.com')
                        return '<iframe width="100%" height="315" src="//www.youtube.com/embed/' + context.getQueryVariable(a.search, 'v') + '" frameborder="0" allowfullscreen></iframe>';

                    if (a.host === 'youtu.be')
                        return '<iframe width="100%" height="315" src="//www.youtube.com/embed/' + decodeURIComponent(a.pathname.substring(1)) + '" frameborder="0" allowfullscreen></iframe>';

                    if (type.length > 0 &&
                        type === 'jpg' ||
                        type === 'png' ||
                        type === 'gif')
                        return '<img src="' + p + '">';

                    return '<a href="' + p + '" target="_blank">' + p + '</a>';
                } else
                    return context.renderKatex(p);
            });

            return $sce.trustAsHtml(str);
        },
        array: function (length) {
            length = length || 0;
            for (var c = 0, array = []; c < length; c++) array.push(1);
            return array;
        },
        scrollTop: function () {
            $document.scrollTop(0);
        },
        getRemotePosts: function (hashTag, remotePosts) {
            if (!hashTag || !angular.isArray(remotePosts)) return false;

            function onLoad(data) {
                var posts = remotePosts.concat(data);
                posts.sort(function (a, b) {
                    return a.createdAt < b.createdAt;
                });
                angular.copy(posts, remotePosts);
            }

            function getLastPost(resource) {
                var posts = remotePosts.filter(function (element) {
                    return element.type === resource;
                });
                return posts.length > 0 && posts[0];
            }

            if (this.scope) {

                var t = getLastPost('twitter'),
                    i = getLastPost('instagram');

                $http
                    .get(this.scope.config.serverUrl + '/search/tweets?q=' + encodeURIComponent(hashTag) + (t ? '&since_id=' + t.id : ''))
                    .success(function (data, status) {
                        if (status === 200) {
                            if (t)
                                data = data.filter(function (element) {
                                    return element.id !== t.id;
                                });
                            onLoad(data);
                        }
                    });
                $http
                    .get(this.scope.config.serverUrl + '/search/instagram?name=' + encodeURIComponent(hashTag.replace('#', '')) + (i ? '&min_tag_id=' + i.nextMinId : ''))
                    .success(function (data, status) {
                        if (status === 200) {
                            onLoad(data);
                        }
                    });
            }
        },
        saveImage: function (url) {
            var a = $document[0].createElement('A'),
                name;

            a.href = url;
            name = a.pathname.split('/').splice(-1);

            if (url && name) {
                var canvas = $document[0].createElement('CANVAS'),
                    ctx = canvas.getContext('2d'),
                    img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function () {
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(function (blob) {
                        saveAs(blob, name);
                        canvas = null;
                    });
                };
                img.src = url;
            }
        }
    };
}]);