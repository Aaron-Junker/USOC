<?php
  header('Content-Type: text/css');
?>
* {
  font-family: sans-serif;;
}
html {
  background-color: white;
}
header{
  background-color: white;
  border-color: black;
  border-width: 1px;
  border-style: solid;
}
header a h1 {
  display: inline;
}
#headerlink{
	text-decoration:none; 
}
header a img {
  display: inline;
}
footer {
  border-top-color: black;
  border-top-width: 1px;
  border-top-style: solid;
  position: fixed;
  left: 1px;
  bottom: 0;
  width: 100%;
  color: black;
  text-align: left;
  background-color: white;
}
article {
  background-color:white;
  height: 100%;
  margin-bottom: 100px;
}
input[type=text],input[type=password],input[type=mail], select, textarea{
  width: 100%;
  padding: 12px;
  border: 1px solid #fff;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
  background-color: white;
}
input[type=submit], button {
  background-color: white;
  color: black;
  border: 1px solid #fff;
  cursor: pointer;
}
#headerlink{
  color: black;
}
ul#menu {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: white;
  color: black!important;
}

li.menuitem{
  float: left;
}

li.menuitem a {
  display: block;
  color: black;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
li.menuitem a:hover {
  background-color: black;
color: white;
}
.active_menu {
  background-color: #4CAF50;
}


li.menuitem a:hover, .dropdown:hover .dropbtn {
  background-color: black;
}

li.dropdown {
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  color:black
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {background-color: #f1f1f1;color:white}

.dropdown:hover .dropdown-content {
  display: block;
}
.dropbtn:hover{
color:white;
}
li.menuitem a, .dropbtn {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
.dropdownlink{
  color:black!important;

}
.dropdownlink:hover{
  color:white!important;

}
ul#menu li a{
  color:black!important;
}
ul#menu li a:hover{
  color:white!important;
}
ul#menu li.dropdown:hover a{
  color:white!important;
}
ul#menu li.dropdown:hover div a{
  color:black!important;
}
ul#menu li.dropdown:hover div a:hover{
  color:white!important;
}

#skipnavigation{
  left:-999px;
position:absolute;
top:auto;
width:1px;
height:1px;
overflow:hidden;
z-index:-999;
}
#skipnavigation:focus{
  color: #fff;
  left: auto;
  top: auto;
  width: 30%;
  height: auto;
  overflow:auto;
  margin: 10px 35%;
  padding:5px;
  text-align:center;
  font-size:1.2em;
  z-index:999;
}

.readmore{
background-color: white;
  color: black;
  border: 1px solid #fff;
  cursor: pointer;
  }
a,a:visited,a:hover{
  color: blue;
}
#error{
  position: relative;
  width: 96%;
  right: 2%;
  left: 2%;
  border: 2px solid black;
  background-color: red;
  color: orange;
}
@media screen and (max-width: 600px) {
  ul#menu li{
  float: none;
  }
  article p, article div, article a{
  	font-size:20pt;
  }
  article h3{
  font-size:26pt;
  }
  article h2{
  font-size:28pt;
  }
  article h1{
  font-size:30pt;
  }
  footer {
    position: relative;
  }
  footer a,footer p,footer div{
  font-size:18pt;
  text-align:left!important;
  }
  article{
  margin-bottom: 200px;
  }
  header a{
  font-size:20pt;
  }
  header img{
  display:none!important;
  }
  article{
    overflow: scroll;
  }
}
