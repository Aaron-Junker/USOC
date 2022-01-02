<?php

namespace USOC\Database;

include_once 'configuration.php';

define('dbLink', mysqli_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE));

class Database{
    public static function query($query): \mysqli_result|false
    {
        return mysqli_query(dbLink, $query);
    }
    public static function getRows($dbResult): array|false|null
    {
        return mysqli_fetch_array($dbResult, MYSQLI_ASSOC);
    }
}