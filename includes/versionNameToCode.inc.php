<?php
    /**
    * File with function versionNameToCode()
    * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
    */
    /**
    * This is a function for the class U.
    * This function converts a [CGS0002] version in a [CHS0004] version identifier number code.
    * @see U For more informations about U.
    * @version Pb2.4Bfx0
    * @since Pb2.4Bfx0
    * @param string $name The version
    * @return int The version identifier code
    */
    function versionNameToCode(string $name):int{
        $returnInt = "";
        // Get prefix
        if(str_starts_with($name, "Pa")){
            $returnInt[1] = 1;
            $name = ltrim($name, "Pa");
        }elseif(str_starts_with($name, "Pb")){
            $returnInt[1] = 2;
            $name = ltrim($name, "Pb");
        }else{
            $returnInt[1] = 3;
        }
        if(str_starts_with($name, "A")){
            $abnumeral = 1;
            $name = ltrim($name, "A");
        }elseif(str_starts_with($name, "B")){
            $abnumeral = 2;
            $name = ltrim($name, "B");
        }else{
            $abnumeral = 9;
        }
        // Remove suffix
        if(!is_numeric($name[-1])){
            $name = str_replace(substr($name, -3, 3) , "", $name);
        }
        // Get Bugfix number
        $bugfixNumber = "";
        if($name[-2] != "x"){
            $bugfixNumber = $name[-2];
            $name = str_replace(substr($name, -3, 2) , "x", $name);
        }else{
            $bugfixNumber = "0";
        }
        $bugfixNumber = $bugfixNumber.$name[-1];
        $name = $name."q";
        $name = str_replace(substr($name, -2, 2) , "", $name);
        $name = str_replace("Bfx", "", $name);
        // Get major and minor version
        if(strlen(preg_split("/[^\.]+$/", $name)[0]) == 2){
            $returnInt = $returnInt."0".str_replace(".","",preg_split("/[^\.]+$/", $name)[0]);
        }else{
            $returnInt = $returnInt.str_replace(".","",preg_split("/[^\.]+$/", $name)[0]);
        }
        $name = str_replace(preg_split("/[^\.]+$/", $name)[0], "", $name);
        if(strlen($name) == 1){
            $returnInt = $returnInt.$name."0";
        }else{
            $returnInt = $returnInt.$name;
        }
        // Put string together
        return $returnInt.$abnumeral.$bugfixNumber;
    }
?>