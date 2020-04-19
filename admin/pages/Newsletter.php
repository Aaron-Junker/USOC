<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Adminbereich - Seiten editieren</title>
    <script src="https://cdn.tiny.cloud/1/opn9s15j3xtusjx2716b9retal29jnhv2s9y7f4ypzbewy4x/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
  </head>
  	<body>
    	<a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage">Zurück</a>
		<form action="newslettersend.php" method="post">
		<textarea name="C" />
            <h1>Case Games Newsletter</h1>
        	<h2>Neuer Blogbeitrag!</h2>
            <h4>Name</h4>
            <div>Beschreibung</div>
            <a href="">link</a>

        </textarea>
        <br /><button type="submit" value="Absenden">Absenden</button>
		</form>
		<script>
    tinymce.init({
      selector: 'textarea',
      plugins: "link lists",
      contextmenu: "link numlist bullist",
      toolbar: "undo redo | styleselect | bold italic | link image | numlist bullist",
      width: 1200,
      height: 900,
    });
    </script>
	</body>
</html>
