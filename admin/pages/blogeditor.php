<?php
$edit = false;
  if(isset($_GET["SiteName"])){
    $edit = false;
    require_once ('konfiguration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
    $sql = "SELECT * FROM Blog Where Name = "."'".$_GET["SiteName"]."'";
    $db_erg = mysqli_query( $db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
    {
      if($zeile["Name"] == $_GET["SiteName"]){
        $edit = true;
        $html = $zeile["Code"];
        $online = $zeile["Online"];
      }
    }
  }
?>
<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Adminbereich - Blogseite editieren</title>
    <script src="https://cdn.tiny.cloud/1/opn9s15j3xtusjx2716b9retal29jnhv2s9y7f4ypzbewy4x/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage">Zurück</a>
    <form action="sendsiteblog.php" method="post">
    Name:<input name="N" <?php if($edit){echo "value='".$_GET["SiteName"]."' readonly";}?>/><br />
    Content:
    <textarea name="C" />
    <?php
      if($edit){
        echo $html;
      }
    ?>
    </textarea>
    <?php
      if($edit){
        echo '<input type="hidden" name="edit" value="1"/>';
        if($online = 1){
          echo 'Online:<input type="radio" name="online" value="1" checked/><br />';
          echo 'Offline:<input type="radio" name="online" value="0" />';
        }else{
          echo 'Online:<input type="radio" name="online" value="1" /><br />';
          echo 'Offline:<input type="radio" name="online" value="0" checked/>';
        }
      }else{
        echo 'Online:<input type="radio" name="online" value="1" /><br />';
        echo 'Offline:<input type="radio" name="online" value="0" checked/>';
      }
    ?>

    <br /><button type="submit" value="Absenden">Absenden</button>
  </form>
    <script>
    tinymce.init({
      selector: 'textarea',
      plugins: "link lists",
      contextmenu: "link numlist bullist",
      toolbar: "undo redo | styleselect | bold italic | link image | numlist bullist",
      width: 1200,
      height: 900,
    });
    </script>
  </body>
</html>
