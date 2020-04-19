<?php
include "../phpapi/getdomain.php";
include "../phpapi/getsettings.php";
require_once 'google-api-php-client/src/Google/autoload.php';

session_start();
$login = False;
if(isset($_POST["token"])){
  $client = new Google_Client(['client_id' => "756607949092-ruurljso4jm5nqlntni2llfc4g625pl5.apps.googleusercontent.com"]);  // Specify the CLIENT_ID of the app that accesses the backend
  $client->setAuthConfigFile('client_string.JSON');
$token_data = $client->verifyIdToken($_POST["token"])->getAttributes();
$user_id = $token_data['payload']['sub'];

  if(!isset($_SESSION["User_ID"])){
    require_once ('konfiguration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
    $sql = "SELECT * FROM User";
    $db_erg = mysqli_query( $db_link, $sql );
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
    echo "Bereits eingeloggt<br>";
  }
}else{
  echo "Formularfehler!<br>";
}
if(getSetting("login.login_open")=="0"){
  echo "Login geschlossen<br>";
  $login = False;
}
if($login == True){
  echo "login geglückt";
  $_SESSION['User_ID'] = md5($user_id);
  $_SESSION['User_Name'] = $user_name;
  header('Location: '.getDomain());
}else {
  echo "login fehlgeschlagen";
}
echo $_POST["token"];
?>
