<?php
$dir = "patches/";
$manifest_path = $dir . "manifest.json";
header('Content-Type: application/json');

function get_sq80_names($filePath) {
    if (!file_exists($filePath)) return [];
    $data = file_get_contents($filePath);
    $bytes = unpack("C*", $data);
    $bytes = array_values($bytes);
    $raw_bytes = [];
    
    // Standard Ensoniq nibble decoding (Keeping your original logic)
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
            $name .= ($char_code >= 32 && $char_code <= 126) ? chr($char_code) : " ";
        }
        $names[] = trim($name);
    }
    return $names;
}

$manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];
$physical_files = array_diff(scandir($dir), array('..', '.', 'manifest.json'));

$changed = false;
foreach ($physical_files as $file) {
    $fullPath = $dir . $file;
    
    // Index if file is new or missing the crucial patch_names array
    if (!isset($manifest[$file]) || !isset($manifest[$file]['patch_names'])) {
        $size = filesize($fullPath);
        
        // Preserve existing metadata if it exists, otherwise use defaults
        $existing = $manifest[$file] ?? [];
        
        $manifest[$file] = [
            "user" => $existing["user"] ?? "Admin/System",
            "comments" => $existing["comments"] ?? "Indexed Library File",
            "date" => date("Y-m-d H:i", filemtime($fullPath)),
            "original_date" => $existing["original_date"] ?? date("Y-m-d", filemtime($fullPath)),
            "created" => date("Y-m-d H:i", filectime($fullPath)),
            "type" => ($size > 1000) ? "bank" : "single",
            "patch_names" => get_sq80_names($fullPath)
        ];
        $changed = true;
    }
}

if ($changed) { 
    file_put_contents($manifest_path, json_encode($manifest, JSON_PRETTY_PRINT)); 
}
echo json_encode($manifest);
?>
