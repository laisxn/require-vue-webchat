<?php

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
        $this->server = new swoole_websocket_server ($this->ip, $this->port);

        $this->server->on('open', [$this, 'open']);
        $this->server->on('message', [$this, 'message']);
        $this->server->on('close', [$this, 'close']);

        $this->server->start();
    }

    public function open(swoole_websocket_server  $server, $request)
    {
        $user = ['fd' => $request->fd, 'name' => uniqid()];

        $this->table->set($request->fd, $user);

        $this->pushMsgForOther($server, $request->fd, 'open', $user['fd'] . '：' . $user['name'], $user);
    }

    public function message(swoole_websocket_server  $server, $frame)
    {
        $user = $this->table->get($frame->fd);
        $this->pushMsgForOther($server, $frame->fd, 'message', $user['name'] . '说：' . $frame->data);
    }

    public function close(swoole_websocket_server  $server, $fd)
    {
        $user = $this->table->get($fd);
        $this->pushMsgForOther($server, $fd, 'close', $user['name'] . '：离开了');
        $this->table->del($fd);
    }


    protected function success($type, $msg, $data = [])
    {
        return json_encode(['type' => $type, 'msg' => $msg, 'data' => $data]);
    }

    protected function pushMsgForOther($server, $fd, $type, $msg, $data = [])
    {
        foreach ($this->table as $row) {
            if ($fd != $row['fd']) {
                $server->push($row['fd'], $this->success($type, $msg, $data));
            }
        }
    }

    protected function createTable()
    {
        $this->table = new \swoole_table(1024);
        $this->table->column('fd', \swoole_table::TYPE_INT);
        $this->table->column('name', \swoole_table::TYPE_STRING, 255);
        $this->table->create();
    }
}

$ws = new WebChat();
$ws->start();