<?php
  session_start();
  require_once "../configuration.php";
  require_once "../includes/class.inc.php";
  newClass();
  //Preset variables
  /**
  * Is user blocked?
  * @var bool
  */
  $blocked = false;
  /**
  * Is login succeeded?
  * @var bool
  */
  $login = false;
  /**
  * Is user blocked?
  * @var bool
  */
  $fa = false;
  //Make a mysql query to database User
  $sql = "SELECT * FROM User";
  $db_erg = mysqli_query($U->db_link, $sql);
  //True when the query comes from 2fa.php where the code is set
  if(isset($_SESSION["code"])){
    //Sets username to the username from 2fa.php
    $_POST["B"] = $_SESSION['temp_User_Name'];
  }
  while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
    //Checks if a user exits
    if((strtolower($_POST["B"])==strtolower($row["Username"])||strtolower($_POST["B"])==strtolower($row["Mail"]))&&(password_verify($_POST["P"],$row["Password"])||isset($_SESSION["code"])) ){
      $login = True;
      /**
      * Contains user id
      * @var int
      */
      $user_id = $row["Id"];
      /**
      * Contains username
      * @var string
      */
      $user_name = $row["Username"];
      //Checks if user is a admin
      if($row["Type"] == 1){
        $_SESSION["Admin"] = True;
      }
      // Checks if user has 2fa with Google Authnticator
      if($row["google_2fa"] != "" && $U->getSetting("2fa.enabled") == "1"){
        $fa = True;
      }
      // Checks if user is blocked
      if($row["blocked"] == 1){
        $login = False;
        echo sprintf($U->getLang("login.locked"),$U->getLang("login.account"));
        $blocked = True;
      }
    }
  }
  //Checks if login is closed
  if($U->getSetting("login.login_open")=="0"){
    echo $U->getLang("login.login_closed")."<br>";
    $login = False;
  }
  //Checks if user has 2fa and was at 2fa.php
  if($fa && isset($_SESSION["code"])){
    $fa = False;
    unset($_SESSION['temp_User_ID'],$_SESSION['temp_User_Name']);
  }
  //Checks if 2fa is enabled and user wasn't in 2fa.php
  if($fa && $login){
    //Unsets because it isn't true or false
    unset($login);
    //Sets session variables for 2fa.php
    $_SESSION["Admin"] = False;
    $_SESSION['temp_User_ID'] = md5($user_id);
    $_SESSION['temp_User_Name'] = $user_name;
    //Outputs a form for the 2fa code
    $htmlcode = <<<HEREDOC
      <form action="2fa.php" method="post">
      <label for="code">%d</label>
        <input name="code" />
        <input type="submit" name="login"/>
      </form>
    HEREDOC;
    echo str_replace("%d",$U->getLang("login.2fa.google_authenticator.code"),$htmlcode);
  }
  if(isset($login)){
    if($login == True){
      //If login has suceeded
      echo $U->getLang("login.succeed");
      $_SESSION['User_ID'] = md5($user_id);
      $_SESSION['User_Name'] = $user_name;
      header('Location: '.$USOC["DOMAIN"]);
    }elseif($login == False && $blocked == False) {
      //If login has failed
      echo $U->getLang("login.fail");
      header('Location: '.$USOC["DOMAIN"].'/login.php?ERROR=0x000000');
    }
  }
?>
