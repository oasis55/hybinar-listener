module.config(['$routeProvider', '$locationProvider', '$translateProvider', 'language', function ($routeProvider, $locationProvider, $translateProvider, language) {

    language = (language === 'ru' || language === 'en') ? language : 'en';

    $translateProvider
        .translations('ru', {
            STROKE_WIDTH: 'Толщина линии',
            QUESTIONS: 'Вопросов',
            ASK_A_QUESTION: 'Задайте вопрос',
            SHARE: 'Поделиться',
            i4: 'Для того чтобы оставлять комментарии, вам необходимо',
            LOGIN: 'Войти',
            OR: 'или',
            SIGN_UP: 'Зарегистрироваться',
            i8: 'Возможность оставлять комментарии ограничена ведущим!',
            AUTHOR: 'Автор',
            FULLSCREEN: 'Полный экран',
            i11: 'До начала трансляции',
            i12: 'Трансляция еще не началась',
            VOLUME: 'Громкость',
            SLIDES: 'Слайды',
            i15: 'Идет конвертация видео',
            ONAIR: 'Вы в эфире',
            PLEASE_WAIT: 'Пожалуйста, подождите',
            TOGGLE_SIZE: 'Масштабировать',
            CLOSE_BROADCAST: 'Закрыть трансляцию',
            TAKE_CONTROL: 'Управление трансляцией',
            RAISE_HAND: 'Поднять руку',
            MAXIMIZE: 'Увеличить',
            ENABLE_VIDEO: 'Включить видео',
            SEND: 'Отправить',
            i25: 'Ответить',
            i26: 'Оставьте комментарий',
            i28: 'Задайте вопрос или напишите заметку',
            i29: 'Найти на видео',
            i30: 'Предыдущие',
            i31: 'комментарий',
            i32: 'комментария',
            i33: 'комментарев',
            NOTE: 'Заметка',
            QUESTION: 'Вопрос',
            COMMENT: 'Комментарий',
            NEXT_SLIDE: 'Следующий слайд',
            PREVIOUS_SLIDE: 'Предыдущий слайд',
            CLOSE_CONTROL: 'Завершить управление презентацией',
            WHITEBOARD: 'Белая доска',
            PENCIL: 'Карандаш',
            ERASER: 'Стирательная резинка',
            COLOR_SELECTION: 'Выбор цвета',
            DOWNLOAD: 'Загрузить',
            END_CALL: 'Завершить'
        })
        .translations('en', {
            STROKE_WIDTH: 'Stroke width',
            QUESTIONS: 'Questions',
            ASK_A_QUESTION: 'Ask a question',
            SHARE: 'Share',
            i4: 'To submit comments you need to',
            LOGIN: 'Login',
            OR: 'or',
            SIGN_UP: 'Sign up',
            i8: 'You do not have permission to comment!',
            AUTHOR: 'Author',
            FULLSCREEN: 'Full screen',
            i11: 'The broadcast will start in',
            i12: 'The broadcast will start soon...',
            VOLUME: 'Volume',
            SLIDES: 'Slides',
            i15: 'Video converting',
            ONAIR: 'You are on air',
            PLEASE_WAIT: 'Please wait',
            TOGGLE_SIZE: 'Toggle size',
            CLOSE_BROADCAST: 'Close broadcast',
            TAKE_CONTROL: 'Take control',
            RAISE_HAND: 'Raise your hand',
            MAXIMIZE: 'Maximize',
            ENABLE_VIDEO: 'Enable video',
            SEND: 'Send',
            i25: 'Reply',
            i26: 'Comment',
            i28: 'Ask a question',
            i29: 'Find on video',
            i30: 'Previous',
            i31: 'comment',
            i32: 'comments',
            i33: 'comments',
            NOTE: 'Note',
            QUESTION: 'Question',
            COMMENT: 'Comment',
            NEXT_SLIDE: 'Next slide',
            PREVIOUS_SLIDE: 'Previous slide',
            CLOSE_CONTROL: 'Close control',
            WHITEBOARD: 'Whiteboard',
            PENCIL: 'Pencil',
            ERASER: 'Eraser',
            COLOR_SELECTION: 'Сolor selection',
            DOWNLOAD: 'Download',
            END_CALL: 'End call'
        })
        .preferredLanguage(language);

    $routeProvider
        .when('/slide/:slideId', {})
        .when('/:questions/slide/:slideId', {})
        .when('/:questions/slide/:slideId/comment/:commentId', {});
}]);