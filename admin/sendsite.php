<?php
  session_start();
  require_once "configuration.php";
  require_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newclass();
  $logina = 0;
  $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
  $db_erg = mysqli_query($U->db_link, $sql);
  while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
    if (md5($row["Id"]) == $_SESSION["User_ID"] && $row["Type"] == 1){
      $logina = 1;
      $user_id = $row["Id"];
    }
  }
  /**
  * True if the contentpage was already created. False if not.
  */
  $edit = False;
  if(isset($_POST["edit"])){
    $edit = True;
  }
  if(isset($_POST["N"])&&isset($_POST["Type"])&&isset($_POST["C"])&&$logina==1&&(!$edit)){
    $U->addPage($_POST["Type"],$_POST["N"],htmlspecialchars($_POST["C"]),$user_id,date("Y-m-d"),$_POST["online"]);
    header("Location: ".$USOC["DOMAIN"].$U->contentHandlers[$_POST["Type"]]["URL"].$_POST["N"]);
  }
  if(isset($_POST["N"])&&isset($_POST["Type"])&&isset($_POST["C"])&&$logina==1&&$edit){
    $U->editPage($_POST["Type"],$_POST["N"],htmlspecialchars($_POST["C"]),$_POST["online"]);
    header("Location: ".$USOC["DOMAIN"].$U->contentHandlers[$_POST["Type"]]["URL"].$_POST["N"]);
  }
?>