<?php
    session_start();
    include_once "configuration.php";
    include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
    newClass();
    if(isset($_SESSION["User_ID"])){
        //Check login
        $login = 0;
        $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
        $db_erg = mysqli_query($U->db_link, $sql);
        while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
            if (md5($row["Id"]) == $_SESSION["User_ID"] && $row["Type"] == 1){
                $login = 1;
            }
        }
        if ($login == 1){
            if(isset($_POST["Name"]) && isset($_POST["Value"])){
                $U->editSetting($_POST["Name"], $_POST["Value"]);
            }elseif(isset($_POST["Name"])){
                echo $U->getSetting($_POST["Name"]);
            }
        }else{
            header("HTTP/1.1 403 Forbidden");
            header('Location: '.$USOC["DOMAIN"].'/error?E=403');
        }
    }
?>