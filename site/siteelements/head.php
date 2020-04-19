<base href="https://casegames.ch">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WCZQPLD');</script>
<!-- End Google Tag Manager -->
<meta charset="utf-8">
<title>Case Games</title>
<?php
  if(isset($_COOKIE["css"])){
    if($_COOKIE["css"] == "l"){
      echo '<link rel="stylesheet" href="css.css" type="text/css" />';
    }elseif ($_COOKIE["css"] == "d") {
      echo '<link rel="stylesheet" href="cssblack.css" type="text/css" />';
    }else{
      echo '<link rel="stylesheet" href="css.css" type="text/css" />';
    }
  }else{
    echo '<link rel="stylesheet" href="css.css" type="text/css" />';
  }
?>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-158033026-1"></script>
<script src="https://apis.google.com/js/platform.js"></script>

<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-158033026-1');
</script>
<script>
  function switchdark(c){
    document.cookie = "css=" + c;
    location.reload();
  }
</script>
<meta name="author" content="Aaron Junker">
<meta name="description" content="Case Games Internetseite">
<meta name="keywords" content="Case, Games,games,Case">
<meta name="page-type" content="Produktinfo">
<meta http-equiv="content-language" content="de">
<meta name="robots" content="index, follow">
<link rel="manifest" href="manifest.json">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
