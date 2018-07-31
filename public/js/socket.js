var config = {
    server_url : "ws://119.23.237.171:9501"
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
        this.server.onmessage = function (evt) {
            this.title = '收到消息';
            ws.setTitle(this.title);
            this.content = JSON.stringify(evt.data)
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

    send : function (msg) {
        this.server.send(msg);
    },

    setTitle : function (title) {
        $('#title').html(title);
        //var aaa = new Vue({});
        //console.log(aaa)
    }

}