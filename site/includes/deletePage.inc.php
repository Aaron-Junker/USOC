<?php
  /**
  * File with function getSetting()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function deletes a page
  * @see U For more informations about U.
  * @version Pb2.3Bfx0
  * @since Pb2.3Bfx0
  * @param string $table The name of the table where the page is stored. Default values: "Sites", "Blog"
  * @param string $name 
  * @return bool True if succeeded, false if not
  */
  function deletePage(string $table, string $name){
    global $U, $USOC;
    // Checks if the page is index
    if($table=="Sites"&&$name=="index"){
      return false;
    }
    $sql = "DELETE FROM ".$table." WHERE Name='".$name."'";
    return mysqli_query($U->db_link, $sql);
  }
?>
