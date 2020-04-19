<?php

error_reporting(E_ERROR);

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/config.php");

header("content-type: text/plain encoding=\"UTF-8\"");

$data = explode("/", $_SERVER["PATH_INFO"]);
array_shift($data);
$key = array_shift($data);
$execute = (array_shift($data) == "exec" ? TRUE : FALSE);

if (!isset($config["listingkey"]) || $config["listingkey"] == ""
|| $key != $config["listingkey"] || strpos($path, "..") !== FALSE
|| $serviceId != 0){
    header("HTTP/1.1 401 Authorization Required");
    echo "401 Authorization Required";
    exit;
}

processDir(".cache");

function new_file($dir, $file) {
    $f = preg_replace("/\/$/", "", preg_replace("/\/$/", "", $dir) . "/" . preg_replace("/^\//", "", $file));
    if (preg_match("/(^|\\/)\\.\\.\\//", $f)) {
	    header("HTTP/1.1 400 Bad Request");
        echo "invalid path $f\n";
		exit;
    }
	return $f;
}

function processDir($dir) {
	global $execute;
	
	if (is_dir($dir)) {
		if ($dh = opendir($dir)) {
			while (($file = readdir($dh)) !== false) {
				if ($file == "." || $file == "..") {
					continue;
				}

				$file = new_file($dir, $file);

				if (is_dir($file)) {
					processDir($file);
					
					echo "$execute rmdir: " . $file . "\n";
					
					if ($execute) {
						rmdir($file);
					}
				} else {
					echo "$execute unlink: " . $file . "\n";
					if ($execute) {
						unlink($file);
					}
				}
			}
		}
	}
}
