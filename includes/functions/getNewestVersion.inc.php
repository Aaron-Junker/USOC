<?php
    /**
    * File with function getNewestVersion()
    * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
    */
    /**
    * This is a function for the class U.
    * This function tests for the newest version in the current release channel
    * @see U For more informations about U.
    * @version Pb2.4Bfx0
    * @since Pb2.4Bfx0
    * @return array Information about the newest version
    */
    function getNewestVersion():array{
        global $U;
        global $USOC;
        error_reporting(E_ERROR | E_PARSE);
        try{
            $context = stream_context_create(["http" => ["method" => "GET","header" => "Accept: application/vnd.github.v3+json\r\nUser-Agent: USOC/".$U->version."/".($U->modded ? "modded":"unmodded")."/Case_Games\r\n"]]);
            $json = json_decode(file_get_contents("https://api.github.com/repos/case-games/USOC/releases", false, $context));
            $newestVersion = $json[0];
            if(isset($newestVersion->tag_name)){
                return ["Name" => $newestVersion->tag_name, "Code" => $U->versionNameToCode($newestVersion->tag_name), "URL" => $newestVersion->html_url];
            }else{
                return ["Name" => False, "Code" => False, "URL" => False];
            }
        }catch(Exception $e){
            return ["Name" => False, "Code" => False, "URL" => False];
        }
    }
?>