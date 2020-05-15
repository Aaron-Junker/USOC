<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Adminbereich - Seiten editieren</title>
    <script src="../ckeditor/ckeditor.js"></script>
  </head>
  	<body>
    	<a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage">Zurück</a>
		<form action="mainpagesend.php" method="post">
		<textarea id="editor">
      <?php
      // fix link
        echo file_get_contents('*');
      ?>
    </textarea>
        <br /><button type="submit" value="Absenden">Absenden</button>
		</form>
    <script>
    ClassicEditor
      .create( document.querySelector( '#editor' ) )
      .then( editor => {
      console.log( editor );
      } )
      .catch( error => {
      console.error( error );
      } );
    </script>
	</body>
</html>
