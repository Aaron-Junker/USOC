<?php
  /**
  * This document checks if the use is logged in and a admin.
  * If logged in but no admin the HTTP-ERROR 403 is thrown.
  * If not logged in a login interface will be shown.
  * If yes the pages/mainpage.php will be included.
  */
  session_start();
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newClass();
  if(isset($_SESSION["User_ID"])){
    //Check login
    $logina = 0;
    $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
    $db_erg = mysqli_query( $U->db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
      if (md5($zeile["Id"]) == $_SESSION["User_ID"] && $zeile["Type"] == 1){
        $logina = 1;
      }
    }
    if ($logina == 1){
      if(isset($_GET["URL"])&&file_exists("pages/".$_GET["URL"].".php")){
        include_once "pages/".$_GET["URL"].".php";
      }else{
        include_once "pages/mainpage.php";
      }
    }else{
      header("HTTP/1.1 403 Forbidden");
      header('Location: '.$USOC["DOMAIN"].'/error?E=403');
    }
  }else{
    ?>
      <form action="login.php" method="post">
        <label for="B"><?php echo $U->getLang("login.username.g") ?></label>
        <input name="B" type="text" />
        <label for="P"><?php echo $U->getLang("login.password.g") ?></label>
        <input name="P" type="password" />
        <input type="submit" />
      </form>
<?php
  }
 ?>
