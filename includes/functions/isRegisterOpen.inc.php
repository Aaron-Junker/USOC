<?php
    /**
    * File with function isRegisterOpen()
    * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
    */
    /**
    * This is a function for the class U.
    * This checks if the registration process can be accessed by the currently logged in person.
    * @see U For more informations about U.
    * @version Pb2.5Bfx0
    * @since Pb2.5Bfx0
    * @return bool True if registrarion is open, False if not
    */
    function isRegisterOpen():bool{
        global $U;
        if($U->getSetting("login.register_open")=="0"  || isset($_SESSION["User_ID"]) || $U->getSetting("login.login_open") == "0"){
          return False;
        }
        return True;
      }
?>