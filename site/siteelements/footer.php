<footer>
  <!-- Footerfile for include -->
  <?php
    if(isset($_COOKIE["css"])){
      if($_COOKIE["css"] == "l"){
        echo '<a href="javascript:switchdark('."'d'".')">'.getLang("style.darkmode").'</a></p>';
      }elseif($_COOKIE["css"] == "d"){
        echo '<a href="javascript:switchdark('."'l'".')">'.getLang("style.lightmode").'</a></p>';
      }else{
        echo '<a href="javascript:switchdark('."'d'".')">'.getLang("style.darkmode").'</a></p>';
      }
    }else{
      echo '<a href="javascript:switchdark('."'d'".')">'.getLang("style.darkmode").'</a></p>';
    }

  ?>
</footer>
