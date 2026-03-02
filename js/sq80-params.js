const SQ80_MAP = {
    waves: ["SAW", "BELL", "SINE", "SQUARE", "PULSE", "NOISE1", "NOISE2", "NOISE3", "BASS", "PIANO", "EL PNO", "VOICE1", "VOICE2", "KICK", "REED", "ORGAN", "SYNTH1", "SYNTH2", "SYNTH3", "FORMT1", "FORMT2", "FORMT3", "FORMT4", "FORMT5", "PULSE2", "SQR2", "4OCTS", "PRIME", "BASS2", "EPNO2", "OCTAVE", "OCT+5", "SAW2", "TRIANG", "REED2", "REED3", "GRIT1", "GRIT2", "GRIT3", "GLINT1", "GLINT2", "GLINT3", "CLAV", "BRASS", "STRING", "DIGIT1", "DIGIT2", "BELL2", "ALIEN", "BREATH", "VOICE3", "STEAM", "METAL", "CHIME", "BOWING", "PICK1", "PICK2", "MALLET", "SLAP", "PLINK", "PLUCK", "PLUNK", "CLICK", "CHIFF", "THUMP", "LOGDRM", "KICK2", "SNARE", "TOMTOM", "HI-HAT", "DRUMS1", "DRUMS2", "DRUMS3", "DRUMS4", "DRUMS5"],
    modulators: ["LFO1", "LFO2", "LFO3", "ENV1", "ENV2", "ENV3", "ENV4", "VEL", "VEL-X", "KBD", "KBD2", "WHEEL", "PEDAL", "XCTRL", "PRESS", "*OFF*"],
    lfo_waves: ["TRI", "SAW", "SQR", "NOI"],

    helpers: {
        getOctave: (v) => {
            const semi = v & 0x7F;
            if (semi < 12) return "-3"; if (semi < 24) return "-2"; if (semi < 36) return "-1";
            if (semi < 48) return "+0"; if (semi < 60) return "+1"; if (semi < 72) return "+2";
            if (semi < 84) return "+3"; if (semi < 96) return "+4"; return "+5";
        },
        getSemi: (v) => (v % 12).toString().padStart(2, '0'),
        neg63: (v) => {
            const val = v & 127;
            return val > 63 ? val - 128 : val;
        },
        formatWave: (idx) => idx <= 74 ? (SQ80_MAP.waves[idx] || "---") : "WAV" + idx.toString().padStart(3, '0'),
        formatLV: (v) => {
            const val = v & 127;
            return val <= 63 ? val.toString().padStart(2, '0') + 'L' : (val - 64).toString().padStart(2, '0') + 'X';
        },
        formatT4: (v) => {
            const val = v & 127;
            return val <= 63 ? val.toString().padStart(2, '0') : (val - 64).toString().padStart(2, '0') + 'R';
        }
    },

    pages: {
        // --- ROW 1 (3x3 Area) ---
        "OSC 1": [
            { label: "OCT", idx: 58, func: "getOctave" }, { label: "SEMI", idx: 58, func: "getSemi" }, { label: "FINE", idx: 59, transform: v => (v & 31) }, { label: "WAVE", idx: 63, func: "formatWave" }, { label: "---", idx: 255 },
            { label: "MOD1", idx: 60, type: "mod_low" }, { label: "AMOUNT1", idx: 61, func: "neg63" }, { label: "MOD2", idx: 60, type: "mod_high" }, { label: "AMOUNT2", idx: 62, func: "neg63" }, { label: "---", idx: 255 }
        ],
        "OSC 2": [
            { label: "OCT", idx: 67, func: "getOctave" }, { label: "SEMI", idx: 67, func: "getSemi" }, { label: "FINE", idx: 68, transform: v => (v & 31) }, { label: "WAVE", idx: 72, func: "formatWave" }, { label: "---", idx: 255 },
            { label: "MOD1", idx: 69, type: "mod_low" }, { label: "AMOUNT1", idx: 70, func: "neg63" }, { label: "MOD2", idx: 69, type: "mod_high" }, { label: "AMOUNT2", idx: 71, func: "neg63" }, { label: "---", idx: 255 }
        ],
        "OSC 3": [
            { label: "OCT", idx: 76, func: "getOctave" }, { label: "SEMI", idx: 76, func: "getSemi" }, { label: "FINE", idx: 77, transform: v => (v & 31) }, { label: "WAVE", idx: 81, func: "formatWave" }, { label: "---", idx: 255 },
            { label: "MOD1", idx: 78, type: "mod_low" }, { label: "AMOUNT1", idx: 79, func: "neg63" }, { label: "MOD2", idx: 78, type: "mod_high" }, { label: "AMOUNT2", idx: 80, func: "neg63" }, { label: "---", idx: 255 }
        ],

        // --- ROW 2 (3x3 Area) ---
        "DCA 1": [
            { label: "LEVEL", idx: 64, transform: v => v & 63 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "OUTPUT", idx: 58, transform: v => (v & 0x80) ? "OFF" : "ON" },
            { label: "MOD1", idx: 65, type: "mod_low" }, { label: "AMOUNT1", idx: 66, func: "neg63" }, { label: "MOD2", idx: 65, type: "mod_high" }, { label: "AMOUNT2", idx: 71, func: "neg63" }, { label: "---", idx: 255 }
        ],
        "DCA 2": [
            { label: "LEVEL", idx: 73, transform: v => v & 63 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "OUTPUT", idx: 67, transform: v => (v & 0x80) ? "OFF" : "ON" },
            { label: "MOD1", idx: 74, type: "mod_low" }, { label: "AMOUNT1", idx: 75, func: "neg63" }, { label: "MOD2", idx: 74, type: "mod_high" }, { label: "AMOUNT2", idx: 80, func: "neg63" }, { label: "---", idx: 255 }
        ],
        "DCA 3": [
            { label: "LEVEL", idx: 82, transform: v => v & 63 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "OUTPUT", idx: 76, transform: v => (v & 0x80) ? "OFF" : "ON" },
            { label: "MOD1", idx: 83, type: "mod_low" }, { label: "AMOUNT1", idx: 84, func: "neg63" }, { label: "MOD2", idx: 83, type: "mod_high" }, { label: "AMOUNT2", idx: 92, func: "neg63" }, { label: "---", idx: 255 }
        ],

        // --- ROW 3 (3x3 Area) ---
        "LFO 1": [
            { label: "FREQ", idx: 43, transform: v => v & 63 }, { label: "RESET", idx: 47, transform: v => (v & 32) ? "ON" : "OFF" }, { label: "HUMAN", idx: 47, transform: v => (v & 16) ? "ON" : "OFF" }, { label: "WAV", idx: 47, transform: v => SQ80_MAP.lfo_waves[v & 3] || "TRI" }, { label: "---", idx: 255 },
            { label: "LEVEL 1", idx: 44, transform: v => v & 63 }, { label: "DELAY", idx: 46, transform: v => v & 63 }, { label: "LEVEL 2", idx: 45, transform: v => v & 63 }, { label: "MOD", idx: 48, type: "mod_high" }, { label: "---", idx: 255 }
        ],
        "LFO 2": [
            { label: "FREQ", idx: 49, transform: v => v & 63 }, { label: "RESET", idx: 53, transform: v => (v & 32) ? "ON" : "OFF" }, { label: "HUMAN", idx: 53, transform: v => (v & 16) ? "ON" : "OFF" }, { label: "WAV", idx: 53, transform: v => SQ80_MAP.lfo_waves[v & 3] || "TRI" }, { label: "---", idx: 255 },
            { label: "LEVEL 1", idx: 50, transform: v => v & 63 }, { label: "DELAY", idx: 52, transform: v => v & 63 }, { label: "LEVEL 2", idx: 51, transform: v => v & 63 }, { label: "MOD", idx: 54, type: "mod_high" }, { label: "---", idx: 255 }
        ],
        "LFO 3": [
            { label: "FREQ", idx: 54, transform: v => v & 63 }, { label: "RESET", idx: 57, transform: v => (v & 32) ? "ON" : "OFF" }, { label: "HUMAN", idx: 57, transform: v => (v & 16) ? "ON" : "OFF" }, { label: "WAV", idx: 57, transform: v => SQ80_MAP.lfo_waves[v & 3] || "TRI" }, { label: "---", idx: 255 },
            { label: "LEVEL 1", idx: 55, transform: v => v & 63 }, { label: "DELAY", idx: 56, transform: v => v & 63 }, { label: "LEVEL 2", idx: 55, transform: v => v & 63 }, { label: "MOD", idx: 57, type: "mod_high" }, { label: "---", idx: 255 }
        ],

        // --- ROW 4 (2x4 Area) ---
        "ENV 1": [
            { label: "L1", idx: 6, func: "neg63" }, { label: "L2", idx: 7, func: "neg63" }, { label: "L3", idx: 8, func: "neg63" }, { label: "LV", idx: 13, func: "formatLV" }, { label: "T1V", idx: 14, transform: v => v & 63 },
            { label: "T1", idx: 9, transform: v => v & 63 }, { label: "T2", idx: 10, transform: v => v & 63 }, { label: "T3", idx: 11, transform: v => v & 63 }, { label: "T4", idx: 12, func: "formatT4" }, { label: "TK", idx: 15, transform: v => v & 63 }
        ],
        "ENV 2": [
            { label: "L1", idx: 16, func: "neg63" }, { label: "L2", idx: 17, func: "neg63" }, { label: "L3", idx: 18, func: "neg63" }, { label: "LV", idx: 23, func: "formatLV" }, { label: "T1V", idx: 24, transform: v => v & 63 },
            { label: "T1", idx: 19, transform: v => v & 63 }, { label: "T2", idx: 20, transform: v => v & 63 }, { label: "T3", idx: 21, transform: v => v & 63 }, { label: "T4", idx: 22, func: "formatT4" }, { label: "TK", idx: 25, transform: v => v & 63 }
        ],
        "ENV 3": [
            { label: "L1", idx: 26, func: "neg63" }, { label: "L2", idx: 27, func: "neg63" }, { label: "L3", idx: 28, func: "neg63" }, { label: "LV", idx: 33, func: "formatLV" }, { label: "T1V", idx: 34, transform: v => v & 63 },
            { label: "T1", idx: 29, transform: v => v & 63 }, { label: "T2", idx: 30, transform: v => v & 63 }, { label: "T3", idx: 31, transform: v => v & 63 }, { label: "T4", idx: 32, func: "formatT4" }, { label: "TK", idx: 35, transform: v => v & 63 }
        ],
        "ENV 4": [
            { label: "L1", idx: 36, func: "neg63" }, { label: "L2", idx: 37, func: "neg63" }, { label: "L3", idx: 38, func: "neg63" }, { label: "LV", idx: 43, func: "formatLV" }, { label: "T1V", idx: 44, transform: v => v & 63 },
            { label: "T1", idx: 39, transform: v => v & 63 }, { label: "T2", idx: 40, transform: v => v & 63 }, { label: "T3", idx: 41, transform: v => v & 63 }, { label: "T4", idx: 42, func: "formatT4" }, { label: "TK", idx: 45, transform: v => v & 63 }
        ],

        // --- ROW 5 (2x4 Area) ---
        "FILTER": [
            { label: "FREQ", idx: 89, transform: v => v & 127 }, { label: "Q", idx: 90, transform: v => v & 31 }, { label: "KEYBD", idx: 94, transform: v => v & 63 }, { label: "---", idx: 255 }, { label: "---", idx: 255 },
            { label: "MOD1", idx: 91, type: "mod_low" }, { label: "AMOUNT1", idx: 93, func: "neg63" }, { label: "MOD2", idx: 91, type: "mod_high" }, { label: "AMOUNT2", idx: 92, func: "neg63" }, { label: "---", idx: 255 }
        ],
        "MODES": [
            { label: "SYNC", idx: 85, transform: v => (v & 0x01) ? "ON" : "OFF" }, { label: "AM", idx: 85, transform: v => (v & 0x02) ? "ON" : "OFF" }, { label: "MONO", idx: 85, transform: v => (v & 0x04) ? "ON" : "OFF" }, { label: "GLIDE", idx: 86, transform: v => v & 63 }, { label: "VC", idx: 85, transform: v => (v & 0x08) ? "ON" : "OFF" },
            { label: "ENV1", idx: 85, transform: v => (v & 0x10) ? "CYC" : "OFF" }, { label: "ENV2", idx: 85, transform: v => (v & 0x20) ? "CYC" : "OFF" }, { label: "ENV3", idx: 85, transform: v => (v & 0x40) ? "CYC" : "OFF" }, { label: "OSC3", idx: 87, transform: v => (v & 0x40) ? "OFF" : "ON" }, { label: "---", idx: 255 }
        ],
        "SPLIT/LAYER": [
            { label: "PROG", idx: 100, transform: v => v & 127 }, { label: "MODE", idx: 99, transform: v => ["OFF", "SPLIT", "LAYER", "S+L"][v & 3] }, { label: "KEY", idx: 101, transform: v => v & 127 }, { label: "---", idx: 255 }, { label: "---", idx: 255 },
            { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }
        ],
        "DCA 4": [
            { label: "LEVEL", idx: 95, transform: v => v & 63 }, { label: "PAN", idx: 98, func: "neg63" }, { label: "---", idx: 255 }, { label: "MOD1", idx: 96, type: "mod_low" }, { label: "AMOUNT1", idx: 97, func: "neg63" },
            { label: "MOD2", idx: 96, type: "mod_high" }, { label: "AMOUNT2", idx: 92, func: "neg63" }, { label: "---", idx: 255 }, { label: "---", idx: 255 }, { label: "---", idx: 255 }
        ]
    }
}; // <--- Fixed missing closing bracket here


/**
 * Helper to switch the 'active-module' class to the clicked block
 */
function activateModule(moduleElement) {
    // 1. Clear active status from all other pages in the overlay
    document.querySelectorAll('.param-page').forEach(pg => {
        pg.classList.remove('active-module');
    });

    // 2. Set the clicked module as active
    moduleElement.classList.add('active-module');
}

/**
 * Complete updated rendering engine with auto-focus logic
 */
function renderParamDisplay(selectedPatchData) {
    const grid = document.getElementById('param-grid');
    const nameHeader = document.getElementById('overlay-patch-name');
    
    if (!grid || !nameHeader) return;

    const rawName = selectedPatchData.name || "Untitled";
    const cleanName = rawName.split('').filter(char => {
        const code = char.charCodeAt(0);
        return code >= 32 && code <= 126;
    }).join('').trim();

    nameHeader.innerText = `PATCH: ${cleanName}`;
    grid.innerHTML = ''; 

    for (const [pageName, params] of Object.entries(SQ80_MAP.pages)) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'param-page';
        
        // Attachment point for the module selection
        pageDiv.onclick = () => activateModule(pageDiv);
        
        pageDiv.innerHTML = `<div class="page-title">${pageName}</div>`;
        
        const subGrid = document.createElement('div');
        subGrid.className = 'page-grid';

        params.forEach(p => {
            const rawVal = (selectedPatchData.data && selectedPatchData.data[p.idx] !== undefined) ? selectedPatchData.data[p.idx] : 0;
            let displayVal;

            if (p.label === "---") {
                displayVal = "-";
            } else if (p.func) {
                displayVal = SQ80_MAP.helpers[p.func](rawVal);
            } else if (p.transform) {
                displayVal = p.transform(rawVal);
            } else if (p.type === "mod_low") {
                displayVal = SQ80_MAP.modulators[rawVal & 0x0F];
            } else if (p.type === "mod_high") {
                displayVal = SQ80_MAP.modulators[(rawVal >> 4) & 0x0F];
            } else {
                displayVal = rawVal;
            }

            const cell = document.createElement('div');
            cell.className = 'param-cell';
            cell.innerHTML = `<div class="param-label">${p.label}</div><div class="param-value">${displayVal}</div>`;
            subGrid.appendChild(cell);
        });
        
        pageDiv.appendChild(subGrid);
        grid.appendChild(pageDiv);
    }

    // AUTO-FOCUS LOGIC: Select the first module (usually OSC 1) on load
    const firstPage = grid.querySelector('.param-page');
    if (firstPage) {
        activateModule(firstPage);
    }
}
