<?php
require_once(preg_replace("/^\\.\\//", "", preg_replace("/\\/\\//", "/", "." . strrev(preg_replace("/[^\\/]+/", "..", strrev(preg_replace("/\\\\/", "/", dirname($_SERVER["SCRIPT_NAME"])))))."/.cm4all/include/base.php"))); 
handleBengProxyRequest("/.cm4all/logout?" . $_SERVER['QUERY_STRING']);
