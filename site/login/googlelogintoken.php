<?php
  session_start();
  include_once "../configuration.php";
  include_once "../includes/class.inc.php";
  require_once '../vendor/autoload.php';
  newClass();
  $login = False;
  if(file_exists("client_string.json")){
    if(isset($_POST["token"])){
      $client = new Google\Client();
      $client->setAuthConfigFile('client_string.JSON');
      $token_data = $client->verifyIdToken($_POST["token"]);
      $user_id = $token_data['sub'];
      if(!isset($_SESSION["User_ID"])){
        $sql = "SELECT * FROM User";
        $db_erg = mysqli_query($U->db_link, $sql);
        while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
          if($row["google_token"]==$user_id){
            $login = True;
            $user_id = $row["Id"];
            $user_name = $row["Username"];
            if($row["Type"] == 1){
              $_SESSION["Admin"] = True;
            }
          }
        }
      }else{
        echo $U->getLang("login.already_logged_in")."<br>";
      }
    }else{
      echo $U->getLang("login.form_error")."<br>";
    }
    if($U->getSetting("login.login_open")=="0"){
      echo $U->getLang("login.login_closed")."<br>";
      $login = False;
    }
    if($login == True){
      echo $U->getLang("login.succeed");
      $_SESSION['User_ID'] = md5($user_id);
      $_SESSION['User_Name'] = $user_name;
      header('Location: '. $USOC["DOMAIN"]);
    }else {
      echo $U->getLang("login.fail");
    }
  }else{
    echo $U->getLang("login.oAuth.error_fail");
  }
?>
