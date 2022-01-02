<?php

namespace USOC\Plugin;

abstract class Plugin
{
    private static $Name;
    private static $Version;
    private static $DisplayName;
    private static $PackageVersion;

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

abstract class ContentPlugin extends Plugin
{
    private static $PackageVersion;
    public function getPackageVersion()
    {
        return self::$PackageVersion;
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