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
    $U->contentHandlers["Images"] = ["PackageVersion" => 1, "Name" => "image", "DisplayName" => getLangImage("name"), "URL" => "/image/", "AddHandler" => function (int $Id, array $data){
        $allowedTypes = array('jpg','png','jpeg','gif'); 
        $fileExtension = strtolower(pathinfo($data["Name"], PATHINFO_EXTENSION));
        if(in_array($fileExtension, $allowedTypes)){
            return True;
        }else{
            return False;
        }
    }, "DeleteHandler" => function (int $Id){}, 
    "ShowHandler" => function ($code, $data){
        $fileExtension = strtolower(pathinfo($data["Name"], PATHINFO_EXTENSION));
        $width = (isset($_GET["width"]) ? $_GET["width"]."px" : "");
        if($fileExtension == "jpg"){
            $code = "<img width=\"".$width."\" src=\"data:image/jpg;charset=utf8;base64,".base64_encode($code)."\" />";
        }elseif($fileExtension == "png"){
            $code = "<img width=\"".$width."\" src=\"data:image/png;charset=utf8;base64,".base64_encode($code)."\" />";
        }elseif($fileExtension == "jpeg"){
            $code = "<img width=\"".$width."\" src=\"data:image/jpeg;charset=utf8;base64,".base64_encode($code)."\" />";
        }elseif($fileExtension == "gif"){
            $code = "<img width=\"".$width."\" src=\"data:image/gif;charset=utf8;base64,".base64_encode($code)."\" />";
        }
        return $code;
    }, "HTML" => False, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => True, "ContentCreateHandler" => "Upload", "ContentEditHandler" => "Upload"];
?>