<?php
  session_start();
  require_once "configuration.php";
  require_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newclass();
  $logina = 0;
  $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
  $db_erg = mysqli_query($U->db_link, $sql);
  while ($row = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
  {
    if (md5($row["Id"]) == $_SESSION["User_ID"] && $row["Type"] == 1){
      $logina = 1;
    }
  }
  $edit = False;
  if(isset($_POST["edit"])){
    $edit = True;
  }
  if(isset($_POST["N"])&&isset($_POST["C"])&&$logina==1&&(!$edit)){
    // date("Y-m-d")
    $sql = "INSERT INTO Sites (Name, Code, Author, Date, Online) VALUES ('".$_POST["N"]."','".addslashes($_POST["C"])."','".$_SESSION["User_Name"]."','".date("Y-m-d")."','".$_POST["online"]."');";
    $db_erg = mysqli_query($U->db_link, $sql);
    header("Location: /".$_POST["N"]);
  }
  if(isset($_POST["N"])&&isset($_POST["C"])&&$logina==1&&$edit){
    $sql = "UPDATE Sites SET Code='".addslashes($_POST["C"])."', Online='".$_POST["online"]."' WHERE Name='".$_POST["N"]."';";
    $db_erg = mysqli_query($U->db_link, $sql);
    header("Location: ".$USOC["DOMAIN"]."/page.php?URL=".$_POST["N"]);
  }
?>
