<?php
  session_start();
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  if(isset($_SESSION["User_ID"])){
    //Check login
    $logina = 0;
    $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
    $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
    $db_erg = mysqli_query( $db_link, $sql );
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
