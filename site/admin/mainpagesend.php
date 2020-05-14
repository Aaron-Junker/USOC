<?php
if(isset($_POST["C"])){
  // fix path https://github.com/Case-Games/USOC/issues/13
  file_put_contents('', $_POST["C"]);
  echo "Erfolgreich";
}else{
  echo "Nicht alles ausgefüllt";
}
?>
