<?php

function urlenc($str) {
    return preg_replace(array("/%2[fF]/","/\+/"), array("/","%20"), urlencode($str));
}

/* (PBT: #5955) width and height of compressed flash
 * prevent getimagesize from uncompress file in memory (exceeds memory limit),
 * no sizes available so far
**/
function getflashsize($child) {
    $file = fopen ( $child , "r");
    $mnumbers = fread ( $file , 3 );
    fclose($file);
    if ($mnumbers == "CWS") {/*compressed*/
        FALSE;
    } else { /*should be FWS*/
        return getimagesize($child);
    }
}

function unbufferedPassthru($filepath) {
    $fp = fopen($filepath, 'rb');
    while(!feof($fp)) {
        $buffer = fread($fp, 1024 * 1024 * 1); // one megabyte
        print $buffer;
        flush();
    }
    fclose($fp);
}
