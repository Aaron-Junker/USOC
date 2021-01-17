<?php
  /**
  * File with function getSetting()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function adds a content page
  * @see U For more informations about U.
  * @version Pb2.4Bfx0
  * @since Pb2.4Bfx0
  * @param string $content Name of the content
  * @param string $name Name of the content page
  * @param string $code The code of the to saved content
  * @param int $authorID Id of the author
  * @param string $date Date of creation
  * @param int $online 1 if the content page is online. 0 if not
  * @return bool True if succeeded, False if not
  */
  function addPage(string $content, string $name, string $code, int $authorID, string $date, int $online):bool{
    global $U, $USOC;
    if($U->contentHandlers[$content]){
      // Checks if the name already exists
      $sql = "SELECT * FROM ". $U->contentHandlers[$content]["Name"] . " WHERE name='" . strtolower($name) . "';";
      if(mysqli_num_rows(mysqli_query($U->db_link, $sql)) > 0){
        return False;
      }
      $sql = "INSERT INTO " . $U->contentHandlers[$content]["Name"] . " (Name, Code, Author, Date, Online) VALUES ('" . $name . "','" . addslashes($code) . "','" . $authorID . "','" . $date . "','" . $online . "');";
      $db_erg = mysqli_query($U->db_link, $sql);
      $sql = "SELECT * FROM ". $U->contentHandlers[$content]["Name"] . " WHERE name='" . $name . "';";
      $db_erg2 = mysqli_query($U->db_link, $sql);
      if($row = mysqli_fetch_array($db_erg2, MYSQLI_ASSOC)){
        $id = $row["ID"];
      }
      if($U->contentHandlers[$content]["AddHandler"]($id, ["Name" => $name, "Code" => $code, "Author" => $authorID, "Date" => $date, "Online" => $online, "Id" => $id]) === False){
        // Deletes the page if the AddHandler function returns false
        $sql = "DELETE FROM ". $U->contentHandlers[$content]["Name"] . " WHERE name='" . $name . "';";
        mysqli_query($U->db_link, $sql);
        return False;
      }
      return $db_erg;
    }else{
      return False;
    }
  }
?>
