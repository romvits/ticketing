<?php
header("Content-Type: text/plain");
set_time_limit(0);

$output = "dist/src/public/admin/libs/dhtmlx/";
$output_skins = $output . "";
$output_codebase = $output . "";

$compiler = "java -jar " . __DIR__ . "/yui.jar";

$copyright = @file_get_contents(__DIR__ . "/conf/copyright") . "\n\n";

$skins = array (
	"material" 
);
if (!file_exists($output_skins)) mkdir($output_skins, 0777, true);
if (!file_exists($output_codebase)) mkdir($output_codebase, 0777, true);

$fname = trim(file_get_contents(__DIR__ . "/conf/compressed_filename"));

$debug = (preg_match("/--debug=true/", @$argv[1]) > 0) || (@$_REQUEST["debug"] == "y");

// js
print_r("\ncompress js\n" . str_repeat("-", 80) . "\n");

$stat = array (
	"stat_js"=>$fname . ".js",
	"stat_depr"=>$fname . "_deprecated.js" 
);

foreach ($stat as $st => $output) {
	
	$content = "";
	// list of files
	$files = array_values(array_map("trim", array_diff(explode("\n", file_get_contents(__DIR__ . "/conf/" . $st)), array (
		"" 
	))));
	for ($q = 0; $q < count($files); $q++) {
		if (file_exists(__DIR__ . "/../" . $files[$q]) && !is_dir(__DIR__ . "/../" . $files[$q])) $content .= file_get_contents(__DIR__ . "/../" . $files[$q]) . "\n";
	}
	
	// compress
	if (strlen($content) > 0) {
		
		$name = $output_codebase . $output;
		
		file_put_contents("temp.js", $content);
		exec($compiler . ' --type js temp.js -o "' . $name . '"');
		unlink("temp.js");
		
		// copyright
		file_put_contents($name, $copyright . file_get_contents($name));
		
		//
		print_r(sprintf("%10s bytes", number_format(filesize($output_codebase . $output))) . str_repeat(" ", 4) . $output_codebase . $output . "\n");
	}
	
	// debug
	if ($debug == true && $st == "stat_js") {
		
		$output_d = $output_codebase . $fname . "_debug.js";
		
		file_put_contents($output_d, $content);
		print_r(sprintf("%10s bytes", number_format(filesize($output_d))) . str_repeat(" ", 4) . $output_d . "\n");
	}
}

// js copy only
$files = array_values(array_map("trim", array_diff(explode("\n", file_get_contents(__DIR__ . "/conf/stat_copy")), array (
	"" 
))));

if (count($files) > 0) {
	print_r("\njs copy only\n" . str_repeat("-", 80) . "\n");
}

for ($q = 0; $q < count($files); $q++) {
	$d = explode("\t", $files[$q]); // path->file
	if (file_exists(__DIR__ . "/../" . $d[0] . $d[1]) && !is_dir("../" . $d[0] . $d[1])) {
		// create dirs if any
		$k = $output_codebase;
		$p = pathinfo($d[1]);
		if ($p["dirname"] != ".") {
			$f = explode("/", $p["dirname"]);
			for ($w = 0; $w < count($f); $w++) {
				$k .= "/" . $f[$w];
				if (!file_exists($k)) mkdir($k);
			}
		}
		$k .= "/" . $p["basename"];
		@copy(__DIR__ . "/../" . $d[0] . $d[1], $k);
		
		print_r(sprintf("%10s bytes", number_format(filesize($k))) . str_repeat(" ", 4) . $k . "\n");
	}
}

// css

// read content
$content = array ();
$files = array_values(array_map("trim", explode("\n", file_get_contents(__DIR__ . "/conf/stat_css"))));
for ($q = 0; $q < count($files); $q++) {
	// detect skin
	$path = pathinfo($files[$q]);
	preg_match("/[a-z]*$/", $path["filename"], $m);
	if (isset($m[0]) && in_array($m[0], $skins)) {
		if (!isset($content[$m[0]])) $content[$m[0]] = "";
		$content[$m[0]] .= file_get_contents(__DIR__ . "/../" . $files[$q]);
	}
}

if (count($content) > 0) {
	print_r("\ncompress css\n" . str_repeat("-", 80) . "\n");
}

// compress
for ($q = 0; $q < count($skins); $q++) {
	
	// prepare dir
	if (!isset($content[$skins[$q]])) continue;
	$output = $output_skins . $skins[$q];
	if (!file_exists($output)) mkdir($output);
	$output .= "/" . $fname . ".css";
	
	// replace ../imgs/
	$a = str_replace(__DIR__ . "/../imgs/", "imgs/", $content[$skins[$q]]);
	
	// compress
	file_put_contents("temp.css", $a);
	exec($compiler . ' --type css temp.css -o "' . $output . '"');
	
	$css_data = file_get_contents($output);
	
	// postprocessing for IE
	$s1 = array (
		",M12",
		",M21",
		",M22",
		",sizingMethod" 
	);
	$s2 = array (
		", M12",
		", M21",
		", M22",
		", sizingMethod" 
	);
	$css_data = str_replace($s1, $s2, $css_data);
	
	// copyright
	$css_data = $copyright . $css_data;
	
	file_put_contents($output, $css_data);
	
	//
	print_r(sprintf("%10s bytes", number_format(filesize($output))) . str_repeat(" ", 4) . $output . "\n");
	
	// debug/clear
	if ($debug == true) {
		$debug_name = $output_skins . $skins[$q] . "/" . $fname . "_debug.css";
		rename("temp.css", $debug_name);
		print_r(sprintf("%10s bytes", number_format(filesize($debug_name))) . str_repeat(" ", 4) . $debug_name . "\n");
	} else {
		unlink("temp.css");
	}
}

// images
// print_r("\n\ncopy images\n".str_repeat("-",80)."\n");

$d = opendir(__DIR__ . "/../");
if ($d !== false) {
	while (false != ($f = readdir($d))) {
		if (!in_array($f, array (
			".",
			"..",
			"libCompiler" 
		))) {
			$from = __DIR__ . "/../" . $f . "/codebase/imgs";
			if (file_exists($from)) copy_images($from, $output_skins);
		}
	}
	closedir($d);
}
function copy_images($from, $to, $skin_found = false) {
	global $skins;
	$d = opendir($from);
	if ($d !== false) {
		while (false !== ($f = readdir($d))) {
			$arr = array (
				".",
				".." 
			);
			if (!in_array($f, $arr)) {
				if (!$skin_found) {
					if (is_dir($from . "/" . $f)) {
						preg_match("/[a-z]*$/", $f, $m);
						if (isset($m[0]) && in_array($m[0], $skins)) {
							$skin_dirs = array (
								$m[0],
								"imgs",
								$f 
							);
							$skin_dir = $to;
							/*
							for ($q = 0; $q < count($skin_dirs); $q++) {
								$skin_dir .= "/" . $skin_dirs[$q];
								if (!file_exists($skin_dir)) mkdir($skin_dir);
							}
							*/
							$skin_dir = $skin_dir . "imgs/dhxlayout_material/";
							@mkdir($skin_dir, 0777, true);
							copy_dir($from . "/" . $f, $skin_dir, true);
						}
					}
				}
			}
		}
		closedir($d);
	}
}
function copy_dir($from, $to, $skin_found = false) {
	global $skins;
	$d = opendir($from);
	if ($d !== false) {
		while (false !== ($f = readdir($d))) {
			if (!in_array($f, array (
				".",
				".." 
			))) {
				if (!$skin_found) {
					if (is_dir($from . "/" . $f)) {
						// detect skin
						preg_match("/[a-z]*$/", $f, $m);
						if (isset($m[0]) && in_array($m[0], $skins)) {
							// skin detected, create dest dir
							$skin_dirs = array (
								$m[0],
								"imgs",
								$f 
							);
							$skin_dir = $to;
							for ($q = 0; $q < count($skin_dirs); $q++) {
								$skin_dir .= "/" . $skin_dirs[$q];
								if (!file_exists($skin_dir)) mkdir($skin_dir);
							}
							copy_dir($from . "/" . $f, $skin_dir, true);
						}
					}
				} else {
					if (is_dir($from . "/" . $f)) {
						if (!file_exists($to . "/" . $f)) mkdir($to . "/" . $f);
						copy_dir($from . "/" . $f, $to . "/" . $f, true);
					} else {
						copy($from . "/" . $f, $to . "/" . $f);
					}
				}
			}
		}
		closedir($d);
	}
}

// copy web skin to codebase (default skin)
if (file_exists(__DIR__ . "/../../skins/material")) {
	copy_dir(__DIR__ . "/../../skins/material", $output_codebase, true);
}

print_r("\n\n");

?>