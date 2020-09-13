<?php
  require_once "../configuration.php";
  require_once "../includes/class.inc.php";
  newClass();
  session_start();
  $blocked = False;
  $login = False;
  $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
  $sql = "SELECT * FROM User";
  $db_erg = mysqli_query( $db_link, $sql );
  if(isset($_SESSION["code"])){
    $_POST["B"] = $_SESSION['temp_User_Name'];
  }
  while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
    if((strtolower($_POST["B"])==strtolower($zeile["Username"])||strtolower($_POST["B"])==strtolower($zeile["Mail"]))&&(@password_hash($_POST["P"],PASSWORD_DEFAULT,["salt"=>getSetting("login.salt")])==$zeile["Password"]||isset($_SESSION["code"])) ){
      $login = True;
      $user_id = $zeile["Id"];
      $user_name = $zeile["Username"];
      if($zeile["Type"] == 1){
        $_SESSION["Admin"] = True;
      }
      if($zeile["google_2fa"] != ""){
        $fa = True;
      }
      if($zeile["blocked"] == 1){
        $login = False;
        echo sprintf($U->getLang("login.locked"),$U->getLang("login.account"));
        $blocked = True;
      }
    }
  }
  if($U->getSetting("login.login_open")=="0"){
    echo $U->getLang("login.login_closed")."<br>";
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
    $htmlcode = <<<HEREDOC
      <form action="2fa.php" method="post">
      <label for="code">%d</label>
        <input name="code" />
        <input type="submit" name="login"/>
      </form>
    HEREDOC;
    echo sprintf($htmlcode, getLang("login.2fa.google_authenticator.code"));
  }
  if($login === True){
    echo getLang("login.succeed");
    $_SESSION['User_ID'] = md5($user_id);
    $_SESSION['User_Name'] = $user_name;
    header('Location: '.$USOC["DOMAIN"]);
  }elseif($login === False && $blocked === False) {
    echo getLang("login.fail");
    header('Location: '.$USOC["DOMAIN"].'/login.php?ERROR=0x000000');
  }
?>
