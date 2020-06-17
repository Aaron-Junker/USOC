<?php
  $file = <<<'HEREDOC';
  <?php
    error_reporting(E_ALL);
    //MYSQL CREDITALS
    define ( 'MYSQL_HOST',      'localhost' );
    define ( 'MYSQL_USER',  'root' );
    define ( 'MYSQL_PASSWORD',  'password' );
    define ( 'MYSQL_DATABASE', 'USOC' );
    //define
    $USOC["SITE_PATH"] = "$1";
    $USOC["ADMIN_PATH"] = "$2";
    $USOC["DOMAIN"] = "$3";
  ?>
  HEREDOC;
?>
