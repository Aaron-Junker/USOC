<?php
  /**
  * File with function getErrorSite()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function return the code for the Error Page with error $error
  * When it can't find the string in the default language it searches the string in en-en
  * @see U For more informations about U.
  * @version Pb2.0Bfx0
  * @since Pb2.0Bfx0RCA
  * @param string $error String with the error (example: "404")
  * @return string The code
  */
  function getErrorSite($error){
    global $U;
    $code = "<h1>".$U->getLang("errors.".$error)."</h1><a href='/index.php'>".str_replace("%d",$U->getLang("page.mainpage"),$U->getLang("errors.mainpage"))."</a>";
    return $code;
  }
?>
