<?php
/**
 * This is the main entrypoint
 * @license MIT License
 * @copyright 2021 Aaron Junker Technologies
 */
session_start();
/**
 * This constant contains the path to the root of the application
 * @warning This constant is used by the application and should not be changed
 */
const IP = __DIR__;
include_once IP . "/includes/Page.inc.php";
include_once IP . "/includes/Url.inc.php";

use USOC\Page\Page;
use USOC\Url\Url;

try {
    echo Page::displayPage(Page::getPageFromUrl(Url::getPageUrl()));
} catch (Exception $e) {
    echo $e->getMessage();
    exit();
}