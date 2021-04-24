<?php
  /**
  * File with function deleteUser()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function deletes a user
  * @see U For more informations about U.
  * @version Pb2.5Bfx0
  * @since Pb2.5Bfx0
  * @param int $Id Id of the user
  * @return bool True if succeeded, False if not
  */
  function deleteUser(string $Id):bool{
    global $U, $USOC;
    if($U->userHasPermission("Profile", "Delete_account")){
        $sql = "DELETE FROM User WHERE Id='" . $Id . "';";
        return mysqli_query($U->db_link, $sql);
    }else{
        return False;
    }
  }
?>
