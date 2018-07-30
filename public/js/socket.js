function webSocket()
{
    if ("WebSocket" in window)
    {
        console.log("您的浏览器支持 WebSocket!");

        var ws = new WebSocket("ws://119.23.237.171:9501");

        ws.onopen = function()
        {
            ws.send("发送数据123");
            console.log("数据发送中...");
        };

        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            console.log(evt);
            alert("数据已接收...");
        };

        ws.onclose = function()
        {
            // 关闭 websocket
            alert("连接已关闭...");
        };
    }

    else
    {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
}