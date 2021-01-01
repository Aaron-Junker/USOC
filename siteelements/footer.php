<?php
  /**
  * This file contains the footer for all files.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
?>
<footer>
  <?php
    // Switch between light- and darkmode
    if(isset($_COOKIE["css"])){
      if($_COOKIE["css"] == "l"){
        echo '<a href="javascript:switchdark('."'d'".')">'.$U->getLang("style.darkmode").'</a></p>';
      }elseif($_COOKIE["css"] == "d"){
        echo '<a href="javascript:switchdark('."'l'".')">'.$U->getLang("style.lightmode").'</a></p>';
      }else{
        echo '<a href="javascript:switchdark('."'d'".')">'.$U->getLang("style.darkmode").'</a></p>';
      }
    }else{
      echo '<a href="javascript:switchdark('."'d'".')">'.$U->getLang("style.darkmode").'</a></p>';
    }
  ?>
</footer>
