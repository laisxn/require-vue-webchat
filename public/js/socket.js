define(["jquery", "vue"], function ($, Vue) {
    var config = {
        server_url : "ws://119.23.237.171:9503"
    }
    var ws = {

        server : null,
        title : {},
        content : {},

        init : function () {
            console.log('初始化');
            this.server = new WebSocket(config.server_url);
            this.title = '正在建立连接';
            this.open();
            this.message();
            this.close();
            this.error();
            this.setTitle(this.title);
        },

        open : function () {
            this.server.onopen = function () {
                this.title = '连接成功';
                ws.setTitle(this.title);
                console.log('连接成功');
            }
        },

        message : function () {
            this.server.onmessage = function (e) {
                this.title = '通信中';
                ws.setTitle(this.title);
                this.content = JSON.parse(e['data']);
                $('#words').append('<div class="other-talk"><span class="other">' + this.content.msg + '</span></div>');
                console.log(this.content)
            }
        },

        close : function () {
            this.server.onclose = function () {
                this.title = '连接已断开';
                ws.setTitle(this.title);
                console.log('连接已断开');
            }
        },

        error : function() {
            this.server.onerror = function (e) {
                console.log(e);
                console.log('Error occured: ' + e['data']);
            };
        },

        send : function (msg) {
            this.server.send(msg);
        },

        setTitle : function (title) {
            $('#title').html(title);
        }

    }

    return ws;

})
