<footer>
  <!-- Footerfile for include -->
  <?php
    if(isset($_COOKIE["css"])){
      if($_COOKIE["css"] == "l"){
        echo '<a href="javascript:switchdark('."'d'".')">Darkmode</a></p>';
      }elseif($_COOKIE["css"] == "d"){
        echo '<a href="javascript:switchdark('."'l'".')">Lichtmodus</a></p>';
      }else{
        echo '<a href="javascript:switchdark('."'d'".')">Darkmode</a></p>';
      }
    }else{
      echo '<a href="javascript:switchdark('."'d'".')">Darkmode</a></p>';
    }

  ?>
</footer>
