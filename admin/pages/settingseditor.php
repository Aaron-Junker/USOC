<?php
 if($U->userHasPermission("Backend", "Settings", "Advanced")){
?>
  <!DOCTYPE html>
  <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.settings"); ?></title>
    </head>
    <body>
      <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back"); ?></a>
      <?php
        if(!isset($_GET["N"])){
          $text = <<<'CODE'
          <form action="%a">
          <select name="N">
          CODE;
          $sql = "SELECT * FROM Settings";
          $dbRes = mysqli_query($U->db_link, $sql);
          while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
            if(in_array($row["Name"], $USOC["lockedSettings"])){
              $text = $text."<option disabled value='".$row["Name"]."'>".$row["Name"]."</option>";
            }else{
              $text = $text."<option value='".$row["Name"]."'>".$row["Name"]."</option>";
            }
          }
          $text = $text.<<<'CODE'
          </select>
          <input type="hidden" name="URL" value="settingseditor" />
          <button type="submit">%b</button>
          </form>
          CODE;
          $text = str_replace('%a',$_SERVER['PHP_SELF'],$text);
          $text = str_replace('%b',$U->getLang("admin.settingsadvanced.edit.p"),$text);
          echo $text;
        }else{
          $sql = "SELECT * FROM Settings;";
          $dbRes = mysqli_query($U->db_link, $sql);
          while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
            if ($row["Name"] == $_GET["N"]){
              $type = $row["Type"];
              $value = $row["Value"];
            }
          }
        }
        if(isset($type)){
          if($type == "Bool"){
            $text = <<<'CODE'
            <form action="%a">
              <input type="hidden" name="URL" value="settingseditorsend" />
              <input type="hidden" name="N" value="%b" />
              <br />1:<input type="radio" name="V" value="1" />
              <br />0:<input type="radio" name="V" value="0" /><br />
              <button type="submit">%c</button>
            </form>
            CODE;
            $text = str_replace('%b',$_GET["N"],$text);
            $text = str_replace('%a',$_SERVER['PHP_SELF'],$text);
            $text = str_replace('%c',$U->getLang("admin.settingsadvanced.edit.p"),$text);
          }elseif($type == "Int"){
            $text = <<<'CODE'
            <form action="%a">
            <input type="hidden" name="URL" value="settingseditorsend" />
            <input type="hidden" name="N" value="%b" />
            <br /><input type="number" name="V" value="%c" /><br />
            <button type="submit">%d</button>
            </form>
            CODE;
            $text = str_replace('%c',$value,$text);
            $text = str_replace('%b',$_GET["N"],$text);
            $text = str_replace('%a',$_SERVER['PHP_SELF'],$text);
            $text = str_replace('%d',$U->getLang("admin.settingsadvanced.edit.p"),$text);
          }elseif($type == "Text"){
            $text = <<<'CODE'
            <form action="%a">
            <input type="hidden" name="URL" value="settingseditorsend" />
            <input type="hidden" name="N" value="%b" />
            <br /><input type="Text" name="V" value="%c" /><br />
            <button type="submit">%d</button>
            </form>
            CODE;
            $text = str_replace('%c',$value,$text);
            $text = str_replace('%b',$_GET["N"],$text);
            $text = str_replace('%a',$_SERVER['PHP_SELF'],$text);
            $text = str_replace('%d',$U->getLang("admin.settingsadvanced.edit.p"),$text);
          }else{
            echo "<p>".$U->getLang("errors.unknown")."</p>";
          }
          echo $text;
        }
      ?>
    </body>
  </html>
<?php
  }else{
?>
  <!DOCTYPE html>
  <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.settings"); ?></title>
    </head>
    <body>
      <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back"); ?></a>
      <p><?php echo $U->getLang("rights.error"); ?></p>
    </body>
  </html>
<?php
  }
?>