<?php
  session_start();
  include_once "../configuration.php";
  include_once "../includes/class.inc.php";
  $U = new U();
  if(isset($_POST["oldpass"])&&isset($_POST["newpass1"])&&isset($_POST["newpass2"])&&isset($_SESSION['User_Name'])){
    if($_POST["newpass1"]==$_POST["newpass2"]&&preg_match('/^[a-z0-9A-Z.:,;]{8,25}$/',$_POST["newpass1"])){
      $passc = False;
      $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
      $sql = "SELECT * FROM User WHERE Username='".$_SESSION['User_Name']."';";
      $db_erg = mysqli_query( $db_link, $sql );
      while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
        {
          if(md5($zeile["Id"]) == $_SESSION['User_ID']&&$zeile["Password"]==password_hash($_POST["oldpass"],PASSWORD_DEFAULT,["salt"=>$U->getSetting("login.salt")])){
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
  echo $passc;
  if($passc){
    $sql = "UPDATE User SET password='".password_hash($_POST["oldpass"],PASSWORD_DEFAULT,["salt"=>$U->getSetting("login.salt")])."' WHERE Id='".$_SESSION['User_ID']."';";
    echo $sql;
    $db_erg = mysqli_query( $db_link, $sql );
  }
?>
