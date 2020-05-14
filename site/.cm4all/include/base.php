<?php

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."BrowserRequest.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."BengProxy.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."config.php");

/* 
    IIS compatibility
*/
if (!isset($_SERVER['REQUEST_URI'])) {
    $_SERVER['REQUEST_URI'] = $_SERVER['PHP_SELF'];
    if (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != "") {
        $_SERVER['REQUEST_URI'] .= '?' . $_SERVER['QUERY_STRING'];
    }
}

/*
    lazy programmers compatibility
*/
if (!isset($_SERVER["PATH_INFO"])) {
    $_SERVER["PATH_INFO"] = "";
}

/**
* Example Usage
* Echos the HTTP Request back to the client/browser
*/

function handleBengProxyRequest($uri=false) {
    $bpr = new BengProxyHandler(new BrowserRequest(), $uri);
    $bpr->execRequest();
    $bpr->sendResponse();
}
