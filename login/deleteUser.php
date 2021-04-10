<?php
    session_start();
    include_once "../configuration.php";
    include_once "../includes/class.inc.php";
    if(isset($_SESSION["User_ID"])){
        if($U->userHasPermission("Profile", "Delete_account")){
            $sql = "SELECT * FROM User";
            $dbRes = mysqli_query($U->db_link, $sql);
            while($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
                if(md5($row["Id"]) == $_SESSION["User_ID"]){
                    if($U->deleteUser($row["Id"])){
                        header("Location: ../logout.php");
                    }else{
                        echo $U->getLang("errors.unknown");
                    }
                }
            }
        }else{
            echo $U->getLang("rights.error");
        }
    }else{
        header("Location: ../login.php");
    }
?>