<?php
  session_start();
  require_once "configuration.php";
  require_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newclass();
  $logina = 0;
  $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
  $dbRes = mysqli_query($U->db_link, $sql);
  while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
    if (md5($row["Id"]) == $_SESSION["User_ID"] && $row["Type"] == 1){
      $logina = 1;
      $user_id = $row["Id"];
    }
  }
  if($logina == 1 && isset($_FILES["File"]) && isset($_POST["online"]) && isset($_POST["Type"])){
    if($_FILES["File"]["error"] == 1 || $_FILES["File"]["error"] == 2){
      ?>
        <a href="./index.php?URL=editor&Type=<?php echo $_POST["Type"]; ?>"><?php echo $U->getLang("admin.back"); ?></a>
      <?php
      echo "<p>".$U->getLang("admin.edit.upload.big")."</p>";
    }elseif($_FILES["File"]["error"] == 3 || $_FILES["File"]["error"] == 4){
      ?>
        <a href="./index.php?URL=editor&Type=<?php echo $_POST["Type"]; ?>"><?php echo $U->getLang("admin.back"); ?></a>
      <?php
      echo "<p>".$U->getLang("admin.edit.upload.not")."</p>";
    }elseif($_FILES["File"]["error"] > 0){
      ?>
        <a href="./index.php?URL=editor&Type=<?php echo $_POST["Type"]; ?>"><?php echo $U->getLang("admin.back"); ?></a>
      <?php
      echo "<p>".$U->getLang("errors.unknown")."</p>"; 
    }else{
      include_once $USOC["SITE_PATH"]."/includes/addPage.inc.php";
      if(!isset($U->contentHandlers[$_POST["Type"]]["HTML"]) || $U->contentHandlers[$_POST["Type"]]["HTML"] == True){
        if(addPage($_POST["Type"],strtolower($_FILES['File']['name']),htmlspecialchars(file_get_contents($_FILES['File']['tmp_name'])),$user_id,date("Y-m-d"),$_POST["online"])){
          header("Location: ./index.php");
        }else{
          ?>
            <a href="./index.php?URL=editor&Type=<?php echo $_POST["Type"]; ?>"><?php echo $U->getLang("admin.back"); ?></a>
          <?php
          echo "<p>".$U->getLang("errors.unknown")."</p>"; 
        }
      }else{
        if(addPage($_POST["Type"],strtolower($_FILES['File']['name']),file_get_contents($_FILES['File']['tmp_name']),$user_id,date("Y-m-d"),$_POST["online"])){
          header("Location: ./index.php");
        }else{
          ?>
            <a href="./index.php?URL=editor&Type=<?php echo $_POST["Type"]; ?>"><?php echo $U->getLang("admin.back"); ?></a>
          <?php
          echo "<p>".$U->getLang("errors.unknown")."</p>"; 
        }
      }
    }
  }elseif(isset($_POST["Type"])){
    ?>
      <a href="./index.php?URL=editor&Type=<?php echo $_POST["Type"]; ?>"><?php echo $U->getLang("admin.back"); ?></a>
    <?php
    echo "<p>".$U->getLang("admin.edit.upload.not")."</p>";
  }else{
    header("Location: ./index.php");
  }
?>