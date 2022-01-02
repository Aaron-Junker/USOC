<?php

namespace USOC\Url;

class Url
{
    public static function getPageUrl(): string
    {
        $_SERVER["REQUEST_URI"] = parse_url($_SERVER["REQUEST_URI"])["path"];
        self::handleSpecialParameters();
        return $_SERVER["REQUEST_URI"];
    }

    public static function handleSpecialParameters(): void
    {
        if(!defined("USOC_PAGE_RAW") && !defined("USOC_PAGE_AMP")) {
            if (self::isRawParameterSet()) {
                define("USOC_PAGE_RAW", True);
                $_SERVER["REQUEST_URI"] = str_replace("/raw", "", $_SERVER["REQUEST_URI"]);
            } else {
                define("USOC_PAGE_RAW", False);
            }
            if (self::isAmpParameterSet()) {
                define("USOC_PAGE_AMP", True);
                $_SERVER["REQUEST_URI"] = str_replace("/amp", "", $_SERVER["REQUEST_URI"]);
            } else {
                define("USOC_PAGE_AMP", False);
            }
        }
    }

    public static function isRawParameterSet(): bool
    {
        return str_starts_with($_SERVER["REQUEST_URI"], USOC["RAW_URL"]);
    }

    public static function isAmpParameterSet(): bool
    {
        return str_starts_with($_SERVER["REQUEST_URI"], USOC["AMP_URL"]);
    }
}