<?php
  /**
  * This document checks if the use is logged in and a admin.
  * If logged in but no admin the HTTP-ERROR 403 is thrown.
  * If not logged in a login interface will be shown.
  * If yes the pages/mainpage.php will be included.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license 
  */
  session_start();
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newClass();
  if(isset($_SESSION["User_ID"])){
    //Check login
    $logina = 0;
    $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
    $db_erg = mysqli_query($U->db_link, $sql);
    while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
      if(md5($row["Id"]) == $_SESSION["User_ID"] && $USOC["userRights"][$row["Type"]]["Backend"][""][""] == 1){
        $logina = 1;
      }
    }
    if($logina == 1){
      if(isset($_GET["URL"]) && file_exists("pages/".$_GET["URL"].".php") && !str_contains($_GET["URL"], "..") && !str_contains($_GET["URL"], ".")){
        include_once "pages/".$_GET["URL"].".php";
      }else{
        include_once "pages/mainpage.php";
      }
    }else{
      //header("HTTP/1.1 403 Forbidden");
      //header('Location: '.$USOC["DOMAIN"].'/error?E=403');
    }
  }else{
    ?>
    <!DOCTYPE html>
    <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
      <body>
        <h1>USOC - <?php echo $U->getLang("admin"); ?></h1>
        <h3><?php echo $U->getLang("login.onlyAdmin"); ?></h3>
        <a href="<?php echo $USOC["DOMAIN"]; ?>"><?php echo $U->getLang("admin.toFrontend"); ?></a><br />
        <?php
          if($U->getSetting("login.login_open") == "1"){
        ?>
          <a href="<?php echo $USOC["DOMAIN"]; ?>/login.php"><?php echo $U->getLang("login.onlyAdmin.toNormal"); ?></a><br />
        <?php
          }
        ?>
        <form action="login.php" method="post">
          <label for="B"><?php echo $U->getLang("login.username.g"); ?>:</label><br />
          <input name="B" type="text" /><br />
          <label for="P"><?php echo $U->getLang("login.password.g"); ?>:</label><br />
          <input name="P" type="password" /><br />
          <input type="submit" value="<?php echo $U->getLang("login.action"); ?>" />
        </form>
      </body>
    </html>
<?php
  }
?>
