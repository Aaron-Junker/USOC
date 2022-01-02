<?php

/**
 * This namespace contains the Page class
 * @see USOC\Page\Page
 */
Namespace USOC\Page;

include_once IP.'/configuration.php';
include_once IP.'/includes/Database.inc.php';
include_once IP.'/includes/Exceptions.php';
include_once IP.'/includes/Style.inc.php';
include_once IP.'/includes/errorPage.inc.php';
include_once IP.'/includes/functions/getLang.inc.php';
include_once IP.'/includes/functions/getSetting.inc.php';

use Exception;
use USOC\Database\Database;
use USOC\errorPage\errorPage;
use USOC\errorPage\httpErrors;
use USOC\Url\Url;
use USOC\Style\Style;
use function USOC\getLang;
use function USOC\getSetting;

/**
 * This class contains functions to display pages
 */
class Page
{
    public static function displayPage(string $page): string
    {
        Url::handleSpecialParameters();
        if(!USOC_PAGE_RAW)
        {
            $head = self::getHtmlTemplate("Page/Head",
                getLang("lang.charset"),
                getSetting("site.name"),
                Style::getCurrentStyleFileName(),
                "/",
                getSetting("site.author"),
                getSetting("site.description"),
                getSetting("site.keywords"),
                getSetting("site.lang"),
                getSetting("site.robots"));
            $header = self::getHtmlTemplate("Page/Header",
                "/",
                getLang("accessibility.skipnavigation"),
                "/",
                "",
                getSetting("site.name"));
            $footer = self::getHtmlTemplate("Page/Footer",
                Style::getCurrentStyle()=="l"?"d":"l",
                Style::getCurrentStyle()=="l"?
                    getLang("style.darkmode"):
                    getLang("style.lightmode"));
            $page = self::getHtmlTemplate("Page/Page",
                getSetting("site.lang"),
                $head,
                $header,
                $page,
                $footer);
        }
        return $page;
    }
    /**
     * @throws Exception
     */
    public static function getPageFromUrl(string $url, bool $replaceStrings = true): string
    {
        if(self::isIndexPage($url)){
            return self::getIndexPage();
        }else{
            $contentHandler = self::getContentHandlerFromUrl($url);
            if(!$contentHandler)
            {
                define("USOC_PAGE_FOUND", false);
                return errorPage::getErrorPage(httpErrors::NOT_FOUND);
            }
            if($replaceStrings) {
                self::replacePlaceholders($page);
            }
            return self::getPage($contentHandler, $url);
        }
    }

    public static function getContentHandlerFromUrl(string &$url): string|false
    {
        foreach(USOC["ContentHandlers"] as $mainKey => $mainValue){
            foreach($mainValue as $key => $value){
                if($key == "URL" && preg_split("/[^\/]+$/", $url)[0] == $value){
                    $url = str_replace($value, "", $url);
                    return $mainKey;
                }
            }
        }
        return false;
    }

    public static function isIndexPage(string $url): string
    {
        return in_array(strtolower($url), USOC["indexUrls"]);
    }

    /**
     * @throws Exception
     */
    public static function getIndexPage(): string
    {
        return self::getPage(USOC["indexPage"]["Plugin"], USOC["indexPage"]["Name"]);
    }

    /**
     * @throws Exception
     */
    public static function getPage($plugin, $name): string
    {
        $sql = 'SELECT * FROM '.USOC["ContentHandlers"]["$plugin"]["Name"]." WHERE Name='$name'";
        $dbRes = Database::query($sql);
        while ($row = Database::getRows($dbRes)) {
            $pageCode = htmlspecialchars_decode($row["Code"]);
        }
        if(isset($pageCode)){
            define("USOC_PAGE_FOUND", true);
            return USOC["ContentHandlers"]["$plugin"]["ShowHandler"]($pageCode,"");
        }else{
            define("USOC_PAGE_FOUND", false);
            return errorPage::getErrorPage(httpErrors::NOT_FOUND);
        }
    }

    public static function getHtmlTemplate(string $templateName, string ...$strings): string
    {
        $template = file_get_contents(IP."/includes/HTML/".$templateName.".html");
        $i = 1;
        foreach ($strings as $string) {
            $template = str_replace("%$i", $string, $template);
            $i++;
        }
        return $template;
    }

    public static function replacePlaceholders(string|null &$site): void
    {
        if(!is_null($site)) {
            if (USOC_PAGE_AMP) {
                $site = str_replace("%img src=", "<amp-iframe onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+\"px\";}(this));' style=\"height:200px;width:100%;border:none;overflow:hidden;\" src=\"", $site);
                $site = str_replace(" img%", "\" ></amp-iframe>", $site);
            } else {
                $site = str_replace("%img src=", "<iframe onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+\"px\";}(this));' style=\"height:200px;width:100%;border:none;overflow:hidden;\" src=\"", $site);
                $site = str_replace(" img%", "\" ></iframe>", $site);
            }
            $site = str_replace("%\img src=", "%img src=", $site);
            $site = str_replace(" img\%", 'img%', $site);
            $site = str_replace('%\\img src=', '\%img src=', $site);
            $site = str_replace(' img\\%', 'img\%', $site);
        }
    }
}

