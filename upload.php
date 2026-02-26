<?php
// Set the target directory to your preferred name
$target_dir = "patches/"; 
$manifest_file = $target_dir . "manifest.json";

// Create the directory if it doesn't exist (failsafe)
if (!file_exists($target_dir)) { 
    mkdir($target_dir, 0755, true); 
}

$file = $_FILES["sysexFile"];
$userName = htmlspecialchars($_POST["userName"]);
$comments = htmlspecialchars($_POST["comments"]);
$filename = basename($file["name"]);
$target_path = $target_dir . $filename;

// Validation
$size = $file["size"];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
if (!in_array($ext, ['syx', 'mdx', 'mid'])) die("Error: Extension not allowed.");
if ($size != 8166 && $size != 210) die("Error: Invalid SysEx size.");
if (file_exists($target_path)) die("Error: File already exists.");

if (move_uploaded_file($file["tmp_name"], $target_path)) {
    // Read/Update Manifest
    $manifest = file_exists($manifest_file) ? json_decode(file_get_contents($manifest_file), true) : [];
    $manifest[$filename] = [
        "user" => $userName,
        "comments" => $comments,
        "date" => date("Y-m-d H:i"),
        "type" => ($size > 1000) ? "bank" : "single"
    ];
    file_put_contents($manifest_file, json_encode($manifest));
    echo "Success: $filename uploaded.";
} else {
    echo "Error: Upload failed.";
}
if (move_uploaded_file($file["tmp_name"], $target_path)) {
    // This successfully moves the file from PHP's temp storage to /patches/
    // and updates the manifest.json inside that same folder.
}
?>
