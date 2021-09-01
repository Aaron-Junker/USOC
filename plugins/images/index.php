<?php
    $language = [
        "de-de" => [
            "name" => "Bild"
        ],
        "en-en" => [
            "name" => "Image"
        ]
    ];
    function getLangImage($string){
        global $U, $USOC, $language;
        if(isset($language[$U->getSetting("site.lang")][$string])){
            return $language[$U->getSetting("site.lang")][$string];
        }else{
            return $language["en-en"][$string];
        }
    }
    $U->contentHandlers["Images"] = ["PackageVersion" => 1, "Name" => "image", "Author" => "Case Games", "InfoURL" => "https://github.com/case-games/USOC", "DisplayName" => getLangImage("name"), "URL" => "/image/", "AddHandler" => function (int $Id, array $data){
        $allowedTypes = array('jpg','png','jpeg','gif', "jpe", "jfif", "giff"); 
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
            header("Content-Type: image/svg+xml");
        }else{

        }
        return $code;
    }, "HTML" => False, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => true, "ContentCreateHandler" => "Upload", "ContentEditHandler" => "Upload"];
?>