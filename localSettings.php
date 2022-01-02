<?php
/**
* This file contains all standard settings for USOC
* For configuring you should use configuration.php
*/
$USOC["afterInitialization"] = array(
function (){
    global $USOC, $U;
    // Set names for permission system
    $USOC["userRights"][0]["Name"] = $U->getLang("rights.name.visitor");
    $USOC["userRights"][1]["Name"] = $U->getLang("rights.name.user");
    $USOC["userRights"][2]["Name"] = $U->getLang("rights.name.editor");
    $USOC["userRights"][3]["Name"] = $U->getLang("rights.name.admin");
});
// Set all user rights
// - visitor
// - - Login
$USOC["userRights"][0]["Login"][""][""] = 1;
$USOC["userRights"][0]["Login"]["Login"][""] = 1;
$USOC["userRights"][0]["Login"]["Login"]["2FA"] = 1;
$USOC["userRights"][0]["Login"]["Login"]["Google_login"] = 1;
$USOC["userRights"][0]["Login"]["Register"][""] = 1;
$USOC["userRights"][0]["Login"]["Register"]["Without_mail"] = 0;
// - - Profile
$USOC["userRights"][0]["Profile"][""][""] = 0;
$USOC["userRights"][0]["Profile"]["Change_password"][""] = 0;
$USOC["userRights"][0]["Profile"]["Delete_account"][""] = 0;
$USOC["userRights"][0]["Profile"]["Add_2FA"][""] = 0;
$USOC["userRights"][0]["Profile"]["Add_google_login"][""] = 0;
$USOC["userRights"][0]["Profile"]["Show_profile_picture"][""] = 0;
// - - Backend
$USOC["userRights"][0]["Backend"][""][""] = 0;
$USOC["userRights"][0]["Backend"]["Login"][""] = 0;
$USOC["userRights"][0]["Backend"]["About"][""] = 0;
$USOC["userRights"][0]["Backend"]["About"]["Version"] = 0;
$USOC["userRights"][0]["Backend"]["About"]["Plugins"] = 0;
$USOC["userRights"][0]["Backend"]["Settings"][""] = 0;
$USOC["userRights"][0]["Backend"]["Settings"]["Advanced"] = 0;
$USOC["userRights"][0]["Backend"]["Settings"]["Standard"] = 0;
$USOC["userRights"][0]["Backend"]["User"][""] = 0;
$USOC["userRights"][0]["Backend"]["User"]["Block"] = 0;
$USOC["userRights"][0]["Backend"]["User"]["Permission"] = 0;
$USOC["userRights"][0]["Backend"]["User"]["Search"] = 0;
$USOC["userRights"][0]["Backend"]["Create"][""] = 0;
$USOC["userRights"][0]["Backend"]["Edit"][""] = 0;
$USOC["userRights"][0]["Backend"]["Edit"]["Own"] = 0;
$USOC["userRights"][0]["Backend"]["Edit"]["Others"] = 0;
$USOC["userRights"][0]["Backend"]["Edit"]["Change_online_status"] = 0;
$USOC["userRights"][0]["Backend"]["Delete"][""] = 0;
$USOC["userRights"][0]["Backend"]["Delete"]["Own"] = 0;
$USOC["userRights"][0]["Backend"]["Delete"]["Others"] = 0;
// - - Pages
$USOC["userRights"][0]["Pages"][""][""] = 1;

// - user
// - - Login
$USOC["userRights"][1]["Login"][""][""] = 0;
$USOC["userRights"][1]["Login"]["Login"][""] = 0;
$USOC["userRights"][1]["Login"]["Login"]["2FA"] = 0;
$USOC["userRights"][1]["Login"]["Login"]["Google_login"] = 0;
$USOC["userRights"][1]["Login"]["Register"][""] = 0;
$USOC["userRights"][1]["Login"]["Register"]["Without_mail"] = 0;
// - - Profile
$USOC["userRights"][1]["Profile"][""][""] = 1;
$USOC["userRights"][1]["Profile"]["Change_password"][""] = 1;
$USOC["userRights"][1]["Profile"]["Delete_account"][""] =1 ;
$USOC["userRights"][1]["Profile"]["Add_2FA"][""] = 1;
$USOC["userRights"][1]["Profile"]["Add_google_login"][""] = 1;
$USOC["userRights"][1]["Profile"]["Show_profile_picture"][""] = 1;
// - - Backend
$USOC["userRights"][1]["Backend"][""][""] = 0;
$USOC["userRights"][1]["Backend"]["Login"][""] = 0;
$USOC["userRights"][1]["Backend"]["About"][""] = 0;
$USOC["userRights"][1]["Backend"]["About"]["Version"] = 0;
$USOC["userRights"][1]["Backend"]["About"]["Plugins"] = 0;
$USOC["userRights"][1]["Backend"]["Settings"][""] = 0;
$USOC["userRights"][1]["Backend"]["Settings"]["Advanced"] = 0;
$USOC["userRights"][1]["Backend"]["Settings"]["Standard"] = 0;
$USOC["userRights"][1]["Backend"]["User"][""] = 0;
$USOC["userRights"][1]["Backend"]["User"]["Block"] = 0;
$USOC["userRights"][1]["Backend"]["User"]["Permission"] = 0;
$USOC["userRights"][1]["Backend"]["User"]["Search"] = 0;
$USOC["userRights"][1]["Backend"]["Create"][""] = 0;
$USOC["userRights"][1]["Backend"]["Edit"][""] = 0;
$USOC["userRights"][1]["Backend"]["Edit"]["Own"] = 0;
$USOC["userRights"][1]["Backend"]["Edit"]["Others"] = 0;
$USOC["userRights"][1]["Backend"]["Edit"]["Change_online_status"] = 0;
$USOC["userRights"][1]["Backend"]["Delete"][""] = 0;
$USOC["userRights"][1]["Backend"]["Delete"]["Own"] = 0;
$USOC["userRights"][1]["Backend"]["Delete"]["Others"] = 0;
// - - Pages
$USOC["userRights"][1]["Pages"][""][""] = 1;

// - editor
// - - Login
$USOC["userRights"][2]["Login"][""][""] = 0;
$USOC["userRights"][2]["Login"]["Login"][""] = 0;
$USOC["userRights"][2]["Login"]["Login"]["2FA"] = 0;
$USOC["userRights"][2]["Login"]["Login"]["Google_login"] = 0;
$USOC["userRights"][2]["Login"]["Register"][""] = 0;
$USOC["userRights"][2]["Login"]["Register"]["Without_mail"] = 0;
// - - Profile
$USOC["userRights"][2]["Profile"][""][""] = 1;
$USOC["userRights"][2]["Profile"]["Change_password"][""] = 1;
$USOC["userRights"][2]["Profile"]["Delete_account"][""] = 1;
$USOC["userRights"][2]["Profile"]["Add_2FA"][""] = 1;
$USOC["userRights"][2]["Profile"]["Add_google_login"][""] = 1;
$USOC["userRights"][2]["Profile"]["Show_profile_picture"][""] = 1;
// - - Backend
$USOC["userRights"][2]["Backend"][""][""] = 1;
$USOC["userRights"][2]["Backend"]["Login"][""] = 1;
$USOC["userRights"][2]["Backend"]["About"][""] = 0;
$USOC["userRights"][2]["Backend"]["About"]["Version"] = 0;
$USOC["userRights"][2]["Backend"]["About"]["Plugins"] =0 ;
$USOC["userRights"][2]["Backend"]["Settings"][""] = 0;
$USOC["userRights"][2]["Backend"]["Settings"]["Advanced"] = 0;
$USOC["userRights"][2]["Backend"]["Settings"]["Standard"] = 0;
$USOC["userRights"][2]["Backend"]["User"][""] = 0;
$USOC["userRights"][2]["Backend"]["User"]["Block"] = 0;
$USOC["userRights"][2]["Backend"]["User"]["Permission"] = 0;
$USOC["userRights"][2]["Backend"]["User"]["Search"] = 0;
$USOC["userRights"][2]["Backend"]["Create"][""] = 1;
$USOC["userRights"][2]["Backend"]["Edit"][""] = 1;
$USOC["userRights"][2]["Backend"]["Edit"]["Own"] = 1;
$USOC["userRights"][2]["Backend"]["Edit"]["Others"] = 0;
$USOC["userRights"][2]["Backend"]["Edit"]["Change_online_status"] = 1;
$USOC["userRights"][2]["Backend"]["Delete"][""] = 0;
$USOC["userRights"][2]["Backend"]["Delete"]["Own"] = 0;
$USOC["userRights"][2]["Backend"]["Delete"]["Others"] = 0;
// - - Pages
$USOC["userRights"][2]["Pages"][""][""] = 1;

// - administrator
// - - Login
$USOC["userRights"][3]["Login"][""][""] = 0;
$USOC["userRights"][3]["Login"]["Login"][""] = 0;
$USOC["userRights"][3]["Login"]["Login"]["2FA"] = 0;
$USOC["userRights"][3]["Login"]["Login"]["Google_login"] = 0;
$USOC["userRights"][3]["Login"]["Register"][""] = 0;
$USOC["userRights"][3]["Login"]["Register"]["Without_mail"] = 0;
// - - Profile
$USOC["userRights"][3]["Profile"][""][""] = 1;
$USOC["userRights"][3]["Profile"]["Change_password"][""] = 1;
$USOC["userRights"][3]["Profile"]["Delete_account"][""] = 1;
$USOC["userRights"][3]["Profile"]["Add_2FA"][""] = 1;
$USOC["userRights"][3]["Profile"]["Add_google_login"][""] = 1;
$USOC["userRights"][3]["Profile"]["Show_profile_picture"][""] = 1;
// - - Backend
$USOC["userRights"][3]["Backend"][""][""] = 1;
$USOC["userRights"][3]["Backend"]["Login"][""] = 1;
$USOC["userRights"][3]["Backend"]["About"][""] = 1;
$USOC["userRights"][3]["Backend"]["About"]["Version"] = 1;
$USOC["userRights"][3]["Backend"]["About"]["Plugins"] = 1;
$USOC["userRights"][3]["Backend"]["Settings"][""] = 1;
$USOC["userRights"][3]["Backend"]["Settings"]["Advanced"] = 1;
$USOC["userRights"][3]["Backend"]["Settings"]["Standard"] = 1;
$USOC["userRights"][3]["Backend"]["User"][""] = 1;
$USOC["userRights"][3]["Backend"]["User"]["Block"] = 1;
$USOC["userRights"][3]["Backend"]["User"]["Permission"] = 1;
$USOC["userRights"][3]["Backend"]["User"]["Search"] = 1;
$USOC["userRights"][3]["Backend"]["Create"][""] = 1;
$USOC["userRights"][3]["Backend"]["Edit"][""] = 1;
$USOC["userRights"][3]["Backend"]["Edit"]["Own"] = 1;
$USOC["userRights"][3]["Backend"]["Edit"]["Others"] = 1;
$USOC["userRights"][3]["Backend"]["Edit"]["Change_online_status"] = 1;
$USOC["userRights"][3]["Backend"]["Delete"][""] = 1;
$USOC["userRights"][3]["Backend"]["Delete"]["Own"] = 1;
$USOC["userRights"][3]["Backend"]["Delete"]["Others"] = 1;
// - - Pages
$USOC["userRights"][3]["Pages"][""][""] = 1;

// Permission level after registration
$USOC["userRights"]["AfterRegistration"] = 1;
// Set to visitor if not set
if(!isset($_SESSION["PermissionLevel"])){
    $_SESSION["PermissionLevel"] = 0;
}
// Locked settings
$USOC["lockedSettings"] = array();

$USOC["indexPage"]["Plugin"] = "Pages";

$USOC["indexPage"]["Name"] = "index";

$USOC["ContentHandlers"] = array();

$USOC["RAW_URL"] = "/raw/";
$USOC["AMP_URL"] = "/amp/";

$USOC["ContentHandlers"]["Pages"] = ["Name" => "pages", "DisplayNameString" => "admin.site", "PackageVersion" => 2, "Author" => "Case Games", "InfoURL" => "https://github.com/case-games/USOC", "URL" => "/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){if($Id==0){return False;}}, "ShowHandler" => function ($code, $data){return $code;}, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => True, "ContentCreateHandler" => "Text", "ContentEditHandler" => "Text"];
$USOC["ContentHandlers"]["Blog"] = ["Name" => "blog", "DisplayNameString" => "admin.blog", "PackageVersion" => 2, "Author" => "Case Games", "InfoURL" => "https://github.com/case-games/USOC", "URL" => "/blog/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){}, "ShowHandler" => function ($code, $data){return $code;}, "EditHandler" => function (int $Id, $data){}, "CreateNewContent" => True, "ContentCreateHandler" => "Text", "ContentEditHandler" => "Text"];
$USOC["ContentHandlers"]["Blogsite"] = ["Name" => "blogsite", "DisplayNameString" => "admin.blog", "PackageVersion" => 2, "Author" => "Case Games", "InfoURL" => "https://github.com/case-games/USOC", "URL" => "/blogsite/", "AddHandler" => function (int $Id, array $data){}, "DeleteHandler" => function (int $Id){},
    "ShowHandler" => function ($code, $data,){
        $site = "<h1> BLog overview</h1>";
        $sql = "SELECT * FROM Blog ORDER BY ID DESC;";
        $dbRes = mysqli_query(dbLink, $sql);
        /**
         * This variable is for counting the amount of blogarticles
         * @var int
         */
        $blogarticles = 0;
        while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
            if($row["Online"]==1){
                $site .= "<h2 style='color:black;border-top: 1px;border-top-style:solid;border-top-color:black;'><a style='color:black;' href='/blog/".$row["Name"]."'>".$row["Name"]."</a></h2>";
                $site .= substr($row["Code"],0,100)."...";
                $site .= "<br /><br /><a href='/blog/".$row["Name"]."'><button class='readmore'>Read more</button></a>";
                $blogarticles += 1;
            }
        }
        // Fallback if no blogarticles are saved {
        if($blogarticles == 0){
            $site .= "<p><b></b></p>";
        }
        return $site;
    },
    "EditHandler" => function (int $Id, $data){return false;}, "CreateNewContent" => False, "ContentCreateHandler" => "Text", "ContentEditHandler" => "Text"];