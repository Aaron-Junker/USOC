<?php
    /**
    * This file gets included by page.php for amp pages
    */
?>
<meta charset="<?php echo $U->getLang("lang.charset"); ?>">
<style amp-custom><?php echo"\n".file_get_contents("includes/AMP/css.css")."\n"; ?></style>
<script async src="https://cdn.ampproject.org/v0.js"></script>
<link rel="canonical" href="<?php echo $_SERVER["REQUEST_URI"]; ?>">
<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
<meta name="author" content="<?php echo $U->getSetting("site.author"); ?>">
<meta name="description" content="<?php echo $U->getSetting("site.description"); ?>">
<meta name="keywords" content="<?php echo $U->getSetting("site.keywords"); ?>">
<meta http-equiv="content-language" content="<?php echo $U->getSetting("site.lang"); ?>">
<meta name="robots" content="<?php echo $U->getSetting("site.robots"); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">