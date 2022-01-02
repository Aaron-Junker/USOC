<?php
/**
* File with function getLang()
* @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
*/
/**
 * This is a function for the class U.
 * This function gets a string from the localisation files. It uses the default language.
 * When it can't find the string in the default language it searches the string in en-en.
 * @param string $string The name of the string. (For example: login.name)
 * @return string The translated string
 * @throws Exception
 * @since Pb2.0Bfx0RCA
 * @version Pb2.0Bfx0
 */
namespace USOC;
include_once IP.'/configuration.php';
include_once IP.'/includes/functions/getSetting.inc.php';
function getLang(string $string): string
{
    $translate = json_decode(file_get_contents(IP."/lang/".getSetting("site.lang").".json"));
    if(!isset($translate->{$string}) || $translate->{$string} == "") {
        $translate = json_decode(file_get_contents(IP."/lang/en-en.json"));
    }
    return $translate->{$string};
}