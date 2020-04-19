<?php
ob_start();

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/ImageProcessorImpl.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/mime_types_data.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/mime_types.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/utils.php");

/* (MBT: 8155) php warning message destroys otherwise perfectly sane image file */
error_reporting(E_ERROR);

function getFilepath($imageid) {
    global $config;

    if (preg_match("/(^|\\/)\\.\\.\\//", $imageid)) {
        err("invalid imageid\n", "400 Bad Request");
    }

    if (preg_match("/^\\.cm4all\\/sysdb\\//", $imageid)) {
        $filepath = "../" . $imageid;
        /* (PBT: #9906) set mediadb = ./ for sysdb passthrough */
        $config["mediadb"] = "./";
    } else {
        $filepath = (strpos($config["mediadb"], "/") != 0 ? "../" : "") . $config["mediadb"] . "/" . $imageid;
    }

    return $filepath;
}

function userErrorHandler($errno , $errstr) {
    error_log($errstr);
    header("Content-Type: text/plain",true, 501);
    header("Content-Length: 0");
    exit(0);
}

set_error_handler("userErrorHandler",E_USER_ERROR);
$COMMANDS = array(
    "resize"    => array( "minarg" => 2, "maxarg" => 2, "impl" => "Resize" ),
    "scale"     => array( "minarg" => 1, "maxarg" => 2, "impl" => "Scale" ),
    "scalecrop" => array( "minarg" => 1, "maxarg" => 2, "impl" => "ScaleCrop" ),
    "center"    => array( "minarg" => 3, "maxarg" => 5, "impl" => "Center" ),
    "equalize"  => array( "minarg" => 0, "maxarg" => 0, "impl" => "Equalize" ), // not implemented yet
    "crop"      => array( "minarg" => 2, "maxarg" => 4, "impl" => "Crop" ),
    "rotate"    => array( "minarg" => 1, "maxarg" => 1, "impl" => "Rotate" ),
    "grayscale" => array( "minarg" => 0, "maxarg" => 0, "impl" => "Grayscale" ),
    "colorize"  => array( "minarg" => 1, "maxarg" => 1, "impl" => "Colorize" ),
    "downsize"    => array( "minarg" => 1, "maxarg" => 2, "impl" => "Downsize" ),
    "donotenlarge"  => array( "minarg" => 0, "maxarg" => 0 ),
    /* blur
     * brighten */
);

$querydata = explode("&",$_SERVER["QUERY_STRING"]);
$isattachment = is_int(array_search("cdp=a",$querydata));

$reqdata = explode("/", $_SERVER["PATH_INFO"]);
array_shift($reqdata);

$filename = $reqdata[count($reqdata) - 1];
$rawtrans = "-";
$imageid = implode("/", $reqdata);
$filepath = getFilepath($imageid);

if (!file_exists($filepath)) {
    $filename = array_pop($reqdata);
    $rawtrans = array_pop($reqdata);
    $imageid = implode("/", $reqdata);
    $filepath = getFilepath($imageid);
}

if (!file_exists($filepath)) {
    err("ERROR: file [$imageid] not found", "404 Not Found");
}

if ($rawtrans != "-" && $rawtrans != "donotenlarge" && $rawtrans != "scale_0_0") {

    $donotenlarge = FALSE !== strpos( $rawtrans , "donotenlarge" );
    $transforms = explode(";", $rawtrans);

    $_inputImage = new InputImage($filepath, $filename, $rawtrans);

    if (!$_inputImage->isCached()) {
        if (!$_inputImage->isAnimatedGif()) {
            foreach ($transforms as $i=>$_args) {
                $args = explode("_", $_args);
                $cmd = array_shift($args);
                if ($cmd != "") {
                    if ($COMMANDS[$cmd]) {
                        $arglen = count($args);
                        if ($arglen < $COMMANDS[$cmd]["minarg"] || $arglen > $COMMANDS[$cmd]["maxarg"]) {
                            err("ERROR: command [$cmd] has " . $COMMANDS[$cmd]["minarg"] . " to " . $COMMANDS[$cmd]["maxarg"] . " arguments", "400 Bad Request");
                        } else if ($cmd == "donotenlarge") {
                            /*scip processing*/
                        } else {
                            $impl = new $COMMANDS[$cmd]["impl"]();
                            $impl->exec($_inputImage, $args, $donotenlarge);
                        }
                    } else {
                        err("ERROR: command [$cmd] not found", "404 Not Found");
                    }
                }
            }

            $_inputImage->writeResult();
            $_inputImage->destroy();
        } else {
            // load the image
            $_inputImage->copyThru();
        }
    }

    if ($isattachment) {
        header("Content-Disposition: attachment; filename=\"" . $filename . "\"");
    }

    ob_end_clean();
    $_inputImage->writeCached();
} else {
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
    } else {
        $mediaDbPath = preg_replace("/\\/.cm4all\\/iproc.php\\/.*/" , "/", $_SERVER["REQUEST_URI"]) . $config["mediadb"];
        $imagePath = preg_replace("/%2F/", "/", urlenc(preg_replace("/^\\/+/", "", $imageid)));
        header("Location: " .  preg_replace("/\\/\\/+/", "/", $mediaDbPath . "/" . $imagePath));
        ob_end_clean();
    }
}
