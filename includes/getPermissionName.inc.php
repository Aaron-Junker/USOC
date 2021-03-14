<?php
  /**
  * File with function getPermissionName()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function gets the name for a specific permission level or an array
  * @see U For more informations about U.
  * @version Pb2.5Bfx0
  * @since Pb2.05Bfx0
  * @param string $level The permission level or -1 for an array with all names
  * @return mixed The permission level name or an array with all names
  */
  function getPermissionName($level):mixed{
    global $USOC;
    global $U;
    if($level == -1){
      $returnValue = array();
      foreach($USOC["userRights"] as $key => $value){
        if(is_array($value)){
          $returnValue[$key] = $value["Name"];
        }
      }
      return $returnValue;
    }else{
      return $USOC["userRights"][$level]["Name"];
    }
  }
?>
