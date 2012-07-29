<?php require_once(dirname(__FILE___) . '/functions.php'); ?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0" />
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<title>Subogen</title>
	
	<link rel="stylesheet" type="text/css" href="style.css" />
	
	<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="js/api.js"></script>
	<script type="text/javascript" src="js/func.js"></script>
</head>
<body>

<div id="wrapper">
	<video id="player" controls="controls"></video>
	
	<form action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
		<a id="load-video-link" class="button" href="#"><?php echo __('Load Video'); ?></a>
		<a id="load-subtitles-link" class="button" href="#"><?php echo __('Load Subtitles'); ?></a>
		<a id="load-video-from-youtube" class="button" href="#"><?php echo __('Load Video from YouTube'); ?></a>
		<a id="set-start" class="button" href="#"><?php echo __('Set Start'); ?></a>
		<a id="set-stop" class="button" href="#"><?php echo __('Set Stop'); ?></a>
		
		<input type="submit" id="save" class="button" value="<?php echo __('Save SRT'); ?>" />
		<a id="save-to-youtube" class="button" href="#"><?php echo __('Save Subtitles to YouTube'); ?></a>
		<a id="change-font" class="button" href="#"><?php echo __('Change Font'); ?></a>
		<a id="help" class="button" href="#"><?php echo __('Help'); ?></a>
		<a id="set-stop-start" class="button" href="#"><?php echo __('Set Stop/Start'); ?></a>
		
		<input type="file" id="load-video" class="button" name="load_video" />
		<input type="file" id="load-subtitles" class="button" name="load_subtitles" />
	</form>
</div>

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

<script type="text/javascript">
window.home = '<?php echo $_SERVER['REQUEST_URI']; ?>';
</script>
</body>
</html>