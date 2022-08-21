<?php
namespace WebChat;

require_once "config.php";
class WebChat
{
    protected $server;

    protected $table;

    protected $ip;

    protected $port;

    public function __construct()
    {
        $this->ip = '0.0.0.0';
        $this->port = 9503;
    }

    public function start()
    {
        $this->createTable();
        $this->server = new \swoole_websocket_server ($this->ip, $this->port);

        $this->server->on('open', [$this, 'open']);
        $this->server->on('message', [$this, 'message']);
        $this->server->on('close', [$this, 'close']);

        $this->server->start();
    }

    public function open(\swoole_websocket_server  $server, $request)
    {
        $user = ['fd' => $request->fd, 'name' => uniqid(), 'ip' => $request->server['remote_addr'] ?? '', 'time' => date('Y-m-d H:i:s')];

        $this->table->set($request->fd, $user);

        $this->pushMsgForOther($server, $request->fd, 'open', $user['name'] . '进来了', $user);
    }

    public function message(\swoole_websocket_server  $server, $frame)
    {
        $user = $this->table->get($frame->fd);
        $this->pushMsgForOther($server, $frame->fd, 'message', $user['name'] . '说：' . $frame->data, $user);
    }

    public function close(\swoole_websocket_server  $server, $fd)
    {
        $user = $this->table->get($fd);
        $this->pushMsgForOther($server, $fd, 'close', $user['name'] . '：离开了', $user);
        $this->table->del($fd);
    }


    protected function success($type, $msg, $data = [])
    {
        $result = json_encode(['type' => $type, 'msg' => $msg, 'data' => $data]);
        return $result;
    }

    protected function pushMsgForOther($server, $fd, $type, $msg, $data = [])
    {
        foreach ($this->table as $row) {
            if ($fd != $row['fd']) {
                $server->push($row['fd'], $this->success($type, $msg, $data));
            }
        }

        $data['time'] = $data['time'] ?? date(('Y-m-d H:i:s'));
        $this->record([
            'ip' => $data['ip'],
            'content' => "{$data['time']}：{$msg}",
            'user_nickname' => $data['name'],
            'api_auth_key' => Config::$api_auth_key,
        ]);
    }

    protected function createTable()
    {
        $this->table = new \swoole_table(1024);
        $this->table->column('fd', \swoole_table::TYPE_INT);
        $this->table->column('name', \swoole_table::TYPE_STRING, 255);
        $this->table->column('ip', \swoole_table::TYPE_STRING, 32);
        $this->table->column('time', \swoole_table::TYPE_STRING, 32);
        $this->table->create();
    }

    protected function record($result) {
        $requestBody = http_build_query($result);
        try {
            $context = stream_context_create(['http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n"."Content-Length: " . mb_strlen($requestBody),
                'content' => $requestBody,
            ]
            ]);
            return Config::$chat_record_post_url && file_get_contents(Config::$chat_record_post_url, false, $context);
        } catch (\Throwable $throwable) {
            return $throwable->getMessage();
        }

    }
}

$ws = new WebChat();
$ws->start();