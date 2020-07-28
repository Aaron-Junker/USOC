<?php
  if(gettype($USOC) == "array"){
    class U{
      //Version Codes
      public $version = "Pb2.0Bfx0";
      public $version_code = 20200900;
      public $modded = false;

      function __construct(){

      }
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
