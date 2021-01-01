<?php
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newClass();
  $edit = false;
  if(isset($_GET["SiteName"])){
    $edit = false;
    $sql = "SELECT * FROM Sites Where Name = '".$_GET["SiteName"]."'";
    $db_erg = mysqli_query( $U->db_link, $sql );
    while ($row = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
    {
      if($row["Name"] == $_GET["SiteName"]){
        $edit = true;
        $html = $row["Code"];
        $online = $row["Online"];
      }
    }
  }
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
<head>
  <meta charset="utf-8">
  <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.edit.site") ?></title>
  <script src="ckeditor/ckeditor.js"></script>
</head>
<body>
  <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back") ?></a>
  <form action="sendsite.php" method="post">
  <?php echo $U->getLang("admin.edit.name") ?><input name="N" <?php if($edit){echo "value='".$_GET["SiteName"]."' readonly";}?>/><br />
  <?php echo $U->getLang("admin.edit.content") ?>
  <textarea id="editor" name="C">
  <?php
    if($edit){
      echo $html;
    }
  ?>
  </textarea>
  <?php
    if($edit){
      echo '<input type="hidden" name="edit" value="1"/>';
      if($online == 1){
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

  <br /><button type="submit" value="Absenden"><?php echo $U->getLang("admin.send") ?></button>
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
