<?php
define('LANG', 'en_US');

function __($i18n) {
	return isset($lang[LANG]->$i18n) ? $lang[LANG]->$i18n : $i18n;
}
?>