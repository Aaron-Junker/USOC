<?php
if(isset($_POST["C"])){
  file_put_contents('../arutipod.myhostpoint.ch/indexinhalt.php', $_POST["C"]);
  echo "Erfolgreich";
}else{
  echo "Nicht alles ausgefüllt";
}
?>
