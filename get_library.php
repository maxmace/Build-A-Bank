<?php
$dir = "patches/";
$manifest_path = $dir . "manifest.json";
header('Content-Type: application/json');

$manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];
$physical_files = array_diff(scandir($dir), array('..', '.', 'manifest.json'));

$changed = false;
foreach ($physical_files as $file) {
    if (!isset($manifest[$file])) {
        $size = filesize($dir . $file);
        $manifest[$file] = [
            "user" => "Admin/System",
            "comments" => "Manually added file",
            "date" => date("Y-m-d H:i", filemtime($dir . $file)),
            "created" => date("Y-m-d H:i", filectime($dir . $file)),
            "type" => ($size > 1000) ? "bank" : "single"
        ];
        $changed = true;
    }
}

if ($changed) { file_put_contents($manifest_path, json_encode($manifest)); }
echo json_encode($manifest);
?>
