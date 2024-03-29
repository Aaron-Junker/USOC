<?php
  session_start();
  require_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
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
  $dbRes = mysqli_query($U->db_link, $sql);
  //True when the query comes from 2fa.php where the code is set
  if(isset($_SESSION["code"])){
    //Sets username to the username from 2fa.php
    $_POST["B"] = $_SESSION['temp_User_Name'];
  }
  while ($row = mysqli_fetch_array( $dbRes, MYSQLI_ASSOC)){
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
      if($USOC["userRights"][$row["Type"]]["Backend"][""][""] == 1){
        $_SESSION["PermissionLevel"] = $row["Type"];
      }else{
        $login = False;
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
    $_SESSION["PermissionLevel"] = 0;
    $_SESSION['temp_User_ID'] = md5($user_id);
    $_SESSION['temp_User_Name'] = $user_name;
    //Outputs a form for the 2fa code
?>
    <!DOCTYPE html>
    <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
      <body>
        <h1>USOC - <?php echo $U->getLang("admin"); ?></h1>
        <form action="2fa.php" method="post"><br />
          <label for="code"><?php echo $U->getLang("login.2fa.google_authenticator.code"); ?></label><br />
          <input name="code" autocomplete="off" /><br />
          <input type="submit" name="login" value="<?php echo $U->getLang("login.action"); ?>" />
        </form>
      </body>
    </html>
<?php
  }
  if(isset($login)){
    if($login == True){
      //If login has suceeded
      echo $U->getLang("login.succeed");
      $_SESSION['User_ID'] = md5($user_id);
      $_SESSION['User_Name'] = $user_name;
      header('Location: '.$USOC["ADMIN_PATH"]."/index.php");
    }elseif($login == False && $blocked == False) {
      //If login has failed
      echo $U->getLang("login.fail");
      header('Location: '.$USOC["DOMAIN"].'/login.php');
    }
  }
?>
