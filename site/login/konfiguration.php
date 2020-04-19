<?php
// die Konstanten auslagern in eigene Datei
// die dann per require_once ('konfiguration.php');
// geladen wird.

// Damit alle Fehler angezeigt werden
error_reporting(E_ALL);

// Zum Aufbau der Verbindung zur Datenbank
// die Daten erhalten Sie von Ihrem Provider
define ( 'MYSQL_HOST',      'arutipod.mysql.db.internal' );

// bei XAMPP ist der MYSQL_Benutzer: root
define ( 'MYSQL_BENUTZER',  'arutipod_rot' );
define ( 'MYSQL_KENNWORT',  'ichliebedomisdatenbank' );
// für unser Bsp. nennen wir die DB adressverwaltung
define ( 'MYSQL_DATENBANK', 'arutipod_casegames' );
?>
