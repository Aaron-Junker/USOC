<?php

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."../include/BrowserRequest.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."../include/BengProxy.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."../include/config.php");

global $config;

$bpr = new BengProxyHandler(new BrowserRequest(), "/.cm4all/search.idx");
$bpr->execRequest();
$bpr->sendResponse();

?>