<?php
  include "phpapi/getdomain.php";
  include "phpapi/getsettings.php";
  session_start();
    $login = False;
    require_once ('konfiguration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
    $sql = "SELECT * FROM User";
    $db_erg = mysqli_query( $db_link, $sql );
    if(isset($_SESSION["code"])){
      $_POST["B"] = $_SESSION['temp_User_Name'];
    }
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
    {

      if((strtolower($_POST["B"])==strtolower($zeile["Username"])||strtolower($_POST["B"])==strtolower($zeile["Mail"]))&&(password_hash($_POST["P"],PASSWORD_DEFAULT,["salt"=>"\@]FBGsU,P?eFbHb)!'uaIt95JYhlH%TrRf+rZt|/~0T){%DjBasjhklozu"])==$zeile["Password"]||isset($_SESSION["code"])) ){

        $login = True;
        $user_id = $zeile["Id"];
        $user_name = $zeile["Username"];
        if($zeile["Type"] == 1){
          $_SESSION["Admin"] = True;
        }
        if($zeile["google_2fa"] != ""){
          $fa = True;
        }
      }
    }
    if(getSetting("login.login_open")=="0"){
      echo "Login geschlossen<br>";
      $login = False;
    }
    if($fa && isset($_SESSION["code"])){

      $fa = False;
    }
    if($fa && $login){

      $login = 10;
      $_SESSION["Admin"] = False;
      $_SESSION['temp_User_ID'] = md5($user_id);
      $_SESSION['temp_User_Name'] = $user_name;
      echo <<<HEREDOC
        <form action="2fa.php" method="post">
        <label for="code">Code der Google Authenticator App:</label>
          <input name="code" />
          <input type="submit" name="login"/>
        </form>
      HEREDOC;
    }
    if($login === True){

      echo "login geglückt";
      $_SESSION['User_ID'] = md5($user_id);
      $_SESSION['User_Name'] = $user_name;
      header('Location: '.getDomain());
    }elseif($login === FALSE) {
      echo "login fehlgeschlagen";
    }
?>
