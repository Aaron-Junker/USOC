<?php
  /**
  * This file conatins the class U. This class is used on every page.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  // This if statement checks the including of configuration.php
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
      public $version = "Pb2.4Bfx0";
      /**
      * Version code
      * @since Pb2.4Bfx0
      * @var int
      */
      public $versionCode = 20240900;
      /**
      * True when USOC is modded
      * @since Pb2.0Bfx0RCA
      * @var boolean
      */
      public $modded = false;
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
        // Set default content handlers
        $this->contentHandlers["Sites"] = ["Name" => "Sites", "URL" => "/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){if($Id==0){return False;}}, "ShowHandler" => function ($Code, $data){return $code;}, "EditHandler" => function (int $Id, $data){}];
        $this->contentHandlers["Blog"] = ["Name" => "Blog", "URL" => "/blog/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){}, "ShowHandler" => function ($Code, $data){return $code;}, "EditHandler" => function (int $Id, $data){}];
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
  }else{
    echo "You can't access API from class.php";
  }
?>