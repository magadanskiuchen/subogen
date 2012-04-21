<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename=' . preg_replace('/\.[^\.]+$/', '.srt', $_POST['subtitleFileName']));
	
	$output = preg_replace('~<br[\s]?/>~ium', "\n\r", iconv('UTF-8', 'UTF-16LE', $_POST['subtitleOutput']));
	echo chr(255).chr(254).$output;
	exit;
}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<title>Subtitle Creator</title>
	<link rel="stylesheet" type="text/css" href="style.css" />
	<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="js/func.min.js"></script>
</head>
<body>
	<div id="leftCol" class="col">
		<select id="subtitleList" multiple="multiple"></select>
		
		<div class="row">
			<button id="loadVideoButton" type="button">Video</button>
			<input id="videoContainer" class="fileContainer" type="file" data-for="loadVideoButton" />
			
			<button id="loadSubtitlesButton" type="button">Subtitles</button>
			<input id="subtitlesContainer" class="fileContainer" type="file" data-for="loadSubtitlesButton" />
			
			<button id="srt" type="button">SRT</button>
		</div>
	</div>
	
	<div id="rightCol" class="col">
		<video id="player" preload="preload" controls="controls" poster="poster.png"></video>
		
		<div class="row">
			<div id="progressBar">
				<div id="progressComplete">0</div>
			</div>
		</div>
	</div>
	
	<div class="hidden">
		<form action="" method="post" enctype="multipart/form-data">
			<textarea id="subtitleOutput" name="subtitleOutput"></textarea>
			<input type="hidden" id="subtitleFileName" name="subtitleFileName" />
		</form>
	</div>
</body>
</html>