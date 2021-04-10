<?php
  /**
  * File with function userHasPermission()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function checks if the current user has the permission for a operation
  * @see U For more informations about U.
  * @version Pb2.5Bfx0
  * @since Pb2.5Bfx0
  * @param string $module Module of the permission
  * @param string $submodule Submodule of the permission
  * @param string $subsubmodule Subsubmodule of the permission
  * @param string $debug Shows debug information
  * @return bool True or False
  */
  function userHasPermission(string $module, string $submodule = "", string $subsubmodule = "", bool $debug = False):bool{
    global $U, $USOC;
    $permissionLevel = 0;
    $userRights = $USOC["userRights"];
    if(isset($_SESSION["User_ID"])){
      $sql = "SELECT * FROM user;";
      $dbRes = mysqli_query($U->db_link, $sql);
      while($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
        if(md5($row["Id"]) == $_SESSION["User_ID"]){
          $permissionLevel = $row["Type"];
        }
      }
    }
    if($debug){
      echo "<br>Module: ".$module."->".$submodule."->".$subsubmodule."<br>pL: ".$permissionLevel."<br>Result:".$USOC["userRights"][$permissionLevel][$module][$submodule][$subsubmodule]."<br>";
    }
    if($USOC["userRights"][$permissionLevel][$module][$submodule][$subsubmodule] == 1){
      return True;
    }
    return False;
  }
?>
