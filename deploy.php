<?php

$input = file_get_contents('php://input');
$hash = $_SERVER['HTTP_X_HUB_SIGNATURE'];
$secret = $_ENV['DEPLOY_SECRET'];

if('sha1=' . hash_hmac('sha1', $input, $secret, false) === $hash) {
    shell_exec('cd /var/www/reallysketch.com/public_html');
    echo shell_exec('git pull');
}

?>