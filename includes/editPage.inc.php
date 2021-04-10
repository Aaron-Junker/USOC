<?php
  /**
  * File with function editPage()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function edits an existing content page
  * @see U For more informations about U.
  * @version Pb2.4Bfx0
  * @since Pb2.4Bfx0
  * @param string $content Name of the content
  * @param string $name Name of the content page
  * @param string $code The code of the to saved content
  * @param int $online 1 if the content page is online. 0 if not
  * @return bool True if succeeded, False if not
  */
  function editPage(string $content, string $name, string $code, int $online):bool{
    global $U, $USOC;
    // Checks if the content page exists
    if($U->contentHandlers[$content]){
      $sql = "SELECT * FROM ". $U->contentHandlers[$content]["Name"] . " WHERE name='" . strtolower($name) . "';";
      if(mysqli_num_rows(mysqli_query($U->db_link, $sql)) != 1){
        return False;
      }
      $sql = "UPDATE " . $U->contentHandlers[$content]["Name"] . " SET Code='" . addslashes($code) . "', Online='" . $online . "' WHERE Name='" . $name . "';";
      $dbRes = mysqli_query($U->db_link, $sql);
      $sql = "SELECT * FROM ". $U->contentHandlers[$content]["Name"] . " WHERE name='" . $name . "';";
      $dbRes2 = mysqli_query($U->db_link, $sql);
      if($row = mysqli_fetch_array($dbRes2, MYSQLI_ASSOC)){
        $id = $row["ID"];
      }
      if($U->contentHandlers[$content]["EditHandler"]($id, ["Name" => $name, "Code" => $code, "Author" => $authorID, "Date" => $date, "Online" => $online, "Id" => $id]) === False){
        // Deletes the page if the EditHandler function returns false
        $sql = "DELETE FROM ". $U->contentHandlers[$content]["Name"] . " WHERE name='" . $name . "';";
        mysqli_query($U->db_link, $sql);
        return False;
      }
      return $dbRes;
    }else{
      return False;
    }
  }
?>
