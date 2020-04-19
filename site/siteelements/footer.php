<footer>
  <a href="impressum.php">Impressum</a><br />
  <a href="datenschutzerklärung.php">Datenschutzerklärung</a><br /><p style="text-align:center;">©2019-2020 Case Games
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
