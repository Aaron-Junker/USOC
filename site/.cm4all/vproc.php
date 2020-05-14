<?php

error_reporting(E_ERROR);

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/config.php");

function getFilepath($imageid) {
    global $config;

    if (preg_match("/\.\./", $imageid)) {
        err("invalid imageid\n");
    }

    $filepath = ($config["mediadb"][0] != '/' ? "../" : "") . $config["mediadb"] .  $imageid;
    return $filepath;
}

$THUMBFORMAT = 'png';
$THUMBWIDTH = 80;
$THUMBHEIGHT = 80;
$FONTSIZE = 2;
$RENDER = 'imagepng';
$FRAMES = 10;
$ffmpeg = extension_loaded('ffmpeg');
$providedPath = $_SERVER["PATH_INFO"];
$realPath = getFilePath($providedPath);
$targetDir = preg_replace('/(.*)\/([^\/]*$)/','$1/.$2',$realPath);
$thumbnailPath = $targetDir.'/video.'.$THUMBFORMAT;
$baseDir = preg_replace('/(.*)\/([^\/]*$)/','$1/',substr($_SERVER['PHP_SELF'],0,-(strlen($providedPath))));

/*
error_log("providedPath: [" . $providedPath . "]");
error_log("realPath: [" . $realPath . "]");
error_log("targetDir:  [" . $targetDir . "]");
error_log("thumbnailPath: [" . $thumbnailPath . "]");
error_log("baseDir: [" . $baseDir . "]");
*/

if (!file_exists($realPath)) {
    header("Content-Type: text/plain",true, 404);
    header("Content-Length: 0");
    exit(0);
}
function abortCallback(){
    if(connection_status() == 2){
        header("Content-Length: " . filesize($thumbnailPath));
        fpassthru(fopen($thumbnailPath, 'rb'));
    }
}

if(file_exists($thumbnailPath) &&
filemtime($thumbnailPath) >= filemtime($realPath) /* already converted */){
    header("Content-Type: image/".$THUMBFORMAT);
    header("Location: ".($thumbnailPath[0] != '/' ?
    $baseDir :
        '').$thumbnailPath, true, 302);
}else {
    $oumask = umask(0002);
    if(!is_dir($targetDir)){
        /* TODO: revise this. do we really need group write rights in real hosting environments?
         * for now this only is needed in our fake hosting env.
         */
        mkdir($targetDir, 0775, true);
    }
    if($ffmpeg){
        /* convert locally */
        ignore_user_abort(true);
        $movie = new ffmpeg_movie($realPath, false);
        $width = $movie->getFrameWidth();
        $height = $movie->getFrameHeight();
        $ar = $width / max(1,$height);
        if($ar >= $THUMBWIDTH / $THUMBHEIGHT){
            $height = $THUMBHEIGHT / $ar;
            $width = $THUMBWIDTH;
        }else{
            $width = $THUMBWIDTH * $ar;
            $height = $THUMBHEIGHT;
        }
        /*
         * render at least an image from somwhere near the beginning.
         * $movie->getFrameCount() can take very long in case the video is in a streaming
         * format.
         */
        $frame = null;
        $frame1 = null;
        for($i = 1; $i <=100 ;$i+=10){
            $frame = $frame1;
            $frame1 = $movie->getFrame($i);
            if(!$frame1){
                break;
            }
        }
        $tmpimage = imagecreatetruecolor($THUMBWIDTH, $THUMBHEIGHT);
        imagefill($tmpimage, 0, 0, imagecolorallocate($tmpimage, 0xFF, 0xFF, 0xFF));
        imagecopyresized($tmpimage,$frame->toGDImage(),(int)(($THUMBWIDTH - $width )/2),(int)(($THUMBHEIGHT - $height )/2),0,0,
            $width,$height,$frame->getWidth(),$frame->getHeight());
        eval($RENDER.'($tmpimage,$thumbnailPath);');
        imagedestroy($tmpimage);
        register_shutdown_function('abortCallback');
        /*
         * here comes the expensive part...
         */
        $frameCount = $movie->getFrameCount();
        $interval = intval($frameCount / ($FRAMES + 1));
        $image = imagecreatetruecolor($THUMBWIDTH * $FRAMES , $THUMBHEIGHT);
        imagefill($image, 0, 0, imagecolorallocate($image, 0xFF, 0xFF, 0xFF));
        for($i = 0; $i < $FRAMES ; $i++){
            $frame = $movie->getFrame(($i + 1) * $interval + 1);
            imagecopyresized($image,$frame->toGDImage(),(int)($i * $THUMBWIDTH)+(($THUMBWIDTH - $width )/2),(int)(($THUMBHEIGHT - $height )/2),0,0,
            $width,$height,$frame->getWidth(),$frame->getHeight());
            /* we render in each iteration to have at least some images
             * if the php timout strikes */
            $tmpimage = imagecreatetruecolor($THUMBWIDTH * ($i + 1), $THUMBHEIGHT);
            imagecopy($tmpimage, $image, 0, 0, 0, 0, $THUMBWIDTH * ($i + 1), $THUMBHEIGHT);
            eval($RENDER.'($tmpimage,$thumbnailPath);');
            imagedestroy($tmpimage);
            set_time_limit(10);
        }
        imagedestroy($image);
        umask($oumask);
        header("Content-Type: image/".$THUMBFORMAT);
        header("Content-Length: " . filesize($thumbnailPath));
        fpassthru(fopen($thumbnailPath, 'rb'));
    }else{
        /* thumbnailing not available */
        header("Content-Type: image/png");
        header("Location: ".$baseDir."video-default-thumbnail.png", true, 302);
    }
}
