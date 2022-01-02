<?php

namespace USOC\Plugin;

/**
 * @property $Name
 */
abstract class Plugin
{
    private static $Name;
    private static $Version;
    private static $DisplayName;

    public function getName()
    {
        return self::$Name;
    }

    public function getVersion()
    {
        return self::$Version;
    }

    public function getDisplayName()
    {
        return self::$DisplayName;
    }
}

class PagePlugin extends Plugin
{
    public static $Name = 'PagePlugin';

    public function __construct()
    {
        self::$Version = '1.0';
    }
}