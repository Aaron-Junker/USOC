<?php
  session_start();
  include_once "../configuration.php";
  include_once "../includes/class.inc.php";
  newClass();
  require_once '../vendor/autoload.php';
  $change = False;
  if(file_exists("client_string.json")){
    if(isset($_POST["token"])){
      $client = new Google\Client();
      $client->setAuthConfigFile('client_string.JSON');
      $token_data = $client->verifyIdToken($_POST["token"]); 
      $user_id = $token_data['sub'];
      if(isset($_SESSION["User_ID"])){
        $sql = "SELECT * FROM User WHERE Username='".mysqli_real_escape_string($U->db_link,$_SESSION["User_Name"])."'";
        $db_erg = mysqli_query($U->db_link, $sql);
        while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
          if(md5($row["Id"])==$_SESSION["User_ID"]){
            if($row["google_token"] == ""){
              $change = True;
            }else{
              echo str_replace("%a",$U->getLang("login.oAuth.google"),$U->getLang("login.oAuth.fail"));
            }
          }else{
            echo $U->getLang("login.oAuth.error_fail");
          }
        }
        if($change){
          $sql = "UPDATE User SET google_token='".mysqli_real_escape_string($U->db_link,$user_id)."' WHERE Username='".mysqli_real_escape_string($U->db_link,$_SESSION["User_Name"])."';";
          mysqli_query($U->db_link, $sql);
          header("Location: ../index.php");
        }
      }else{
      echo $U->getLang("login.not_logged_in");
      }
    }else{
      echo $U->getLang("login.oAuth.error_fail");
    }
  }
?>
