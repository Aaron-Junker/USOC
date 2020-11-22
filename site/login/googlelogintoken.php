<?php
  session_start();
  include_once "../configuration.php";
  include_once "../includes/class.inc.php";
  require_once 'google-api-php-client/src/Google/autoload.php';
  newClass();
  $login = False;
  if(file_exists("client_string.json")){
    if(isset($_POST["token"])){
      $client = new Google_Client(['client_id' => $U->getSetting("oAuth.google.client_id").".apps.googleusercontent.com"]);
      $client->setAuthConfigFile('client_string.JSON');
      $token_data = $client->verifyIdToken($_POST["token"])->getAttributes();
      $user_id = $token_data['payload']['sub'];
      if(!isset($_SESSION["User_ID"])){
        $sql = "SELECT * FROM User";
        $db_erg = mysqli_query( $U->db_link, $sql );
        while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
        {
          if($zeile["google_token"]==$user_id){
            $login = True;
            $user_id = $zeile["Id"];
            $user_name = $zeile["Username"];
            if($zeile["Type"] == 1){
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
      header('Location: '. $USOC["Domain"]);
    }else {
      echo $U->getLang("login.fail");
    }
    echo $_POST["token"];
  }else{
    echo $U->getLang("login.oAuth.error_fail");
  }
?>
