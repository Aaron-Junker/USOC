<?php
$edit = false;
  if(isset($_GET["SiteName"])){
    $edit = false;
    require_once ('konfiguration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
    $sql = "SELECT * FROM Sites Where Name = "."'".$_GET["SiteName"]."'";
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
    <title>Adminbereich - Seiten editieren</title>
    <script src="../ckeditor/ckeditor.js"></script>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage">Zurück</a>
    <form action="sendsite.php" method="post">
    Name:<input name="N" <?php if($edit){echo "value='".$_GET["SiteName"]."' readonly";}?>/><br />
    Content:
    <textarea id="editor">
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
    ClassicEditor
      .create( document.querySelector( '#editor' ) )
      .then( editor => {
      console.log( editor );
      } )
      .catch( error => {
      console.error( error );
      } );
    </script>
  </body>
</html>
