<?php

$input = file_get_contents('php://input');
$hash = $_SERVER['HTTP_X_HUB_SIGNATURE'];
$secret = $_SERVER['DEPLOY_SECRET'];

if('sha1=' . hash_hmac('sha1', $input, $secret, false) === $hash) {
    $data = json_decode($input);
    if($data->ref === 'refs/heads/master') {
        shell_exec('cd /var/www/reallysketch.com/public_html');
        echo shell_exec('git pull');
    } else {
        echo 'Push was not to master';
    }
}

?>