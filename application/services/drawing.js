module.factory('drawing', [function () {
    return {
        listenerId: null,
        enabled: false,
        canvas: null,
        ctx: null,
        socket: null,
        paintingStarted: false,
        mode: 'none',
        color: '#f05a64',
        width: 6,
        eraseWidth: 24,
        screenDefaultWidth: 1024,
        screenDefaultHeight: 768,
        scale: 1,

        enable: function () {
            if (!this.enabled && this.canvas) {
                this.enabled = true;

                this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', $.proxy(this.onEvent, this));
                this.ctx = this.canvas[0].getContext('2d');
                this.ctx.lineCap = this.ctx.lineJoin = 'round';

                this.setColor(this.color);
                this.setWidth(this.width);
            }

            return this;
        },
        disable: function () {
            if (this.enabled) {
                this.enabled = false;

                this.canvas.unbind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
            }

            return this;
        },
        setColor: function (color) {
            this.color = color || this.color;

            if (this.enabled) {
                this.ctx.strokeStyle = this.color;
                this.socket.emit('draw', {
                    id: this.listenerId,
                    data: {'t': 'sc', c: this.color}
                });
            }

            return this;
        },
        setWidth: function (width) {
            this.width = width || this.width;

            if (this.enabled) {
                this.ctx.lineWidth = this.width;
                this.socket.emit('draw', {
                    id: this.listenerId,
                    data: {'t': 'sw', w: this.width}
                });
            }
            return this;
        },
        setMode: function (mode) {
            this.mode = mode;

            if (this.enabled) {
                this.socket.emit('draw', {
                    id: this.listenerId,
                    data: {'t': 'sm', m: this.mode}
                });
            }

            return this;
        },
        clear: function () {
            if (this.enabled) {
                this.ctx.clearRect(0, 0, 1024, 768);
            }
        },
        onEvent: function (event) {
            var x = event.offsetX || event.originalEvent.layerX,
                y = event.offsetY || event.originalEvent.layerY;

            switch (event.type) {
                case 'mousedown':
                case 'touchstart':
                    this.paintingStarted = true;

                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);

                    this.socket.emit('draw', {
                        id: this.listenerId,
                        data: {'t': 'mt', x: x * this.scale, y: y * this.scale}
                    });

                    break;

                case 'mouseup':
                case 'mouseout':
                case 'mouseleave':
                case 'touchend':
                case 'touchcancel':
                    this.paintingStarted = false;

                    break;

                case 'mousemove':
                case 'touchmove':
                    if (!this.paintingStarted) return;
                    if (this.mode === 'draw') {
                        this.ctx.lineTo(x, y);
                        this.ctx.stroke();

                    } else if (this.mode === 'erase') {
                        var eraseWidth = 24;
                        this.ctx.clearRect(x - (eraseWidth / 2), y - (eraseWidth / 2), eraseWidth, eraseWidth);
                    }

                    this.socket.emit('draw', {
                        id: this.listenerId,
                        data: {'t': 'lt', x: x * this.scale, y: y * this.scale}
                    });

                    break;
            }

            return false;
        }
    };
}]);