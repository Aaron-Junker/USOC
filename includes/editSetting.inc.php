<?php
  /**
  * File with function getSetting()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function edits a settig from the "settings" table
  * @see U For more informations about U.
  * @version Pb2.4Bfx0
  * @since Pb2.4Bfx0
  * @param string $name The name of the setting
  * @param string $value The new value of the setting
  * @return bool True if succeeded, False if not
  */
  function editSetting(string $name, string $value):bool{
    global $U, $USOC;
    $sql = "UPDATE settings SET Value='".$value."' WHERE Name='".$name."';";
    return mysqli_query($U->db_link, $sql);
  }
?>
