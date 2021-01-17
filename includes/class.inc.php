<?php
  /**
  * This file conatins the class U. This class is used on every page.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  // This if statement checks the inclusion of configuration.php
  if(gettype($USOC) == "array"){
    /**
    * This function initialise the U class in $U if it doesn't exist
    * @version Pb2.0Bfx0
    * @since Pb2.0Bfx0RCA
    */
    function newClass(){
      global $U;
      if(!isset($U)){
        $U = new U();
      }
    }
    /**
    * Includes backwards compatibilty functions 
    */
    include_once "backwards compatibility.php";
    /**
    * This class contains all functions for USOC. When a function is needed, U includes it.
    * This class only works when configuration.php is included.
    * Use newClass() and not this class.
    * @see newClass()
    * @version Pb2.4Bfx0
    * @since Pb2.0Bfx0RCA
    */
    class U{
      /**
      * Version name
      * @since Pb2.0Bfx0RCA
      * @var string
      */
      public string $version = "Pb2.4Bfx0";
      /**
      * Version code
      * @since Pb2.4Bfx0
      * @var int
      */
      public int $versionCode = 20240900;
      /**
      * True when USOC is modded
      * @since Pb2.0Bfx0RCA
      * @var boolean
      */
      public bool $modded = false;
      /**
      * The database connection
      * @since Pb2.3Bfx0
      * @var object
      */
      public $db_link;
      /**
      * Content handlers.
      * @see https://github.com/Case-Games/USOC/wiki/reference:Plugin-API
      * @since Pb2.4Bfx0
      */
      public $contentHandlers = [];
      /**
      * @ignore 
      */
      function __construct(){
        // Set db_link
        $this->db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
      }
      /**
      * @ignore
      */
      function __call($name,$arguments){
        $found = False;
        try{
          include_once $name.".inc.php";
          $found = True;
        } catch (Exception $e) {
          echo "Error! Function not found: ".$name."()";
        }
        if($found){
          if(count($arguments) == 0){
            $code = $name.'();';
          }elseif(count($arguments) == 1){
            $code = $name.'("'.$arguments[0].'");';
          }else{
            $code = $name.'("'.implode('","', $arguments).'");';
          }
          eval('$return='.$code);
          return $return;
        }
      }
    }
    newClass();
    // Set default content handlers
    $U->contentHandlers["Sites"] = ["Name" => "sites", "DisplayName" => $U->getLang("admin.site"), "Author" => "Case Games", "InfoURL" => "https://github.com/case-games/USOC", "URL" => "/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){if($Id==0){return False;}}, "ShowHandler" => function ($code, $data){return $code;}, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => True, "ContentCreateHandler" => "Text", "ContentEditHandler" => "Text"];
    $U->contentHandlers["Blog"] = ["Name" => "blog", "DisplayName" => $U->getLang("admin.blog"), "Author" => "Case Games", "InfoURL" => "https://github.com/case-games/USOC", "URL" => "/blog/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){}, "ShowHandler" => function ($code, $data){return $code;}, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => True, "ContentCreateHandler" => "Text", "ContentEditHandler" => "Text"];
    // Import the plugin overview file if it exists
    if(file_exists($USOC["SITE_PATH"]."/plugins/plugins.php")){
      include_once $USOC["SITE_PATH"]."/plugins/plugins.php";
    }elseif(file_exists("plugins/plugins.php")){
      include_once "plugins/plugins.php";
    }
  }else{
    echo "You can't access API from class.php";
  }
?>