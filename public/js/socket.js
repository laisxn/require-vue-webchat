define(["jquery", "vue"], function ($, Vue) {
    var config = {
        server_url : "ws://127.0.0.1:9503"
    };
    var ws = {

        server : null,
        title : {},
        content : {},
	    checkHeart : false,

        init : function () {
            console.log('初始化');
            this.server = new WebSocket(config.server_url);
            this.title = '正在建立连接';
            this.open();
            this.message();
            this.close();
            this.error();
            this.setTitle(this.title);
	        ws.checkHeart = false;
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
                var class_name = 'other-talk';
                if (this.content.type == 'open') {
                    class_name = "wc-in";
                } else if (this.content.type == 'close') {
                    class_name = "wc-out";
                }
                $('#words').append('<div class="wc-time"><span class="other">' + this.content.data.time + '</span></div>');
                $('#words').append('<div class="' + class_name + '"><span class="other">' + this.content.msg + '</span></div>');
                $('#words').scrollTop = $('#words').scrollHeight;
                console.log(this.content)
            }
        },

        close : function () {
            this.server.onclose = function () {
                this.title = '连接已断开';
                ws.setTitle(this.title);
                console.log('连接已断开');
		        ws.checkHeart = true;
            }
        },

        error : function() {
            this.server.onerror = function (e) {
                console.log(e);
                console.log('Error occured: ' + e['data']);
		    ws.checkHeart = true;
            };
        },

        send : function (msg) {
            this.server.send(msg);
        },

        setTitle : function (title) {
            $('#title').html(title);
        },
        
        reconnect : function () {
            this.init();
        }

    };

    return ws;

});
