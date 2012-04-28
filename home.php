<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename=' . preg_replace('/\.[^\.]+$/', '.srt', $_POST['fileName']));
	
	$output = preg_replace('~<br[\s]?/>~ium', "\n\r", iconv('UTF-8', 'UTF-16LE', $_POST['subData']));
	echo chr(255).chr(254).$output;
	exit;
}

?>
<!DOCTYPE html>
<!--
http://www.w3.org/TR/2011/WD-html5-20110113/video.html
http://www.w3.org/TR/FileAPI/
http://www.htmlfivewow.com/
-->
<html>
<head>
	<meta charset="utf-8" />
	<title>Multimedia Web App</title>
	<link rel="stylesheet" type="text/css" href="home.css" />
	<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="js/home.js"></script>
</head>
<body>
	<video id="videoPlayer" controls="controls"></video>
	<p class="sub-preview"></p>
	
	<div id="grid">
		<table>
			<thead>
				<tr>
					<th>Subtitle</th>
					<th class="time">Start Time</th>
					<th class="time">End Time</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	
	<form id="controls" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
		<div class="subtitleControls">
			<a href="#" class="start" title="Start">Start</a>
			<a href="#" class="stop" title="Stop">Stop</a>
			<a href="#" class="stop-start" title="Stop/Start">Stop/Start</a>
		</div>
		
		<div class="fileControls">
			<input type="file" id="subtitlesFile" class="text" name="subtitles_file" />
			<input type="file" id="videoFile" class="video" name="video_file" />
			
			<input type="hidden" id="subData" name="subData" value="" />
			<input type="hidden" id="fileName" name="fileName" value="" />
			<input type="submit" class="button" value="Save SRT" />
		</div>
	</form>
</body>
</html>