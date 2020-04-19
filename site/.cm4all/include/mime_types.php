<?php

function getMimeType($filename) {
	if (function_exists('finfo_open')) {
        $finfo = @finfo_open(FILEINFO_MIME);
        $mimetype = finfo_file($finfo, $filename);
        $mimetype = explode(';',$mimetype);
        $mimetype = array_shift($mimetype);

        finfo_close($finfo);

        # bug 19790: php.finfo_file does not recognize svg files without xml deklaration
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        if ($ext == 'svg' && $mimetype == 'text/plain' ) {
            return 'image/svg';
        }

        if (preg_match("|application/octet\\-stream|",$mimetype) === 0 && $mimetype != ""){
            return $mimetype;
        }
	}
	if (function_exists('mime_content_type')) {
	$mimetype = mime_content_type($filename);
        if (preg_match("|application/octet\\-stream|",$mimetype) === 0 && $mimetype != "" && $mimetype != "text/plain" ){
	            return $mimetype;
        }
    }

    if (function_exists('exif_imagetype')) {
            $mimetype = image_type_to_mime_type(exif_imagetype($filename));
            if (preg_match("|application/octet\\-stream|",$mimetype) === 0 && $mimetype != "") {
                    return $mimetype;
            }
    }

	global $mime_types_data;
    $ext = strtolower(array_pop(explode('.',$filename)));
    if (array_key_exists($ext, $mime_types_data)) {
        return $mime_types_data[$ext];
    } else {
        return 'application/octet-stream';
    }
}

function getContentType($file){
    $mtype = getMimeType($file);

    if (preg_match("|application/octet\\-stream|",$mtype) === 1){

    	/*
    	 * (PBT: #2187) deleted ffmpeg content check.
    	 * ffmpeg-php exits with PHP Fatal error if
    	 * it doesn't know the codec.
    	 */

	    $sfx = strtolower(substr($file,-3));
	    if ($sfx == "mpg") {
	        return "video/mpv";
	    }else if ($sfx == "wmv") {
	        return "video/x-ms-asf";
	    }
	}
	return $mtype;
}

function tryffmpeg($file) {
    $ffmpeg = extension_loaded('ffmpeg');
    if($ffmpeg){
        $mimetypemap["mpeg1video"] = "video/mpv";
        $mimetypemap["vc1"] = "video/x-ms-asf";
        $movie = new ffmpeg_movie($file, false);
        if($movie != null){
            $vcodec = $movie->getVideoCodec();
            if(array_key_exists($vcodec,$mimetypemap)){
                return $mimetypemap[$vcodec];
            }
            return "video/x-generic";
        }
    }
    return "";
}
