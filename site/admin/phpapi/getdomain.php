<?php
    function getHostSplitted() {
        $matches = array();
        if (substr_count($_SERVER['HTTP_HOST'], '.')==1) {
            preg_match('/^(?P<d>.+)\.(?P<tld>.+?)$/', $_SERVER['HTTP_HOST'], $matches);
        } else {
            preg_match('/^(?P<sd>.+)\.(?P<d>.+?)\.(?P<tld>.+?)$/', $_SERVER['HTTP_HOST'], $matches);
        }
        return array(0=>(isset($matches['sd'])?$matches['sd']:''), 1=>$matches['d'], 2=>$matches['tld']);
    }

    function getSubdomain() {
        list($subdomain) = getHostSplitted();
        return $subdomain;
    }

    function getHost() {
        list(,$host) = getHostSplitted();
        return $host;
    }

    function getTld() {
        list(,,$tld) = getHostSplitted();
        return $tld;
    }
    function getDomain() {
      if(getSubdomain() != ""){
        return 'https://'.getSubdomain().'.'.getHost().'.'.getTld();
      }else{
        return 'https://'.getHost().'.'.getTld();
      }
    }
?>
