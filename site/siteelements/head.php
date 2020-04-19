<!-- Headfile for include -->
<?php
include_once "phpapi/getsettings.php";
?>
<meta charset="utf-8">
<title><?php echo getSetting("site.name") ?></title>

<?php
  if(isset($_COOKIE["css"])){
    if($_COOKIE["css"] == "l"){
      echo '<link rel="stylesheet" href="css.php" type="text/css" />';
    }elseif ($_COOKIE["css"] == "d") {
      echo '<link rel="stylesheet" href="cssblack.php" type="text/css" />';
    }else{
      echo '<link rel="stylesheet" href="css.php" type="text/css" />';
    }
  }else{
    echo '<link rel="stylesheet" href="css.php" type="text/css" />';
  }
?>

<script>
  function switchdark(c){
    document.cookie = "css=" + c;
    location.reload();
  }
</script>
<meta name="author" content="<?php echo getSetting("site.author") ?>">
<meta name="description" content="<?php echo getSetting("site.description") ?>">
<meta name="keywords" content="<?php echo getSetting("site.keywords") ?>">
<meta http-equiv="content-language" content="<?php echo getSetting("site.lang") ?>">
<meta name="robots" content="<?php echo getSetting("site.robots") ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
