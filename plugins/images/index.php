<?php
    $language = [
        "de-de" => [
            "name" => "PNG-Bild"
        ],
        "en-en" => [
            "name" => "PNG-Image"
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
    $U->contentHandlers["Images"] = ["Name" => "image", "DisplayName" => getLangImage("name"), "URL" => "/image/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){}, "ShowHandler" => function ($code, $data){header("Content-type: image/png");return $code;}, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => True, "ContentCreateHandler" => "Upload", "ContentEditHandler" => "Upload"];
?>