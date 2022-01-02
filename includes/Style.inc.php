<?php

namespace USOC\Style;

include_once IP.'/includes/functions/getSetting.inc.php';

use function USOC\getSetting;

class Style{
    public static function getCurrentStyleFileName(): string
    {
        return "/styles/".(self::getCurrentStyle()=="l"?getSetting("style.light.filename"):getSetting("style.dark.filename"));
    }
    public static function getCurrentStyle(): string
    {
        if(!isset($_COOKIE["css"])){
            return "l";
        }
        if($_COOKIE["css"] == "l"){
            return "l";
        } elseif($_COOKIE["css"] == "d"){
            return "d";
        } else {
            return "l";
        }
    }
}