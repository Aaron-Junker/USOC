<?php

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."utils.php");

function __isAnimatedGif($filename) {
	$filecontents = file_get_contents($filename);

	$str_loc = 0;
    $count = 0;
    while ($count < 2) {
		$where1 = strpos($filecontents, "\x00\x21\xF9\x04", $str_loc);

		if ($where1 === FALSE) {
			break;
		} else {
			$str_loc = $where1 + 1;
            $where2=strpos($filecontents,"\x00\x2C",$str_loc);
            if ($where2 === FALSE) {
				break;
			} else {
				if ($where1+8 == $where2) {
					$count++;
				}
				$str_loc=$where2+1;
			}
		}
	}

	if ($count > 1) {
		return(true);
	} else {
		return(false);
	}
}

function colorize($im, $rgb) {
    $im = grayscaleImage($im, $rgb);
    return $im;
}

function grayscaleImage($img, $xrgb=false, $imageCreator=false) {
    $x = imagesx($img);
    $y = imagesy($img);
    $gray_img = $imageCreator ? $imageCreator->createTargetImage($x, $y) : imagecreatetruecolor($x, $y);
    if (!$gray_img) {
        return false;
    }
    imagecolorallocate($gray_img, 0, 0, 0);
    for ($i = 0; $i < $x; $i++) {
        for ($j = 0; $j < $y; $j++) {
            $rgb = imagecolorat($img, $i, $j);
            $r = ($rgb >> 16) & 0xFF;
            $g = ($rgb >> 8) & 0xFF;
            $b = $rgb & 0xFF;

            $color = round(.299 * $r + .587 * $g + .114 * $b);
			$alpha = 0;

            if (!$xrgb) {
                $red = $green = $blue = $color;
            } else {
                $red = $color * ($xrgb["red"] / 255);
                $green = $color * ($xrgb["green"] / 255);
                $blue = $color * ($xrgb["blue"] / 255);
            }

            $gray_color = imagecolorexact($gray_img, $red, $green, $blue);
            imagesetpixel($gray_img, $i, $j, $gray_color);
        }
    }
    return $gray_img;
}



function rotateImage($img, $rotation, $imageCreator=false) {
    $width = imagesx($img);
    $height = imagesy($img);

    switch($rotation) {
        case 90: 
            $newimg = $imageCreator ? $imageCreator->createTargetImage($height, $width) : @imagecreatetruecolor($height, $width);
            break;
        case 180: 
            $newimg = $imageCreator ? $imageCreator->createTargetImage($width, $height) : @imagecreatetruecolor($width, $height);
            break;
        case 270: 
            $newimg = $imageCreator ? $imageCreator->createTargetImage($height, $width) : @imagecreatetruecolor($height, $width);
            break;
        case 0:
            return $img;
            break;
        case 360:
            return $img;
            break;
    }

    if($newimg) {
        for($i = 0;$i < $width ; $i++) {
            for($j = 0;$j < $height ; $j++) {
                $reference = imagecolorat($img,$i,$j);
                switch($rotation) {
                    case 90:
                        if (!@imagesetpixel($newimg, $j, ($width - 1) - $i, $reference)) {
                            return false;
                        }
                        break;
                    case 180:
                        if (!@imagesetpixel($newimg, ($width - 1) - $i, ($height - 1) - $j, $reference)) {
                            return false;
                        }
                        break;
                    case 270:
                        if (!@imagesetpixel($newimg, ($height - 1) - $j, $i, $reference)) {
                            return false;
                        }
                        break;
                }
            }
        }
        return $newimg;
    }
    return false;
}

function getUniformScale($fromW, $fromH, $toW, $toH, $useTargetSizeAsMaxSize=true) {
    $scale = 1.0;

    if ($fromW != $toW || $fromH != $toH) {

        $scalex  = $toW / $fromW;
        $scaley  = $toH / $fromH;

        $minScale = min($scalex, $scaley);
        $maxScale = max($scalex, $scaley);

        if ($useTargetSizeAsMaxSize) // toW and toH should be the maximum size
        {
            // we cannot just do min(scalex, scaley) due to rounding issues
            if (floor($fromW * $maxScale) <= $toW && floor($maxScale * $fromH) <= $toH) return $maxScale;
            else return $minScale;
        }
        else // toW and toH should be the minimum size
        {
            return $maxScale;
        }
    }

    return $scale;
}

function hex2RGB($hexStr, $returnAsString = false, $seperator = ',') {
    $hexStr = preg_replace("/[^0-9A-Fa-f]/", '', $hexStr);
    $rgbArray = array();
    if (strlen($hexStr) == 8) {
        $colorVal = hexdec($hexStr);
        $rgbArray['alpha'] = 0xFF & ($colorVal >> 0x18);
        $rgbArray['red'] = 0xFF & ($colorVal >> 0x10);
        $rgbArray['green'] = 0xFF & ($colorVal >> 0x8);
        $rgbArray['blue'] = 0xFF & $colorVal;
    } elseif (strlen($hexStr) == 6) {
        $colorVal = hexdec($hexStr);
        $rgbArray['red'] = 0xFF & ($colorVal >> 0x10);
        $rgbArray['green'] = 0xFF & ($colorVal >> 0x8);
        $rgbArray['blue'] = 0xFF & $colorVal;
    } elseif (strlen($hexStr) == 3) {
        $rgbArray['red'] = hexdec(str_repeat(substr($hexStr, 0, 1), 2));
        $rgbArray['green'] = hexdec(str_repeat(substr($hexStr, 1, 1), 2));
        $rgbArray['blue'] = hexdec(str_repeat(substr($hexStr, 2, 1), 2));
    } else {
        return false;
    }
    return $returnAsString ? implode($seperator, $rgbArray) : $rgbArray; // returns the rgb string or the associative array
}

function err($args, $code=false, $width=250, $height=188) {
	if ($code) {
		header("HTTP/1.1 $code");
	}
	header('Content-Type: image/png');
	$memc = new MemChecker();
	
	if ($memc->check("err", 748, 748, TRUE))	{
		$im = @imagecreatefrompng("../error.png");
		if (!$im) {
			$im = @imagecreatefrompng("error.png");
		}
		if ($im) {
			if ($code) {
				$tc = imagecolorallocate($im, 185, 186, 187);
				$ts = explode(" ", $code);
				foreach ($ts as $k=>$string) {
					imagettftext($im, 60, 0, 10, 70, $tc, "../mono.ttf", $string);
					break;
				}
			}

			ob_end_clean();
			imagepng($im);
			exit;
		}
	}

	$fp = fopen("../error.png", 'rb');
	if (!$fp) {
		$fp = fopen("error.png", 'rb');
	}
	ob_end_clean();
	fpassthru($fp);
	exit;
}
