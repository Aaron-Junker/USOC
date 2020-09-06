<?php
  /**
  * File with function getSetting()
  * @licence https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source licence
  */
  /**
  * This is a function for the class U.
  * This function gets a value from the "settings" database.
  * @see U For more informations about U.
  * @version Pb2.0Bfx0
  * @since Pb2.0Bfx0
  * @param string $name The name of the setting. (For example: login.name)
  * @return mixed The value from the database.
  */
  function getSetting($name){
    $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
    $sql = "SELECT * FROM Settings WHERE Name='".$name."'";
    $db_erg = mysqli_query( $db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
      return $zeile["Value"];
    }
  }
?>
