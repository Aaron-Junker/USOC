<?php
  session_start();
  require_once "configuration.php";
  require_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newclass();
  $logina = 0;
    /**
  * True if the contentpage was already created. False if not.
  * @var bool
  */
  $edit = False;
  if(isset($_POST["edit"])){
    $edit = True;
  }
  $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
  $dbRes = mysqli_query($U->db_link, $sql);
  while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
    if($edit){
      if(md5($row["Id"]) == $_SESSION["User_ID"] && $U->userHasPermission("Backend","Edit")){
        $logina = 1;
        $user_id = $row["Id"];
      }
    }else{
      if(md5($row["Id"]) == $_SESSION["User_ID"] && $U->userHasPermission("Backend","Create")){
        $logina = 1;
        $user_id = $row["Id"];
      }
    }
  }
  if(isset($_POST["N"])&&isset($_POST["Type"])&&isset($_POST["C"])&&$logina==1&&(!$edit)){
    if(preg_match("/\.|\/|\?|\#|^(blogsite)|^[0-9]/", $_POST["N"]) === 1){
      echo $U->getLang("admin.edit.letter")."<br />";
      echo $U->getLang("admin.learnMore").": <a href=\"https://github.com/Case-Games/USOC/wiki/manual:Create-a-new-page#forbidden-names\">https://github.com/Case-Games/USOC/wiki/manual:Create-a-new-page#forbidden-names</a>";
      echo "<br /><a href=\"index.php?URL=editor&Type=".$_POST["Type"]."&Code=".urlencode(base64_encode($_POST["C"]))."\">".$U->getLang("admin.back")."</a>";
      exit();
    }
    $U->addPage($_POST["Type"],$_POST["N"],htmlspecialchars($_POST["C"]),$user_id,date("Y-m-d"),$_POST["online"]);
    header("Location: ".$USOC["DOMAIN"].$U->contentHandlers[$_POST["Type"]]["URL"].$_POST["N"]);
  }
  if(isset($_POST["N"])&&isset($_POST["Type"])&&isset($_POST["C"])&&$logina==1&&$edit){
    $U->editPage($_POST["Type"],$_POST["N"],htmlspecialchars($_POST["C"]),$_POST["online"]);
    header("Location: ".$USOC["DOMAIN"].$U->contentHandlers[$_POST["Type"]]["URL"].$_POST["N"]);
  }
?>