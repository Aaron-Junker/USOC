<?php
  /**
  * This file contains the head tag for all files.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  if(file_exists("configuration.php")){
    include_once "configuration.php";
    include_once "includes/class.inc.php";
  }else {
    include_once "../configuration.php";
    include_once "../includes/class.inc.php";
  }
  newClass();
?>

<meta charset="<?php echo $U->getLang("lang.charset"); ?>">
<title><?php echo $U->getSetting("site.name"); ?></title>
<?php
  // Dark/Light mode switch
  if(isset($_COOKIE["css"])){
    if($_COOKIE["css"] == "l"){
      echo '<'.$USOC["DOMAIN"].'/styles/'.$U->getSetting("style.light.filename").'" type="text/css" />';
    }elseif ($_COOKIE["css"] == "d") {
      echo '<link rel="stylesheet" href="'.$USOC["DOMAIN"].'/styles/'.$U->getSetting("style.dark.filename").'" type="text/css" />';
    }else{
    echo '<link rel="stylesheet" href="'.$USOC["DOMAIN"].'/styles/'.$U->getSetting("style.light.filename").'" type="text/css" />';
    }
  }else{
    echo '<link rel="stylesheet" href="'.$USOC["DOMAIN"].'/styles/'.$U->getSetting("style.light.filename").'" type="text/css" />';
  }
?>

<script>
  function switchdark(c){
    document.cookie = "css=" + c;
    location.reload();
  }
  // Checks if javascript is enabled
  document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementsByClassName("noscript")[0].style ="display:none;"
    document.getElementsByTagName("header")[0].style ="display:block;"
    document.getElementsByTagName("footer")[0].style ="display:block;"
    document.getElementsByTagName("article")[0].style ="display:block;"
  })
</script>

<style type="text/css">
  header, footer, article {
    display: none;
  }
  .noscript {
    display: block;
  }
</style>

<script>
  window.addEventListener('storage', () => {
    if(localStorage.getItem('LogOut') == "1"){
      location.href = "<?php echo $USOC["DOMAIN"]; ?>/logout.php";
    }
  });
</script>

<!-- Meta data -->
<meta name="author" content="<?php echo $U->getSetting("site.author"); ?>">
<meta name="description" content="<?php echo $U->getSetting("site.description"); ?>">
<meta name="keywords" content="<?php echo $U->getSetting("site.keywords"); ?>">
<meta http-equiv="content-language" content="<?php echo $U->getSetting("site.lang"); ?>">
<meta name="robots" content="<?php echo $U->getSetting("site.robots"); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">