<?php
  /**
  * File with function getLang()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function gets a string from the localisation files. It uses the default language.
  * When it can't find the string in the default language it searches the string in en-en
  * @see U For more informations about U.
  * @version Pb2.0Bfx0
  * @since Pb2.0Bfx0RCA
  * @param string $string The name of the string. (For example: login.name)
  * @return string The translated string
  */
  function getLang(string $string):string{
    global $U;
    global $USOC;
    $translate = json_decode(file_get_contents($USOC["DOMAIN"]."/lang/".$U->getSetting("site.lang").".json"));
    if(isset($translate->{$string}) && $translate->{$string} != ""){
      return $translate->{$string};
    }else{
      $translate = json_decode(file_get_contents($USOC["DOMAIN"]."/lang/en-en.json"));
      return $translate->{$string};
      throw new Exception("Couldn't find string: " + $string);
    }
  }
?>
   