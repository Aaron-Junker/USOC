<?php
  /**
  * This file contains the header for all displayed pages.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  if(!isset($amp)){
    $amp = False;
  }
  if(!isset($raw)){
    $raw = False;
  }
?>
<header>
  <!-- Skip navigation for accesibility -->
  <a id="skipnavigation" href="<?php echo $_SERVER["PHP_SELF"];
  if(isset($_GET["URL"])){
    echo "?URL=".$_GET["URL"];
  }?>#maincontent"><?php $U->getLang("accessibility.skipnavigation"); ?></a>

  <!-- Logo -->
  <a href="<?php echo $USOC["DOMAIN"]; ?>/index.php" id="headerlink"><<?php if($amp){echo"amp-";};?>img src="<?php echo $USOC["DOMAIN"]; ?>/images/logo.png" height="100" width="200" alt="Logo"></<?php if($amp){echo"amp-";};?>img><h1><?php echo $U->getSetting("site.name") ?></h1></a>
  <br />
  <div style="border-top: 1px;border-top-style:solid;border-top-color:black;">
    <!-- Menu -->
    <ul id="menu">
      <li class="menuitem"><a href="<?php echo $USOC["DOMAIN"]; ?>/page.php?URL=index">Home</a></li>
      <li class="menuitem"><a href="<?php echo $USOC["DOMAIN"]; ?>/blogsite">Blog</a></li>
      <li class="menuitem dropdown">
        <a class="dropbtn" href="">Sites</a>
        <div class="dropdown-content">
          <a href="<?php echo $USOC["DOMAIN"]; ?>/Site1"  class="dropdownlink">Site1</a><br />
          <a href="<?php echo $USOC["DOMAIN"]; ?>/Site2" class="dropdownlink">Site2</a><br />
          <a href="<?php echo $USOC["DOMAIN"]; ?>/=Site3" class="dropdownlink">Site3</a>
        </div>
      </li>
      <!-- Login links on the right side -->
      <?php
        if(session_status() == PHP_SESSION_NONE){
          session_start();
        }
        if(isset($_SESSION["User_ID"])){
        ?>
          <li class="menuitem dropdown" style="float:right;">
          <a class="dropbtn" href=""><?php echo $_SESSION["User_Name"]; ?></a>
          <div style="right:0.5%;" class="dropdown-content">
        <?php
          if($U->getSetting("login.changepassword") == "1" && $U->userHasPermission("Profile", "Change_password")){
        ?>
            <a href="<?php echo $USOC["DOMAIN"]; ?>/changepassword.php" class="dropdownlink"><?php echo $U->getLang("login.changepass"); ?></a><br />
        <?php
          }
          if($U->userHasPermission("Profile")){
        ?>
            <a href="<?php echo $USOC["DOMAIN"]; ?>/profile.php" class="dropdownlink"><?php echo $U->getLang("profile.settings"); ?></a><br />
        <?php
          }
        ?>
        <a href="<?php echo $USOC["DOMAIN"]; ?>/logout.php" class="dropdownlink"><?php echo $U->getLang("login.logout.action"); ?></a></div></li>
        <?php
          if($U->userHasPermission("Backend")){
            echo '<li class="menuitem dropdown" style="float:right;"><a class="dropbtn" href="'.$USOC["ADMIN_PATH"].'">'.$U->getLang("admin").'</a>';
            if(isset($_GET["URL"]) && preg_match('/(page)/i',$_SERVER["PHP_SELF"])){
              echo '<div class="dropdown-content"><a class="dropdownlink" href="'.$USOC["ADMIN_PATH"].'/index.php?URL=editor&SiteName='.$_GET["URL"].'">'.$U->getLang("admin.edit.site").'</a></div>';
            }elseif(isset($_GET["URL"]) && preg_match('/(blog)/i',$_SERVER["PHP_SELF"])){
              echo '<div class="dropdown-content"><a class="dropdownlink" href="'.$USOC["ADMIN_PATH"].'/index.php?URL=blogeditor&SiteName='.$_GET["URL"].'">'.$U->getLang("admin.edit.site").'</a></div>';
            }
            echo "</li>";
          }
        }else{
          if($U->getSetting("login.login_open") == "1"){
            echo '<li class="menuitem" style="float:right;"><a href="'.$USOC["DOMAIN"].'/login.php">'.$U->getLang("login.g").'</a></li>';
          }
          if($U->isRegisterOpen()){
            echo '<li class="menuitem" style="float:right;"><a href="'.$USOC["DOMAIN"].'/register.php">'.$U->getLang("register.g").'</a></li>';
          }
        }
      ?>
    </ul>
  </div>
</header>
<!-- body if JavaScript is disabled -->
<div class="noscript">
  <h1>Please activate JavaScript</h1>
  <p>This website don't work without JavaScript</p>
</div>
<div id="maincontent"></div>
