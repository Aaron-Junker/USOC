<?php
  public function getProfilePicture($Username){
    //Gets profil picture from gravatar
    require_once ($USOC["SITE_PATH"].'configuration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
    $sql = "SELECT * FROM User WHERE Username='".$Username."'";
    $db_erg = mysqli_query( $db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
      $mail = $zeile["Mail"];
    }
    $code = md5(strtolower( trim($mail) ) );
    return "<img src='https://www.gravatar.com/avatar/".$code."' />";
  }
?>
