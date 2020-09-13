<?php
  /**
  * This file conatins the class U. This class is used on every page.
  * @licence https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source licence
  */
  /**
  * This if statement checks the including of configuration.php
  */
  if(gettype($USOC) == "array"){
    /**
    * This function initialise the U class in $U if it doesn't exist
    * @version Pb2.0Bfx0
    * @since Pb2.0Bfx0
    */
    function newClass(){
      global $U;
      $U = isset($U) ? new U() : $U;
    }
    /**
    * This class contains all functions for USOC. When a function is needed, U includes it.
    * This class only works when configuration.php is included.
    * Use newClass() and not this class.
    * @see newClass()
    * @version Pb2.0Bfx0
    * @since Pb2.0Bfx0
    */
    class U{
      /**
      * Version name.
      * @since Pb2.0Bfx0
      * @var string
      */
      public $version = "Pb2.0Bfx0";
      /**
      * Version code
      * @since Pb2.0Bfx0
      * @var int
      */
      public $version_code = 20200900;
      /**
      * True when USOC is modded.
      * @since Pb2.0Bfx0
      * @var boolean
      */
      public $modded = false;
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
          eval($code);
        }
      }
    }
  }else{
    echo "You can't access API from class.php";
  }
?>
