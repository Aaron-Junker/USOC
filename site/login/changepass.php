<?php
  session_start();
  include_once "../configuration.php";
  include_once "../includes/class.inc.php";
  newClass();
  $passc = False;
  if(isset($_POST["oldpass"])&&isset($_POST["newpass1"])&&isset($_POST["newpass2"])&&isset($_SESSION['User_Name'])){
    if($_POST["newpass1"]==$_POST["newpass2"]&&preg_match('/^[a-z0-9A-Z.:,;]{8,25}$/',$_POST["newpass1"])){
      $passc = False;
      $sql = "SELECT * FROM User WHERE Username='".$_SESSION['User_Name']."';";
      $db_erg = mysqli_query( $U->db_link, $sql );
      while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
        {
          if(md5($zeile["Id"]) == $_SESSION['User_ID']&&password_verify($_POST["oldpass"],$zeile["Password"])){
            $passc = True;
          }
        }
    }else{
      echo $U->getLang("login.changepass.twopassword");
    }
  }else{
    echo $U->getLang("login.changepass.not_filled");
  }
  if($U->getSetting("login.changepassword") == 0){
    $passc = False;
    echo $U->getLang("login.changepass.fail");
  }
  if($passc){
    $sql = "UPDATE User SET password='".password_hash($_POST["newpass1"],PASSWORD_DEFAULT)."' WHERE Username='".$_SESSION['User_Name']."';";
    echo $sql;
    $db_erg = mysqli_query($U->db_link, $sql);
  }else{
    header("Location: ".$USOC["DOMAIN"]."/error");
  }
?>
