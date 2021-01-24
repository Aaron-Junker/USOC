<?php
    $language = [
        "de-de" => [
            "name" => "Text Datei"
        ],
        "en-en" => [
            "name" => "Text file"
        ]
    ];
    function getLangText($string){
        global $U, $USOC, $language;
        if(isset($language[$U->getSetting("site.lang")][$string])){
            return $language[$U->getSetting("site.lang")][$string];
        }else{
            return $language["en-en"][$string];
        }
    }
    $U->contentHandlers["Text"] = ["PackageVersion" => 1, "Name" => "text", "DisplayName" => getLangText("name"), "URL" => "/text/", "AddHandler" => function (int $Id, array $data){
        $allowedTypes = array('txt'); 
        $fileExtension = strtolower(pathinfo($data["Name"], PATHINFO_EXTENSION));
        if(in_array($fileExtension, $allowedTypes)){
            return True;
        }else{
            return False;
        }
    }, "DeleteHandler" => function (int $Id){}, 
    "ShowHandler" => function ($code, $data){
        global $raw;
        if($raw){
            header("Content-Type: text/plain");
        }
        return $code;
    }, "HTML" => False, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => True, "ContentCreateHandler" => "Upload", "ContentEditHandler" => "Upload"];
?>