<header>
<a id="skipnavigation" href="<?php echo $_SERVER["PHP_SELF"];
if(isset($_GET["URL"])){echo "?URL=".$_GET["URL"];}?>#maincontent">Skip navigation </a>
  <a href="index.php" id="headerlink"><img src="Caselogo.png" height="100" alt="Case Games Logo" /><h1>Case Games</h1></a>
<br />
<div style="border-top: 1px;border-top-style:solid;border-top-color:black;">
<ul id="menu">
 <li class="menuitem"><a href="index.php">Home</a></li>
 <li class="menuitem"><a href="blogsite.php">Blog</a></li>
 <li class="menuitem dropdown">
  <a href="javascript:void(0)" class="dropbtn">Unsere Projekte</a>
  <div class="dropdown-content">
    <a href="page.php?URL=minecraft_simpler_textures" onmouseover="menuhover()" class="dropdownlink">Minecraft Simpler Textures</a><br />
    <a href="page.php?URL=creturres" onmouseover="menuhover()" class="dropdownlink">Creturres</a><br />
    <a href="page.php?URL=Case Games Standards" onmouseover="menuhover()" class="dropdownlink">Case Games Standards</a>
  </div>
</li>
 <li class="menuitem"><a href="page.php?URL=über_uns">Über uns</a></li>
 <li class="menuitem"><a href="mailto:support@casegames.ch">Kontakt</a></li>

 <?php
 include_once "phpapi/getsettings.php";
 if(!function_exists("register_open")){
   function register_open(){
     if(getSetting("login.register_open")=="1"){
       return True;
     }else{
       return False;
     }
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
<script src="siteelements/css.js"></script>
</header>
<div id="maincontent"></div>
