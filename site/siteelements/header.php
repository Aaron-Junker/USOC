<?php
  /**
  * This file contains the header for all files.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
?>
<header>
  <a id="skipnavigation" href="<?php echo $_SERVER["PHP_SELF"];
  if(isset($_GET["URL"])){
    echo "?URL=".$_GET["URL"];
  }?>#maincontent"><?php $U->getLang("accessibility.skipnavigation"); ?></a>
  <a href="<?php echo $USOC["DOMAIN"]; ?>/index.php" id="headerlink"><img src="<?php echo $USOC["DOMAIN"]; ?>/logo.png" height="100" alt="Logo" /><h1><?php echo $U->getSetting("site.name") ?></h1></a>
  <br />
  <div style="border-top: 1px;border-top-style:solid;border-top-color:black;">
    <ul id="menu">
      <li class="menuitem"><a href="<?php echo $USOC["DOMAIN"]; ?>/page.php?URL=index">Home</a></li>
      <li class="menuitem"><a href="<?php echo $USOC["DOMAIN"]; ?>/blogsite">Blog</a></li>
      <li class="menuitem dropdown">
        <a href="javascript:void(0)" class="dropbtn">Sites</a>
        <div class="dropdown-content">
          <a href="<?php echo $USOC["DOMAIN"]; ?>/page.php?URL=Site1"  class="dropdownlink">Site1</a><br />
          <a href="<?php echo $USOC["DOMAIN"]; ?>/page.php?URL=Site2" class="dropdownlink">Site2</a><br />
          <a href="<?php echo $USOC["DOMAIN"]; ?>/page.php?URL=Site3" class="dropdownlink">Site3</a>
        </div>
      </li>
      <?php

        if(!function_exists("isRegisterOpen")){
          function isRegisterOpen(){
            global $U;
            if($U->getSetting("login.register_open")=="0"  || isset($_SESSION["User_ID"]) || $U->getSetting("login.login_open") == "0"){
              return False;
            }
            return True;
          }
        }
        if(session_status() == PHP_SESSION_NONE){
          session_start();
        }
        if(isset($_SESSION["User_ID"])){
          echo '<li class="menuitem dropdown" style="float:right;"><a class="dropbtn" href="javascript:void(0)">'.$_SESSION["User_Name"].'</a><div style="right:0.5%;" class="dropdown-content"><a href="'.$USOC["DOMAIN"].'/changepassword.php" onmouseover="menuhover()" class="dropdownlink">'.$U->getLang("login.changepass").'</a><br /><a href="'.$USOC["DOMAIN"].'/profile.php" onmouseover="menuhover()" class="dropdownlink">'.$U->getLang("profile.settings").'</a><br /><a href="'.$USOC["DOMAIN"].'/logout.php" onmouseover="menuhover()" class="dropdownlink">'.$U->getLang("login.logout.action").'</a></div></li>';
          if(isset($_SESSION["Admin"])){
            if($_SESSION["Admin"] == True){
              echo '<li class="menuitem dropdown" style="float:right;"><a class="dropbtn" href="'.$USOC["ADMIN_PATH"].'">'.$U->getLang("admin").'</a>';
              if(isset($_GET["URL"])&&preg_match('/(page)/i',$_SERVER["PHP_SELF"])){
                  echo '<div class="dropdown-content"><a onmouseover="menuhover()" class="dropdownlink" href="'.$USOC["ADMIN_PATH"].'/index.php?URL=editor&SiteName='.$_GET["URL"].'">'.$U->getLang("admin.edit.site").'</a></div>';
                }elseif(isset($_GET["URL"])&&preg_match('/(blog)/i',$_SERVER["PHP_SELF"])){
                  echo '<div class="dropdown-content"><a onmouseover="menuhover()" class="dropdownlink" href="'.$USOC["ADMIN_PATH"].'/index.php?URL=blogeditor&SiteName='.$_GET["URL"].'">'.$U->getLang("admin.edit.site").'</a></div>';
                }
                echo "</li>";
            }
          }
        }else{
          if($U->getSetting("login.login_open") == "1"){
            echo '<li class="menuitem" style="float:right;"><a href="'.$USOC["DOMAIN"].'/login.php">'.$U->getLang("login.g").'</a></li>';
          }
          if(isRegisterOpen()){
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
