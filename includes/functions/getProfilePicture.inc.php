<?php
  /**
  * File with function getProfilePicture()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function gets a value from the "settings" database.
  * @see U For more informations about U.
  * @version Pb2.0Bfx0
  * @since Pb2.0Bfx0RCA
  * @param string $name The name of the setting. (For example: login.name)
  * @return string The value from the database.
  */
  function getProfilePicture($Username):string{
    global $USOC;
    global $U;
    $sql = "SELECT * FROM User WHERE Username='".$Username."'";
    $dbRes = mysqli_query($U->db_link, $sql);
    while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
      $mail = $row["Mail"];
    }
    $code = md5(strtolower(trim($mail)));
    return "<img src='https://www.gravatar.com/avatar/".$code."' />";
  }
?>
