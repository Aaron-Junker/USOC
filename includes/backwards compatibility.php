<?php
    /**
    * This file contains new functions from PHP8.0 for PHP7.4 Users
    * Documentation of classes from https://php.net
    * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
    */
    if(!function_exists("str_contains")){
        /**
        * str_contains takes a $haystack and a $needle as arguments, checks if $needle is found in $haystack
        * @param string $haystack The string
        * @param string $needle The string which should be searched in $haystack
        * @return bool The result of the operation
        */
        function str_contains(string $haystack, string $needle):bool{
            if(strpos($haystack, $needle) !== False){
                return True;
            }
            return False;
        }
        /**
        * str_starts_with tests if $haystack starts with $needle
        * @param string $haystack The string
        * @param string $needle The string which should be the start of $haystack
        * @return bool The result of the operation
        */
        function str_starts_with(string $haystack, string $needle):bool{
            if(substr($haystack, 0, strlen($needle)) === $needle){
                return True;
            }
            return False;
        }
        /**
        * str_ends_with tests if $haystack ends with $needle
        * @param string $haystack The string
        * @param string $needle The string which should be the end of $haystack
        * @return bool The result of the operation
        */
        function str_ends_with(string $haystack, string $needle):bool{
            if(substr($haystack, -strlen($needle)) === $needle || strlen($needle) == 0){
                return True;
            }
            return False;
        }
    }
?>