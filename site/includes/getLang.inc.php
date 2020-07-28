<?php
  public function getLang($string){
    //Gets a string from the translation files
    $translate = json_decode(file_get_contents($USOC["SITE_PATH"]."lang/".getSetting("site.lang").".json",true));
    try {
      return $translate[$string];
    } catch (Exception $e) {
      $translate = json_decode(file_get_contents($USOC["SITE_PATH"]."lang/en-en.json",true));
      return $translate[$string];
    }
  }
?>
