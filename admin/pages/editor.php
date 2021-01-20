<?php
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newClass();
  $upload = False;
  if(isset($_GET["Type"])){
    if(isset($_GET["SiteName"])){
      if($U->contentHandlers[$_GET["Type"]]["ContentEditHandler"] !== "Text" && $U->contentHandlers[$_GET["Type"]]["ContentEditHandler"] !== "Upload"){
        header("Location: " . $USOC["DOMAIN"] . "/" . $U->contentHandlers[$_GET["Type"]]["ContentEditHandler"] . "?SiteName=" . $_GET["SiteName"]);
      }elseif($U->contentHandlers[$_GET["Type"]]["ContentEditHandler"] === "Upload"){
        $upload = True;
      }
    }else{
      if($U->contentHandlers[$_GET["Type"]]["ContentCreateHandler"] !== "Text" && $U->contentHandlers[$_GET["Type"]]["ContentCreateHandler"] !== "Upload"){
        header("Location: " . $USOC["DOMAIN"] . "/" . $U->contentHandlers[$_GET["Type"]]["ContentCreateHandler"]);
      }elseif($U->contentHandlers[$_GET["Type"]]["ContentCreateHandler"] === "Upload"){
        $upload = True;
      }
    }
    $edit = false;
    if(isset($_GET["SiteName"])){
      $edit = false;
      $sql = "SELECT * FROM ".$U->contentHandlers[$_GET["Type"]]["Name"]." Where Name = '".$_GET["SiteName"]."'";
      $db_erg = mysqli_query($U->db_link, $sql);
      while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
        if($row["Name"] == $_GET["SiteName"]){
          $edit = true;
          $html = $row["Code"];
          $online = $row["Online"];
        }
      }
    }
?>
  <!DOCTYPE html>
  <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?php echo $U->getLang("admin"); ?> - <?php echo $U->getLang("admin.edit.site"); ?></title>
    <script src="ckeditor/ckeditor.js"></script>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back"); ?></a>
    <?php
      if(!$upload){
    ?>
      <form action="sendsite.php" method="post">
        <?php echo $U->getLang("admin.edit.name") ?><input name="N" <?php if($edit){echo "value='".$_GET["SiteName"]."' readonly";} ?>/><br />
        <?php echo $U->getLang("admin.edit.content") ?>
        <textarea id="editor" name="C">
        <?php
          if($edit){
            if(!isset($U->contentHandlers[$_GET["Type"]]["HTML"]) || $U->contentHandlers[$_GET["Type"]]["HTML"] == True){
              echo htmlspecialchars_decode($html);
            }else{
              echo $html;
            }
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
        <input type="hidden" name="Type" value="<?php echo $_GET["Type"]; ?>"/>
        <br /><button type="submit"><?php echo $U->getLang("admin.send"); ?></button>
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
    <?php
      }elseif(!$edit){
    ?>
        <h1><?php echo $U->getLang("admin.edit.upload"); ?></h1>
        <form action="uploadFile.php" method="post" enctype="multipart/form-data" enctype="multipart/form-data">
          <input type="hidden" name="Type" value="<?php echo $_GET["Type"];?>" />
          <input type="file" name="File" /><br />
          Online:<input type="radio" name="online" value="1" /><br />
          Offline:<input type="radio" name="online" value="0" checked/>
          <br /><button type="submit"><?php echo $U->getLang("admin.send"); ?></button>
        </form>
    <?php
      }else{
    ?>
        <h1><?php echo $U->getLang("admin.edit.upload.edit"); ?></h1>
    <?php
      }
    ?>
    </body>
  </html>
<?php
  }else{
    header("Location: ./index.php");
  }
?>