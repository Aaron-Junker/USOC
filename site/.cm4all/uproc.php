<?php
ob_start();

/*modify translation as follows:*/

/*In /usr/share/pyshared/cm4all/translation/backend/sites.py:*/
/*if segment in ('/.cm4all/uproc.php/', '/.cm4all/iproc.php/'*/

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/config.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/mime_types_data.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/mime_types.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/utils.php");

// -----------------------------------------------------------------------------

function uerr($args, $code="404 Not Found") {
    header("HTTP/1.1 $code");
    header('Content-Type: text/plain');
    header("Content-Length: 0");
    ob_end_clean();
    exit;
}

// -----------------------------------------------------------------------------

function userErrorHandler($errno , $errstr) {
    error_log($errstr);
    header("Content-Type: text/plain",true, 501);
    header("Content-Length: 0");
    exit(0);
}

// -----------------------------------------------------------------------------

/* (MBT: 8155) php warning message destroys otherwise perfectly sane image file */
error_reporting(E_ERROR);

function getFilepath($path) {
    global $config;

    if (preg_match("/(^|\\/)\\.\\.\\//", $path)) {
        uerr("invalid imageid\n", "400 Bad Request");
    }

    if (preg_match("/^\\.cm4all\\/sysdb\\//", $path)) {
        $filepath = "../" . $path;
    } else {
        $filepath = (strpos(getServicePath(), "/") != 0 ? "../" : "") . getServicePath() . "/" . $path;
    }

    return $filepath;
}

// -----------------------------------------------------------------------------

function getUroOriginalName($parent) {
	return substr($parent, 1);
}

// -----------------------------------------------------------------------------

function getUroOriginalPath($path, $parent) {
    $namePos = strpos($path, $parent);
    $name = getUroOriginalName($parent);
    return substr_replace($path, $name, $namePos);
}

// -----------------------------------------------------------------------------

function isUro($parent) {
    $dotPos = strpos($parent, ".");
    return $dotPos === 0;
}

// -----------------------------------------------------------------------------

function isUroThumb($parent, $filename) {
    $thumbPos = strpos($filename, "thumb");
    return isUro($parent) && $thumbPos === 0;
}

// -----------------------------------------------------------------------------

function isUroScale($parent, $filename) {
    $scalePos = strpos($filename, "scale");
    return isUro($parent) && $scalePos === 0;
}

// -----------------------------------------------------------------------------

function isUroPicture($parent, $filename) {
    $picturePos = strpos($filename, "picture-");
    return isUro($parent) && $picturePos === 0;
}

// -----------------------------------------------------------------------------

function isUroVideo($parent, $filename) {
    $videoPos = strpos($filename, "video");
    return isUro($parent) && $videoPos === 0;
}

// -----------------------------------------------------------------------------

function isGif($filename) {
    return preg_match('/\.(gif)(?:[\?\#].*)?$/', $filename);
}

// -----------------------------------------------------------------------------

function isAnimatedGif($filepath) {
    if (!($fh = @fopen($filepath, 'rb'))) {
        return false;
    }

    $count = 0;

    while(!feof($fh) && $count < 2) {
        $chunk = fread($fh, 1024 * 100);
        $count += preg_match_all('#\x00\x21\xF9\x04.{4}\x00(\x2C|\x21)#s', $chunk, $matches);
    }

    fclose($fh);
    return $count > 1;
}

// -----------------------------------------------------------------------------

function getServicePath() {
    global $config;
    global $serviceid;
    if ($serviceid === "0") {
        $mediaPath = $config["mediadb"];
    } elseif ($serviceid === "1500") {
        $mediaPath = str_replace("mediadb","sysdb",$config["mediadb"]);
    }
    else {
        uerr("invalid $serviceid\n", "400 Bad Request");
    }
    return $mediaPath;
}

// -----------------------------------------------------------------------------
// helper function: replace LAST occurence of a string
function substr_replace_last($search, $replace, $str) {
    if(($pos = strrpos($str, $search)) !== false) {
        $search_length  = strlen($search);
        $str = substr_replace($str, $replace, $pos, $search_length);
    }
    return $str;
}

// -----------------------------------------------------------------------------
// start of main

set_error_handler("userErrorHandler",E_USER_ERROR);

$querydata = explode("&",$_SERVER["QUERY_STRING"]);
$isattachment = is_int(array_search("cdp=a",$querydata));
$ispassthrough = is_int(array_search("pass=true",$querydata));

$reqdata = explode("/", $_SERVER["PATH_INFO"]);
array_shift($reqdata);
/* extract serviceid from path, currently unused */
$serviceid = array_shift($reqdata);

$filename = $reqdata[count($reqdata) - 1];
$parent = $reqdata[count($reqdata) - 2];
$path = implode("/", $reqdata);
$filepath = getFilepath($path);

// debug
// echo $filename . "\n" . $parent . "\n" . $path . "\n" . $filepath . "\n";
// echo getUroOriginalName($parent) . "\n" . getUroOriginalPath($path, $parent) . "\n" . getFilepath(getUroOriginalPath($path, $parent)) . "\n";
// echo (isGif(getUroOriginalName($parent)) ? "isGif" : "noGif") . "\n" . (isUroThumb($parent, $filename) ? "isThumb" : "noThumb");
// exit(0);

if (!file_exists($filepath) || (isGif(getUroOriginalName($parent)) /* isAnimatedGif($filepath) */ && !isUroThumb($parent, $filename))) {
    if (isUro($parent)) {
        if ($filename == 'poster') {
            // request on missing file "poster" in an URO folder, must be a video folder
            // so we have a video folder without a poster file, so return the "thumb" element
            $path = substr_replace_last('poster', 'thumb', $path);
        } else {
            $path = getUroOriginalPath($path, $parent);
        }
    } else {
        uerr("ERROR: uro resource file [$filepath] not found", "404 [$path] Not Found");
    }

    $filepath = getFilepath($path);

    if (!file_exists($filepath)) {
        uerr("ERROR: uro fallback file [$filepath] not found", "404 Not Found");
    }
}

if ($isattachment) {
    header("Content-Type: " . getContentType($filepath));
    header("Content-Length: " . filesize($filepath));
    $user_agent = $_SERVER["HTTP_USER_AGENT"];

    if (!preg_match("/Safari/", $user_agent) ||
        !preg_match("/iPhone OS (1|2|3|4|5)_/", $user_agent)) { // omit Content-Disposition header for safari on ios <= 5.x due to projects issue #1417
        header("Content-Disposition: attachment; filename=\"" . $filename . "\"");
    }

    ob_end_clean();
    unbufferedPassthru($filepath);
} elseif ($ispassthrough) {
    header("Content-Type: " . getContentType($filepath));
    header("Content-Length: " . filesize($filepath));
    header("Access-Control-Allow-Origin: *");
    $user_agent = $_SERVER["HTTP_USER_AGENT"];

    ob_end_clean();
    unbufferedPassthru($filepath);
} else {
	$mediaDbPath = preg_replace("/\\/.cm4all\\/uproc.php\\/.*/" , "/", $_SERVER["REQUEST_URI"]) . getServicePath();
    $imagePath = preg_replace("/%2F/", "/", urlenc(preg_replace("/^\\/+/", "", $path)));
    header("Location: " .  preg_replace("/\\/\\/+/", "/", $mediaDbPath . "/" . $imagePath));
    ob_end_clean();
}

// -----------------------------------------------------------------------------
