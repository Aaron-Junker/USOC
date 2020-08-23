<?php
  /**
  * This file contains the header for all files.
  * @licence https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source licence
  */
?>
<header>
  <a id="skipnavigation" href="<?php echo $_SERVER["PHP_SELF"];
  if(isset($_GET["URL"])){
    echo "?URL=".$_GET["URL"];
  }?>#maincontent">Skip navigation </a>
  <a href="index.php" id="headerlink"><img src="logo.png" height="100" alt="Logo" /><h1><?php echo getSetting("site.name") ?></h1></a>
  <br />
  <div style="border-top: 1px;border-top-style:solid;border-top-color:black;">
    <ul id="menu">
      <li class="menuitem"><a href="page.php?URL=index">Home</a></li>
      <li class="menuitem"><a href="blogsite.php">Blog</a></li>
      <li class="menuitem dropdown">
        <a href="javascript:void(0)" class="dropbtn">Sites</a>
        <div class="dropdown-content">
          <a href="page.php?URL=Site1"  class="dropdownlink">Site1</a><br />
          <a href="page.php?URL=Site2" class="dropdownlink">Site2</a><br />
          <a href="page.php?URL=Site3" class="dropdownlink">Site3</a>
        </div>
      </li>
      <?php
        include_once "phpapi/getsettings.php";
        if(!function_exists("register_open")){
          function register_open(){
            if(getSetting("login.register_open")=="1"){
              return True;
            }
            return False;
          }
        }
        if(session_status() == PHP_SESSION_NONE){
          session_start();
        }
        if(isset($_SESSION["User_ID"])){
          echo '<li class="menuitem dropdown" style="float:right;"><a class="dropbtn" href="javascript:void(0)">'.$_SESSION["User_Name"].'</a><div style="right:0.5%;" class="dropdown-content"><a href="changepassword.php" onmouseover="menuhover()" class="dropdownlink">Passwort wechseln</a><br /><a href="profil.php" onmouseover="menuhover()" class="dropdownlink">Profileinstellungen</a><br /><a href="logout.php" onmouseover="menuhover()" class="dropdownlink">Ausloggen</a></div></li>';
          if(isset($_SESSION["Admin"])){
            echo '<li class="menuitem dropdown" style="float:right;"><a class="dropbtn" href="https://admin.casegames.ch">Adminbereich</a>';
            if(isset($_GET["URL"])&&preg_match('/(page)/i',$_SERVER["PHP_SELF"])){
                echo '<div class="dropdown-content"><a onmouseover="menuhover()" class="dropdownlink" href="adminbg/index.php?URL=editor&SiteName='.$_GET["URL"].'">Seite bearbeiten</a></div>';
              }elseif(isset($_GET["URL"])&&preg_match('/(blog)/i',$_SERVER["PHP_SELF"])){
                echo '<div class="dropdown-content"><a onmouseover="menuhover()" class="dropdownlink" href="adminbg/index.php?URL=blogeditor&SiteName='.$_GET["URL"].'">Seite bearbeiten</a></div>';
              }
              echo "</li>";
          }
        }else{
          echo '<li class="menuitem" style="float:right;"><a href="login.php">Login</a></li>';
          if(register_open()){
            echo '<li class="menuitem" style="float:right;"><a href="register.php">Registrieren</a></li>';
          }
        }
      ?>
    </ul>
  </div>
</header>
<div id="maincontent"></div>
