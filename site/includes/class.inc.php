<?php
  if(gettype($USOC) == "array"){
    function __autoload($class){
      include_once $class.".inc.php"
    }
    class U{
      //Version Codes
      public $version = "Pb2.0Bfx0";
      public $version_code = 20200900;
      public $modded = false;

      function __construct($argument){

      }
      public function getPP(){
        //Gets profil picture from gravatar
      	require_once ($USOC["SITE_PATH"].'configuration.php');
        $db_link = mysqli_connect (MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
        $sql = "SELECT * FROM User WHERE Username='".$_SESSION['User_Name']."'";
        $db_erg = mysqli_query( $db_link, $sql );
        while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
          $mail = $zeile["Mail"];
        }
        $code = md5(strtolower( trim($mail) ) );
      	return "<img src='https://www.gravatar.com/avatar/".$code."' />";
      }
    }

  }else{
    echo "You can't access API from class.php";
  }
?>
