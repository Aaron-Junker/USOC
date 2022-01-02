<?php

namespace USOC\errorPage;

include_once IP . '/includes/Page.inc.php';
include_once IP.'/includes/functions/getLang.inc.php';

use Exception;
use USOC\Page\Page;
use function USOC\getLang;

class errorPage extends Page
{
    /**
     * @param httpErrors $httpError
     * @return string
     * @throws Exception
     */
    public static function getErrorPage(httpErrors $httpError): string
    {
        return Parent::getHtmlTemplate("Page/ErrorPage", getLang("errors.".$httpError->value), "/", str_replace("%d", getLang("page.mainpage"), getLang("errors.mainpage")));
    }
}

/**
 * Enum with some http errors
 */
enum httpErrors: int
{
    case NOT_FOUND = 404;
    case INTERNAL_SERVER_ERROR = 500;
    case BAD_REQUEST = 400;
    case FORBIDDEN = 403;
    case METHOD_NOT_ALLOWED = 405;
    case GONE = 410;
    case URI_TOO_LONG = 414;
    case I_AM_A_TEAPOT = 418;
    case LOCKED = 423;
}