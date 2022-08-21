<?php
namespace WebChat;


class Config {

    public static $database = [
        'mysql' => [
            'host' => '127.0.0.1',
            'port' => '3306',
            'user' => 'root',
            'password' => 'root',
            'database' => 'chat',
        ],
    ];

    public static $chat_record_post_url = 'http://127.0.0.1/chatRecord';
    public static $api_auth_key = '11111111111';

}

