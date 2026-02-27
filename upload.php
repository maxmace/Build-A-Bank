<?php
// Set the target directory
$target_dir = "patches/"; 
$manifest_file = $target_dir . "manifest.json";

// Create the directory if it doesn't exist (failsafe)
if (!file_exists($target_dir)) { 
    mkdir($target_dir, 0755, true); 
}

// Check if request is valid
if (!isset($_FILES["sysexFile"])) {
    die("Error: No file provided.");
}

$file = $_FILES["sysexFile"];
$userName = htmlspecialchars($_POST["userName"]);
$comments = htmlspecialchars($_POST["comments"]);
$origDate = htmlspecialchars($_POST["origDate"]); // New field from modal
$filename = basename($file["name"]);
$target_path = $target_dir . $filename;

// Validation
$size = $file["size"];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
if (!in_array($ext, ['syx', 'mdx', 'mid'])) die("Error: Extension not allowed.");
if ($size != 8166 && $size != 210) die("Error: Invalid SysEx size.");
if (file_exists($target_path)) die("Error: File already exists.");

// Internal Helper: SQ-80 Name Extraction logic
function extract_sq80_names($filePath) {
    $data = file_get_contents($filePath);
    $bytes = array_values(unpack("C*", $data));
    $raw_bytes = [];
    
    // Standard Ensoniq nibble decoding
    // Logic: Skip 5 byte header, stop before 2 byte footer
    for ($i = 5; $i < count($bytes) - 2; $i += 2) {
        if (isset($bytes[$i+1])) {
            $raw_bytes[] = ($bytes[$i+1] << 4) | ($bytes[$i] & 0x0F);
        }
    }
    
    $names = [];
    $isBank = count($raw_bytes) >= 4080;
    $count = $isBank ? 40 : 1;
    
    for ($p = 0; $p < $count; $p++) {
        $name_chunk = array_slice($raw_bytes, $p * 102, 6);
        $name = "";
        foreach ($name_chunk as $char_code) {
            // Only allow printable ASCII
            $name .= ($char_code >= 32 && $char_code <= 126) ? chr($char_code) : " ";
        }
        $names[] = trim($name);
    }
    return $names;
}

if (move_uploaded_file($file["tmp_name"], $target_path)) {
    // 1. Extract internal names immediately after moving
    $patchNames = extract_sq80_names($target_path);

    // 2. Read/Update Manifest
    $manifest = file_exists($manifest_file) ? json_decode(file_get_contents($manifest_file), true) : [];
    
    $manifest[$filename] = [
        "user" => $userName,
        "comments" => $comments,
        "date" => date("Y-m-d H:i"),
        "original_date" => !empty($origDate) ? $origDate : "Unknown",
        "created" => date("Y-m-d H:i", filectime($target_path)),
        "type" => ($size > 1000) ? "bank" : "single",
        "patch_names" => $patchNames
    ];
    
    // Save with PRETTY_PRINT to keep manifest readable
    file_put_contents($manifest_file, json_encode($manifest, JSON_PRETTY_PRINT));
    
    echo "Success: $filename uploaded.";
} else {
    echo "Error: Upload failed.";
}
?>
