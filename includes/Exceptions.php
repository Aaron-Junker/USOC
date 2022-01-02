<?php

class notImplementedException extends Exception
{
    public function errorMessage()
    {
        return "Function not implemented at line".$this->getLine()." in file ".$this->getFile();
    }
}

#[Attribute]
class Deprecated{
    public function __construct()
    {
        trigger_error("Deprecated call in Line ".__LINE__." in File ".__FILE__, E_USER_WARNING);
    }
}