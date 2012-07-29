<?php
$locale = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if (isset($_REQUEST['lang'])) $locale = $_REQUEST['lang'];

define('LOCALE', $locale);

$i18n_file = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'i18n' . DIRECTORY_SEPARATOR . $locale . '.json';

if (file_exists($i18n_file)) {
	$lang = json_decode(file_get_contents($i18n_file));
}

function __($i18n) {
	global $lang;
	return isset($lang->$i18n) ? $lang->$i18n : $i18n;
}
?>