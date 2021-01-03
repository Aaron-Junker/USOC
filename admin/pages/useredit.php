<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.user.edit"); ?></title>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back"); ?></a>
    <?php
      if(isset($_POST["N"])&& !isset($_POST["Submit"])){
        $sql = "SELECT * FROM user WHERE id='".$_POST["N"]."';";
        $db_erg = mysqli_query($U->db_link, $sql);
        $userhere = False;
        while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
          $user_Type = $row["Type"];
          $user_Blocked = $row["blocked"];
          $userhere = True;
        }
        if($userhere){
          $text = <<<'HEREDOC'
          <form action="%a?URL=useredit" method="post">
            <label for="A">%b</label><input name="A" type="checkbox" %d />
            <label for="G">%c</label><input name="G" type="checkbox" %e />
            <input type="submit" name="Submit"/>
          HEREDOC;
          $text = $text."<input type='hidden' name='N' value='".$_POST["N"]."' /></form>";
          $text = str_replace('%a',$_SERVER['PHP_SELF'],$text);
          $text = str_replace('%b',$U->getLang("admin.user.admin"),$text);
          $text = str_replace('%c',$U->getLang("admin.user.block"),$text);
          $text = str_replace('%d',($user_Type=="1"?"checked":""),$text);
          $text = str_replace('%e',($user_Blocked=="1"?"checked":""),$text);
          echo $text;
        }else{
          echo "<br />".str_replace("%a", $_POST["N"], $U->getLang("admin.user.notFound"));
        }
      }elseif(isset($_POST["Submit"])){
        if(isset($_POST["A"])){
          $admin = 1;
        }else{
          $admin = 0;
        }
        if(isset($_POST["G"])){
          $b = 1;
        }else{
          $b = 0;
        }
        if($_SESSION["User_ID"] !== md5($_POST["N"])){
          $sql = "UPDATE User SET Type='".$admin."', blocked ='".$b."' WHERE Id='".$_POST["N"]."';";
          $db_erg = mysqli_query($U->db_link, $sql);
        }else{
          echo "<br />".$U->getLang("admin.user.youself");
        }
      }else{
        $sql = "SELECT * FROM User;";
        $db_erg = mysqli_query($U->db_link, $sql);
        // Allow only values in the range from the lowest Id to the highest id
        $highestId = 0;
        // BUG: #54 Lowest ID don't work if over 10000000000000000000000000 accounts are created
        $lowestId = 10000000000000000000000000;
        while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
          if($row["Id"] > $highestId){
            $highestId = $row["Id"];
          }
          if($row["Id"] < $lowestId){
            $lowestId = $row["Id"];
          }
        }
        $text = <<<'HEREDOC'
        <form action="$_SERVER["PHP_SELF"]?URL=useredit" method="post">
          <label for="N">ID:</label><input name="N" type="number" min="%b" max="%a" />
          <input type="submit" />
        </form>
        <a href="javascript:window.open('index.php?URL=usersearch', 'Search user', 'width=500,height=500,status=no,titlebar=no,location=no,toolbar=no,left=300');">%c</a>
        HEREDOC;
        $text = str_replace('$_SERVER["PHP_SELF"]', $_SERVER['PHP_SELF'], $text);
        $text = str_replace('%a', $highestId, $text);
        $text = str_replace('%b', $lowestId, $text);
        $text = str_replace('%c', $U->getLang("admin.user.search"), $text);
        echo $text;
      }
    ?>
  </body>
</html>
