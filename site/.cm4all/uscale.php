<?php

// -----------------------------------------------------------------------------

error_reporting(E_ERROR);
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/config.php");

// -----------------------------------------------------------------------------

function returnMessage($message, $code) {
    header("HTTP/1.1 $code");
    header('Content-Type: text/plain');
    header("Content-Length: " . strlen($message));

    echo $message;

    exit(0);
}

// -----------------------------------------------------------------------------

function getFilepath($path) {
    global $config;
    global $messageString;

    if (preg_match("/(^|\\/)\\.\\.\\//", $path)) {
        returnMessage("invalid path\n", "400 Bad Request");
    }

    $filePath = (strpos($config["mediadb"], "/") != 0 ? "../" : "") . $config["mediadb"] . $path;

    if (!file_exists($filePath)) {
        returnMessage($messageString . "ERROR: file [$filePath] not found\n", "404 Not Found");
    }

    return $filePath;
}

// -----------------------------------------------------------------------------

function createHiddenFolder($imagePath) {
    global $messageString;

    $hiddenFolder = dirname($imagePath) . "/." . basename($imagePath);

    // $messageString = $messageString . "createHiddenFolder " . $hiddenFolder ."\n";

    if (!file_exists($hiddenFolder)) {
        $mkdir = mkdir($hiddenFolder, 0777, true);
        $chmod = chmod($hiddenFolder, 0777);

        if (!($mkdir && $chmod)) {
            returnMessage($messageString . "ERROR: folder [$hiddenFolder] not created", "500 Internal server error");
        }
    }

    return $hiddenFolder;
}

// -----------------------------------------------------------------------------

function readImage($filePath) {
    global $messageString;
    // $messageString = $messageString . "readImage " . $filePath . "\n";

    $info = getImageSize($filePath);

    if (!$info) {
        returnMessage($messageString . "ERROR: image [$filePath] info missing", "500 Internal server error");
    }

    switch($info['mime']) {
        case "image/gif":
            $image = imageCreateFromGif($filePath);
            break;
        case "image/jpeg":
            $image = imageCreateFromJpeg($filePath);
            break;
        case "image/png":
            $image = imageCreateFromPng($filePath);
            break;
        case "image/bmp":
            $image = imageCreateFromBmp($filePath);
            break;
        case "image/wbmp":
            $image = imagecreatefromwbmp($filePath);
            break;
    }

    $messageString = $messageString . "readImage info " . $info[0] . " x " . $info[1] . ", " . $info['mime'] . "\n";

    if (!$image) {
        returnMessage($messageString . "ERROR: image [$filePath] not read", "500 Internal server error");
    }

    $exif = exif_read_data($filePath);

    if ($image && $exif && isset($exif['Orientation'])) {
        $orientation = $exif['Orientation'];

        $messageString = $messageString . "readImage orientation " . $orientation ."\n";

        if ($orientation == 6 || $orientation == 5) {
            $image = imagerotate($image, 270, null);
        }

        if ($orientation == 3 || $orientation == 4) {
            $image = imagerotate($image, 180, null);
        }

        if ($orientation == 8 || $orientation == 7) {
            $image = imagerotate($image, 90, null);
        }

        if ($orientation == 5 || $orientation == 4 || $orientation == 7) {
            imageflip($image, IMG_FLIP_HORIZONTAL);
        }
    }

    return $image;
}

// -----------------------------------------------------------------------------

function createThumbImage($hiddenFolder, $name, $width, $height) {
    global $messageString;
    global $forceRender;

    // don't render if exists and not forcing rerendering
    if (file_exists($hiddenFolder . "/" . $name) && !$forceRender) {
        $messageString = $messageString . "file " . $name . " already exists\n";
        return true;
    }

    // get global source image
    $source = getSourceImage();
    $realWidth = imagesx($source);
    $realHeight = imagesy($source);

    // compute 'fixed bounds' scale value
    $scaleValue = min($width / $realWidth, $height / $realHeight);

    if ($scaleValue > 1.0) {
        // do not enlarge pictures
        $scaleValue = 1.0;
    }

    $newWidth = intval($realWidth * $scaleValue);
    $newHeight = intval($realHeight * $scaleValue);

    $xoffset = intval(($width - $newWidth) / 2);
    $yoffset = intval(($height - $newHeight) / 2);

    $image = imagecreatetruecolor($width, $height);

    // set background
    $color = imagecolorallocate($image, 255, 255, 255);
    imagefill($image, 0, 0, $color);
    imagecolordeallocate($image, $color);

    $copied = imagecopyresampled($image, $source, $xoffset, $yoffset, 0, 0, $newWidth, $newHeight, $realWidth, $realHeight);

    $messageString = $messageString . "createThumbImage " . $realWidth . " x " . $realHeight ." / " . $newWidth . " x " . $newHeight ."\n";

    if (!($image && $copied)) {
        returnMessage($messageString . "ERROR: image [$name] not scaled\n", "500 Internal server error");
    }

    $saved = imagejpeg($image , $hiddenFolder . "/" . $name);

    if (!$saved) {
        returnMessage($messageString . "ERROR: image [$name] not saved\n", "500 Internal server error");
    }

    imagedestroy($image);

    return $saved;
}

// -----------------------------------------------------------------------------

function createScaledImage($hiddenFolder, $name, $maxPixelCount) {
    global $messageString;
    global $forceRender;

    // don't render if exists and not forcing rerendering
    if (file_exists($hiddenFolder . "/" . $name) && !$forceRender) {
        $messageString = $messageString . "file " . $name . " already exists\n";
        return true;
    }

    // get global source image
    $source = getSourceImage();
    $realWidth = imagesx($source);
    $realHeight = imagesy($source);

    // compute 'fixed pixel' scale value
    $imgPixelCount = $realWidth * $realHeight;
    $scaleValue = sqrt($maxPixelCount / $imgPixelCount);

    if ($scaleValue > 1.0) {
        // do not enlarge pictures
        $scaleValue = 1.0;
    }

    $newWidth = intval($realWidth * $scaleValue);
    $newHeight = intval($realHeight * $scaleValue);

    $copied = false;

    if (defined(imagescale)) {
        $image = imagescale($source, $newWidth, $newHeight);
        $copied = true;
    } else {
        $image = imagecreatetruecolor($newWidth, $newHeight);
        $copied = imagecopyresampled($image, $source, 0, 0, 0, 0, $newWidth, $newHeight, $realWidth, $realHeight);
    }

    $messageString = $messageString . "createScaledImage " . $realWidth . " x " . $realHeight ." / " . $newWidth . " x " . $newHeight ."\n";

    if (!($image && $copied)) {
        returnMessage($messageString . "ERROR: image [$name] not scaled", "500 Internal server error");
    }

    $saved = imagejpeg($image , $hiddenFolder . "/" . $name);

    if (!$saved) {
        returnMessage($messageString . "ERROR: image [$name] not saved", "500 Internal server error");
    }

    imagedestroy($image);

    return $saved;
}

// -----------------------------------------------------------------------------

function createPictureImages($hiddenFolder, $name, $widths) {
    global $messageString;
    global $forceRender;

    // values being computed only when needed
    $source = NULL;
    $realWidth;
    $realHeight;

    foreach ($widths as $width) {
        $pictureName = $name . "-" . $width;

        // don't render if exists and not forcing rerendering
        if (file_exists($hiddenFolder . "/" . $pictureName) && !$forceRender) {
            $messageString = $messageString . "file " . $pictureName . " already exists\n";
            continue;
        }

        // now we know that we really need the source image.
        if ($source == NULL) {
            $source = getSourceImage();
            $realWidth  = imagesx($source);
            $realHeight = imagesy($source);
        }

        $scaleValue = $width / $realWidth;

        if ($scaleValue > 1.0) {
            // do not enlarge pictures
            // uproc returns default image if picture-xxx is not found
            continue;
        }

        $newWidth = intval($realWidth * $scaleValue);
        $newHeight = intval($realHeight * $scaleValue);

        $copied = false;

        if (defined(imagescale)) {
            $image = imagescale($source, $newWidth, $newHeight);
            $copied = true;
        } else {
            $image = imagecreatetruecolor($newWidth, $newHeight);
            $copied = imagecopyresampled($image, $source, 0, 0, 0, 0, $newWidth, $newHeight, $realWidth, $realHeight);
        }

        $messageString = $messageString . "createPictureImages " . $realWidth . " x " . $realHeight ." / " . $newWidth . " x " . $newHeight ."\n";

        if (!($image && $copied)) {
            returnMessage($messageString . "ERROR: image [$pictureName] not scaled", "500 Internal server error");
        }

        $saved = imagejpeg($image , $hiddenFolder . "/" . $pictureName);

        if (!$saved) {
            returnMessage($messageString . "ERROR: image [$pictureName] not saved", "500 Internal server error");
        }

        imagedestroy($image);
    }

    return true;
}

// -----------------------------------------------------------------------------

// load the image only when its actually needed
// all "create*Image" functions call this to access the image to be scaled
function getSourceImage() {
    global $filePath;
    global $source;

    if ($source == NULL) {
        $source = readImage($filePath);
    }

    return $source;
}

// -----------------------------------------------------------------------------
// start of main

// curl -X POST http://user.hosting.com/.cm4all/uscale.php/listingkey/image.jpg?force=true

// extract key and path from PATH_INFO
$data = explode("/", $_SERVER["PATH_INFO"]);
array_shift($data);
$key = array_shift($data);
$path = implode("/", $data);

// bail out if listingkey is missing
if (!isset($config["listingkey"]) || $config["listingkey"] == "" || $key != $config["listingkey"] || strpos($path, "..") !== FALSE) {
    returnMessage("Authorization Required", "401 Authorization Required");
}

// set to true if you want to forcely rerender everything
$forceRender = false;

// we ignore non-post request
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    returnMessage("Method not allowed", "405 Method not allowed");
}

if ($_REQUEST["force"] == "true") {
    $forceRender = true;
}

// get filepath to image resource
$filePath = getFilepath($path);

$messageString = "\nuscale start\n";
$messageString = $messageString . "force: " . ($forceRender?"true":"false"). "\n";
$messageString = $messageString . "filePath: " . $filePath . ", path: " . $path ."\n";

// global image resource. will be loaded only when really needed with "getSourceImage"
$source = NULL;

// create hidden folder
$hiddenFolder = createHiddenFolder($filePath);

// scale and save 'thumb' to hidden folder
createThumbImage($hiddenFolder, "thumb", 80, 80);

// scale and save 'scale' to hidden folder
createScaledImage($hiddenFolder, "scale", 1280 * 1280);

// scale and save 'picture-x' images to hidden folder
createPictureImages($hiddenFolder, "picture", array(200, 400, 800, 1200, 1600, 2600));

// cleanup
imagedestroy($source);

// exit and return nice message
returnMessage($messageString . "uscale done\n", "200 Ok");

// -----------------------------------------------------------------------------
