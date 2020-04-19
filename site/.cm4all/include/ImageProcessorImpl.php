<?php

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."ImageProcessorHelper.php");
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."config.php");

class MemChecker {
	function __construct() {
		if(function_exists('ini_get_all')){
			$iniData = ini_get_all();
			$this->memoryLimitBytes = min(
				$this->_getBytes($iniData["memory_limit"]["local_value"]),
				$this->_getBytes($iniData["memory_limit"]["global_value"])
			);
		}else{
			$this->memoryLimitBytes = $this->_getBytes(ini_get("memory_limit"));
		}
	}

    function MemChecker() {
        self::__construct();
    }

	function _getBytes($mValue) {
		if (!$mValue) {
			$mValue = "666M";
		}

	    $mValue = trim($mValue);
	    if (is_numeric($mValue)) {
	        $iValue = $mValue;
	    } else {
	        $sUnit  = strtolower(substr($mValue, -1));
	        $iValue = (int) substr($mValue, 0, -1);
	        switch ($sUnit) {
	            case 'k':
	                $iValue *= 1024;
	            case 'm':
	                $iValue *= 1024;
	            case 'g':
	                $iValue *= 1024;
	        }
	    }
	    return $iValue;
	}

	function _getImageMemUsage($width, $heigth) {
		return $width * $heigth * 4 + 1024; # 3 colors * 8 bit + 1 alpha * 8 bit = 32 bit = 4 byte, 1024 byte as security barrier
	}

    function check($fn, $width, $height, $noAutoError=FALSE) {
		$expectedMemUsage = memory_get_usage(TRUE) + $this->_getImageMemUsage($width, $height);
		if ($expectedMemUsage > $this->memoryLimitBytes) {
			if ($noAutoError) {
				return FALSE;
			} else {
				error_log("Out of memory\n($fn)\nDimensions: $width x $height\nMemory Usage: ". $expectedMemUsage . " > Available Memory: " . $this->memoryLimitBytes);
				err("Out of memory\n($fn)\n$width x $height\n" . $expectedMemUsage . " > " . $this->memoryLimitBytes, "413 Request Entity Too Large");
			}
		}
    }
}

class InputImage {

    function __construct($imagepath, $filename, $rawtrans) {
        $this->imagepath = $imagepath;
        $this->_imagepath = md5($this->imagepath);
        $this->filename = $filename;
        $this->imginfo = @getimagesize($this->imagepath);
        $this->transpath = preg_replace("/_|;/", "/", $rawtrans);
        $this->suffix = strtolower(substr($this->filename, strrpos($this->filename, ".")));
		if (!$this->suffix) {
			$this->suffix = ".png";
		}
        $this->cachedir = ".cache/" . $this->transpath . "/";
        $this->im = false;
		$this->memChecker = new MemChecker();
		$this->transparentColor = FALSE;
		$this->transparentIndex = FALSE;
		$this->loaded = false;

		// preprocess animated gif stuff
		$this->_isAnimatedGif = false;
		if ($this->imginfo[2] == IMAGETYPE_GIF) {
			$this->_isAnimatedGif = __isAnimatedGif($this->imagepath);
			if ($this->_isAnimatedGif) {
				$this->suffix = ".gif";
			}
		}

    }

    function InputImage() {
        self::__construct();
    }

	function createTargetImage($width, $height) {
		$this->memChecker->check("createTargetImage", $width, $height);

		if (!$this->loaded) {
			trigger_error('InputImage->get must be called first!', E_USER_ERROR);
		}

		$im = @imagecreatetruecolor($width, $height);

		if ($this->suffix != ".jpg"
		 && $this->suffix != ".jpeg"
		 && $this->suffix != ".gif")
		{
			// Turn off alpha blending and set alpha flag
	        @imagealphablending($im, false);
	        @imagesavealpha($im, true);
			// Internally another image is created by libgd
			$this->memChecker->check("allocateAlpha", $width, $height);
			@imagefill($im, 0, 0, @imagecolorallocatealpha($im, 0,0,0,127));
		}

		if($this->transparentColor) {
			imagealphablending($im, false);
			$this->transparentIndex = @imagecolorallocatealpha($im, $this->transparentColor['red'], $this->transparentColor['green'], $this->transparentColor['blue'], 127);
			$this->memChecker->check("allocateTransparentColor", $width, $height);
		    @imagefill($im, 0,0, $this->transparentIndex);
		}

		return $im;
	}

    function get() {
		$this->memChecker->check("get", $this->imginfo[0], $this->imginfo[1]);

        if (!$this->im) {
            if ($this->imginfo[2] == IMAGETYPE_GIF) {
                $this->im = @imagecreatefromgif($this->imagepath) or trigger_error('Cannot load image: ' . $this->imagepath, E_USER_ERROR);
				// store transparent color
				$transparent_index = @imagecolortransparent($this->im);
				if ($transparent_index != -1) {
					$this->transparentColor = @imagecolorsforindex($this->im, $transparent_index);
				}
            } else if ($this->imginfo[2] == IMAGETYPE_JPEG) {
                $this->im = @imagecreatefromjpeg($this->imagepath) or trigger_error('Cannot load image: ' . $this->imagepath, E_USER_ERROR);
            } else if ($this->imginfo[2] == IMAGETYPE_PNG) {
                $this->im = @imagecreatefrompng($this->imagepath) or trigger_error('Cannot load image: ' . $this->imagepath, E_USER_ERROR);
            } else if ($this->imginfo[2] == IMAGETYPE_BMP) {
                $this->im = @imagecreatefrombmp($this->imagepath) or trigger_error('Cannot load image: ' . $this->imagepath, E_USER_ERROR);
            } else if ($this->imginfo[2] == IMAGETYPE_WBMP)  {
                $this->im = @imagecreatefromwbmp($this->imagepath) or trigger_error('Cannot load image: ' . $this->imagepath, E_USER_ERROR);
            } else {
                trigger_error('Cannot load image: ' . $this->imagepath, E_USER_ERROR);
            }
        }

		$this->loaded = true;
        return $this->im;
    }

    function set($im) {
        $this->destroy();
        $this->im = $im;
        $this->imginfo[0] = imagesx($this->im);
        $this->imginfo[1] = imagesy($this->im);
    }

    function destroy() {
        @imagedestroy($this->im);
        $this->im = false;
    }

    function width() {
        return $this->imginfo[0];
    }

    function height() {
        return $this->imginfo[1];
    }

    function writeResult($transformedImage=false) {
        if (!$transformedImage) {
            $transformedImage = $this->im;
        }

        $this->prepareCacheFile();

        if ($this->suffix == ".jpg" || $this->suffix == ".jpeg") {
            @imagejpeg($transformedImage, $this->_cachefile(), 90);
        } else if ($this->suffix == ".gif") {
			if ($this->transparentIndex) {
				// restore transparency
				@imagecolortransparent($transformedImage, $this->transparentIndex);
				$iwidth = @imagesx($transformedImage);
				$iheight = @imagesy($transformedImage);
				for ($y = 0 ; $y < $iheight ; $y++) {
				    for ($x = 0 ; $x < $iwidth ; $x++) {
				      	if (((@imagecolorat($transformedImage, $x, $y) >> 24) & 0x7F) >= 100) {
							@imagesetpixel($transformedImage, $x, $y, $this->transparentIndex);
						}
					}
				}
			}
			@imagetruecolortopalette($transformedImage, true, 255);
			@imagesavealpha($transformedImage, false);
            @imagegif($transformedImage, $this->_cachefile());
        } else {
            @imagepng($transformedImage, $this->_cachefile());
        }
    }

    function addContentHeader() {
        if ($this->suffix == ".jpg" || $this->suffix == ".jpeg") {
            header('Content-Type: image/jpeg');
        } else if ($this->suffix == ".gif") {
            header('Content-Type: image/gif');
        } else {
            header('Content-Type: image/png');
        }

        header("Content-Length: " . filesize($this->_cachefile()));
    }

	function isAnimatedGif() {
		return $this->_isAnimatedGif;
	}

	function copyThru() {
		$this->prepareCacheFile();
		copy($this->imagepath, $this->_cachefile());
	}

    // -----------------------------------------------------------------------------

    function writeCached() {
        if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && (strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == filemtime($this->_cachefile()))) {
            $this->addContentHeader();
            $this->addCacheHeader(304);
        } else {
            $this->addContentHeader();
            $this->addCacheHeader();
            fpassthru(fopen($this->_cachefile(), 'rb'));
        }
    }

    function isCached() {
        $isCached = file_exists($this->_cachefile()) && filemtime($this->_cachefile()) > filemtime($this->imagepath);
        return $isCached;
    }

    function _cachefile() {
        return $this->cachedir . $this->_imagepath . $this->suffix;
    }

    function prepareCacheFile() {
        $cachefile = $this->_cachefile();
        $cachedir = preg_replace("/\\\\/", "/", dirname($cachefile));
        if (!file_exists($cachedir)) {
            mkdir($cachedir, 0755, true);
        }
    }

    function addCacheHeader($code=200) {
        $cachefile = $this->_cachefile();
        header('Last-Modified: ' . gmdate("D, d M Y H:i:s", filemtime($cachefile)) ." GMT", true, $code);
    }
}

class Resize {
    function __construct() {}
    function Resize() {}

    function exec($inputImage, $args, $donotenlarge) {
        list($width, $height) = $args;

        if ($donotenlarge == true) {
            $width = min($inputImage->width(), $width);
            $height = min($inputImage->height(), $height);
        }

        $inputImageRes = $inputImage->get();
        if (!$inputImageRes) {
            err("could not read image", "500 Internal Server Error", $width, $height);
        }
        $im = $inputImage->createTargetImage($width, $height);
        if (!$im) {
            err("could not create target image", "500 Internal Server Error", $width, $height);
        }

        @imagecopyresampled($im, $inputImageRes, 0, 0, 0, 0, $width, $height, $inputImage->width(), $inputImage->height());
        $inputImage->set($im);
    }
}

class Downsize {
    function __construct() {}
    function Downsize() {}
	function exec($inputImage, $args, $donotenlarge) {
		$impl = new Scale();
		$impl->exec($inputImage, $args, TRUE);
	}
}

class Scale {
    function __construct() {}
    function Scale() {}
    function exec($inputImage, $args, $donotenlarge) {
        $scale = 1;

        if (count($args) == 1) {
            list($scale) = $args;

            if ($donotenlarge == true) {
                $scale = min($scale, 1);
            }
        } else {
            list($maxWidth, $maxHeight) = $args;

            if ($donotenlarge == true) {
                $maxWidth = min($inputImage->width(), $maxWidth);
                $maxHeight = min($inputImage->height(), $maxHeight);
            }

            if ($maxWidth != 0 && $maxHeight != 0) {
                $scale = getUniformScale($inputImage->width(), $inputImage->height(), $maxWidth, $maxHeight);
            } else if ($maxWidth != 0) {
                $scale = $maxWidth / $inputImage->width();
            } else if ($maxHeight != 0) {
                $scale = $maxHeight / $inputImage->height();
            }
        }

        $newWidth = $inputImage->width() * $scale;
        $newHeight = $inputImage->height() * $scale;

        $inputImageRes = $inputImage->get();
        if (!$inputImageRes) {
            err("could not read image", "500 Internal Server Error", $width, $height);
        }
        $im = $inputImage->createTargetImage($newWidth, $newHeight);
        if (!$im) {
            err("could not create target image", "500 Internal Server Error", $width, $height);
        }

        @imagecopyresampled($im, $inputImageRes, 0, 0, 0, 0, $newWidth, $newHeight, $inputImage->width(), $inputImage->height());
        $inputImage->set($im);
    }
}

class ScaleCrop {
    function __construct() {}
    function ScaleCrop() {}
    function exec($inputImage, $args, $donotenlarge) {
        list($width, $height) = $args;

        if ($donotenlarge == true) {
            $width = min($inputImage->width(), $width);
            $height = min($inputImage->height(), $height);
        }
        $imageWidth  = $inputImage->width();
        $imageHeight = $inputImage->height();

        $scaleWidth;
        $scaleHeight;

        if ($imageWidth / $width < $imageHeight / $height) {
            $scaleWidth = $width;
            $scaleHeight = floor($width / $imageWidth * $imageHeight);
        } else {
            $scaleWidth  = floor($height / $imageHeight * $imageWidth);
            $scaleHeight = $height;
        }

        $x = ($scaleWidth  - $width)  / 2;
        $y = ($scaleHeight - $height) / 2;

        $inputImageRes = $inputImage->get();
        $im1 = $inputImage->createTargetImage($width, $height);
        $im2 = $inputImage->createTargetImage($scaleWidth, $scaleHeight);

        if (!$inputImageRes) {
            err("could not read image", "500 Internal Server Error", $width, $height);
        }
        if (!$im1) {
            err("could not create target image1", "500 Internal Server Error", $width, $height);
        }
        if (!$im2) {
            err("could not create target image2", "500 Internal Server Error", $width, $height);
        }

        @imagecopyresampled($im2, $inputImageRes, 0, 0, 0, 0, $scaleWidth, $scaleHeight, $imageWidth, $imageHeight);
        @imagecopyresampled($im1, $im2, 0, 0, $x, $y, $width, $height, $width, $height);
        @imagedestroy($im2);
        $inputImage->set($im1);
    }
}

class Center {
    function __construct() {}
    function Center() {}
    function exec($inputImage, $args, $donotenlarge) {
        $imageWidth = $inputImage->width();
        $imageHeight = $inputImage->height();

        list($width, $height, $color, $maxWidth, $maxHeight) = $args;

        if ($donotenlarge == true) {
            $width = min($inputImage->width(), $width);
            $height = min($inputImage->height(), $height);
        }

        $scale = 1;
        $color = hex2RGB($color);

        if ($maxWidth) {
            if ($maxHeight) {
                if ($maxWidth != 0 && $maxHeight != 0) {
                    if ($donotenlarge == true) {
                        $maxWidth = min($inputImage->width(), $maxWidth);
                        $maxHeight = min($inputImage->height(), $maxHeight);
                     }
                    $scale = getUniformScale($imageWidth, $imageHeight, $maxWidth, $maxHeight);
                } else if ($maxWidth != 0) {
                    $scale = $maxWidth / $imageWidth;
                } else if ($maxHeight != 0) {
                    $scale = $maxHeight / $imageHeight;
                }
            } else {
                $scale = $maxWidth;
                if ($donotenlarge == true) {
                    $scale = min($scale, 1);
                }
            }
        }

        // Calculate target position of image
        $x = floor(($width  - floor($scale * $imageWidth))  / 2);
        $y = floor(($height - floor($scale * $imageHeight)) / 2);

        // step 1: scale
        $inputImageRes;

        if ($scale != 1) {
            $newWidth = $imageWidth * $scale;
            $newHeight =$imageHeight * $scale;

            $inputImageRes = $inputImage->get();
            if (!$inputImageRes) {
                err("could not read image", "500 Internal Server Error", $width, $height);
            }
            $im2 = $inputImage->createTargetImage($newWidth, $newHeight);
            if (!$im2) {
                err("could not create target image", "500 Internal Server Error", $width, $height);
            }

            @imagecopyresampled($im2, $inputImageRes, 0, 0, 0, 0, $newWidth, $newHeight, $imageWidth, $imageHeight);
            $inputImage->destroy();

            // set values
            $inputImageRes = $im2;
            $imageWidth = $newWidth;
            $imageHeight = $newHeight;
        } else {
            $inputImageRes = $inputImage->get();
        }

        $im = $inputImage->createTargetImage($width, $height);
        imagefilledrectangle($im, 0, 0, $width, $height, imagecolorallocate($im, $color["red"], $color["green"], $color["blue"]));

        if (!$im) {
            err("could not create target image", "500 Internal Server Error", $width, $height);
        }

        @imagecopyresampled($im, $inputImageRes, $x, $y, 0, 0, $imageWidth, $imageHeight, $imageWidth, $imageHeight);
        $inputImage->set($im);
    }
}

class Equalize {
    function __construct() {}
    function Equalize() {}
    function exec($inputImage, $args, $donotenlarge) {
    }
}

class Crop {
    function __construct() {}
    function Crop() {}
    function exec($inputImage, $args, $donotenlarge) {
        $x; $y; $width; $height;
        $imageWidth  = $inputImage->width();
        $imageHeight = $inputImage->height();

        if (count($args) > 3) {
            list($x, $y, $width, $height) = $args;
        } else {
            list($width, $height) = $args;
            $x = ($imageWidth  - $width)  / 2;
            $y = ($imageHeight - $height) / 2;
        }

        $inputImageRes = $inputImage->get();
        if (!$inputImageRes) {
            err("could not read image", "500 Internal Server Error", $width, $height);
        }
        $im = $inputImage->createTargetImage($width, $height);
        if (!$im) {
            err("could not create target image", "500 Internal Server Error", $width, $height);
        }

        @imagecopyresampled($im, $inputImageRes, 0, 0, $x, $y, $imageWidth, $imageHeight, $imageWidth, $imageHeight);
        $inputImage->set($im);
    }
}

class Rotate {
    function __construct() {}
    function Rotate() {}
    function exec($inputImage, $args, $donotenlarge) {
        list($angle) = $args;

        $inputImageRes = $inputImage->get();

        if (!$inputImageRes) {
            err("could not read image", "500 Internal Server Error", $inputImage->width(), $inputImage->height());
        }

        //$im = imagerotate($inputImageRes, $angle, 0); not working in newer ubuntu/debian
        $im = rotateImage($inputImageRes, $angle, $inputImage);

        if (!$im) {
            err("currently only 90 degree steps are supported", "400 Bad Request", $inputImage->width(), $inputImage->height());
        }

        $inputImage->set($im);
    }
}

class Grayscale {
    function __construct() {}
    function Grayscale() {}
    function exec($inputImage, $args, $donotenlarge) {
        $inputImageRes = $inputImage->get();

        if (!$inputImageRes) {
            err("could not read image", "500 Internal Server Error", $inputImage->width(), $inputImage->height());
        }

        $im = grayscaleImage($inputImageRes, false, $inputImage);

        if (!$im) {
            err("could not create target image", "500 Internal Server Error", $inputImage->width(), $inputImage->height());
        }

        $inputImage->set($im);
    }
}

class Colorize {
    function __construct() {}
    function Colorize() {}
    function exec($inputImage, $args, $donotenlarge) {
        list($color) = $args;
        $color = hex2RGB($color);
        $inputImageRes = $inputImage->get();

        if (!$inputImageRes) {
            err("could not read image", "500 Internal Server Error", $inputImage->width(), $inputImage->height());
        }

        $im = colorize($inputImageRes, $color);

        if (!$im) {
            err("could not create target image", "500 Internal Server Error", $inputImage->width(), $inputImage->height());
        }

        $inputImage->set($im);
    }
}

if (!function_exists('imagecreatefrombmp')) { function imagecreatefrombmp($filename) {
	//open file for reading
	$fsize = @filesize($filename);
	if (!$fsize || $fsize >= $GLOBALS['config']['maxiprocfilesize'] || $fsize < 0) {
                error_log("imagecreatefrombmp: File [" . $filename . "] exceeds allowed filesize [" . $GLOBALS['config']['maxiprocfilesize'] . "] < [" . $fsize . "]");
                return false;
	}
	if (!($fh = fopen($filename, "rb"))) {
		error_log("imagecreatefrombmp: Can not open [" . $filename . "]");
		return false;
	}
	// read file header
	$meta = unpack('vtype/Vfilesize/Vreserved/Voffset', fread($fh, 14));
	// check for bitmap
	if ($meta['type'] != 19778) { //signature BM as integer
		error_log("imagecreatefrombmp: [" . $filename . "] is not a bitmap!");
		return false;
	}
	// read image header (DIB header)
	$meta += unpack('Vheadersize/Vwidth/Vheight/vplanes/vbits/Vcompression/Vimagesize/Vxres/Vyres/Vcolors/Vimportant', fread($fh, 40));

	if ($meta['width'] > $GLOBALS['config']["maxiprocimagesize"] || $meta['height'] > $GLOBALS['config']["maxiprocimagesize"] ) {
                error_log("imagecreatefrombmp: File [" . $filename . "] exceeds allowed imagesize [" . $GLOBALS['config']["maxiprocimagesize"] . "] < [" . $meta['width'] . "] || [" . $meta['height'] . "]");
                return false;
 	}
	// read additional 16bit header
	if ($meta['bits'] == 16) {
		$meta += unpack('VrMask/VgMask/VbMask', fread($fh, 12));
	}
	// set bytes and padding
	$meta['bytes'] = $meta['bits'] / 8;
	$meta['decal'] = 4 - (4 * (($meta['width'] * $meta['bytes'] / 4)- floor($meta['width'] * $meta['bytes'] / 4)));
	if ($meta['decal'] == 4) {
		$meta['decal'] = 0;
	}
	// obtain imagesize
	if ($meta['imagesize'] < 1) {
		$meta['imagesize'] = $meta['filesize'] - $meta['offset'];
		// in rare cases filesize is equal to offset so we need to read physical size
		if ($meta['imagesize'] < 1) {
			$meta['imagesize'] = @filesize($filename) - $meta['offset'];
			if ($meta['imagesize'] < 1) {
				error_log("imagecreatefrombmp: Can not obtain filesize of [" . $filename . "]!");
				return false;
			}
		}
	}
	// calculate colors
	$meta['colors'] = !$meta['colors'] ? pow(2, $meta['bits']) : $meta['colors'];
	// read color palette
	$palette = array();
	if ($meta['bits'] < 16) {
		$palette = unpack('l' . $meta['colors'], fread($fh, $meta['colors'] * 4));
		// in rare cases the color value is signed
		if ($palette[1] < 0) {
			foreach ($palette as $i => $color) {
				$palette[$i] = $color + 16777216;
			}
		}
	}
	// create gd image
	$im = imagecreatetruecolor($meta['width'], $meta['height']);
	$data = fread($fh, $meta['imagesize']);
	$p = 0;
	$vide = chr(0);
	$y = $meta['height'] - 1;
	$error = "imagecreatefrombmp: [" . $filename . "] has not enough data!";
	// loop through the image data beginning with the lower left corner
	while ($y >= 0) {
		$x = 0;
		while ($x < $meta['width']) {
			switch ($meta['bits']) {
				case 32:
				case 24:
					if (!($part = substr($data, $p, 3))) {
						error_log($error);
						return $im;
					}
					$color = unpack('V', $part . $vide);
					break;
				case 16:
					if (!($part = substr($data, $p, 2))) {
						error_log($error);
						return $im;
					}
					$color = unpack('v', $part);
					$color[1] = (($color[1] & 0xf800) >> 8) * 65536 + (($color[1] & 0x07e0) >> 3) * 256 + (($color[1] & 0x001f) << 3);
					break;
				case 8:
					$color = unpack('n', $vide . substr($data, $p, 1));
					$color[1] = $palette[ $color[1] + 1 ];
					break;
				case 4:
					$color = unpack('n', $vide . substr($data, floor($p), 1));
					$color[1] = ($p * 2) % 2 == 0 ? $color[1] >> 4 : $color[1] & 0x0F;
					$color[1] = $palette[ $color[1] + 1 ];
					break;
				case 1:
					$color = unpack('n', $vide . substr($data, floor($p), 1));
					switch (($p * 8) % 8) {
						case 0:
							$color[1] = $color[1] >> 7;
							break;
						case 1:
							$color[1] = ($color[1] & 0x40) >> 6;
							break;
						case 2:
							$color[1] = ($color[1] & 0x20) >> 5;
							break;
						case 3:
							$color[1] = ($color[1] & 0x10) >> 4;
							break;
						case 4:
							$color[1] = ($color[1] & 0x8) >> 3;
							break;
						case 5:
							$color[1] = ($color[1] & 0x4) >> 2;
							break;
						case 6:
							$color[1] = ($color[1] & 0x2) >> 1;
							break;
						case 7:
							$color[1] = ($color[1] & 0x1);
							break;
					}
					$color[1] = $palette[ $color[1] + 1 ];
					break;
				default:
					error_log("imagecreatefrombmp: [" . $filename . "] has [" . $meta['bits'] . "] bits, this is not supported!");
					return false;
			}
			imagesetpixel($im, $x, $y, $color[1]);
			$x++;
			$p += $meta['bytes'];
		}
		$y--;
		$p += $meta['decal'];
	}
	fclose($fh);
	return $im;
}}
