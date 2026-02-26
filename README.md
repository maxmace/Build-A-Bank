# Build-A-Bank
Patch viewing, collation, and reorganization for Ensoniq ESQ and SQ-80 synthesizers.

# Build-A-Bank\_Architecture\_Discussion

## Patch viewing, collation, and reorganization for Ensoniq ESQ and SQ-80 synthesizers.

Let’s talk about a more scaled down app that may not require a database. I call this “Build-A-Bank”.

This app allows users to upload bank files and single patches, storing them in a directory on the server. A user can input comment text upon upload on a field of the “file upload” Dialog.

The app looks at the directory of uploaded files and lists them in a pane on the left, with bank files in the upper list, and patch files in the lower list, with fields for file name, upload date, and file creation date.

When selected, comments (if any) are displayed in text field in the middle. If a bank file is selected, it displays the patches it contains in a viewer in the upper righthand quadrant, which I call the “Bank View”.

Patch names can be dragged both from the “Bank View” and the single patch list onto the empty fields of the Build-A-Bank section in the lower right quadrant.

Patch names can be dragged between fields of the Build-A-Bank section. If a patch is dragged to an empty filled, the previous field in the Build-A-Bank section is emptied and it becomes free for use. If a patch is dragged to an occupied (populated) field of the Build-A-Bank section, the two patch names and locations are SWAPPED. If the CTRL-dragged (or OPTION-dragged on Mac) , the dragged patch is copied to new blank locations. Copying over filled locations is not allowed.

A provision is made for 8 temporary “placeholder” locations at the bottom of the interface to assist with organization.

Dragging patches from the single patch directories or the BANK VIEW section do not affect the original sysex files, or the display of the single patch list or BANK VIEW, only duplicate the patch parameter data and place the name in the selected BUILD-A-BANK location.

When the user completes desired organization, a prominent button below the newly-built bank labeled “EXPORT BUILD-A-BANK (download new sysex file)” brings up a file save (or download) dialog, allowing the user to name the filename of the newly collated bank, and save it on their local computer.

In the future, a provision for Web MIDI API will allow for direct hardware access to both load a bank file into the hardware synthesizer as well as receive a bulk dump from the hardware, allowing users to name it and placing it in the upload directory.

Questions:

1. Does github pages allow for binary uploads, file storage, and file access of this type?
2. Is the “Build-A-Bank” functionality I have described possible with JavaScript and no server-side automation?

This "Build-A-Bank" concept is a classic "Virtual Patch Bay." It moves the complexity away from database management and into **Client-Side State Management**. By treating the browser's memory as the "workspace," you can achieve a very fluid, tactile experience.

Here are the answers to your specific questions regarding the feasibility of this scaled-down approach:

**1. Does GitHub Pages allow for binary uploads and file storage?**

**Short answer: No.**

GitHub Pages is a **Static Site Host**. It is designed to serve files *one way* (from GitHub to the user).

* **No File Writing:** A browser cannot "upload" a file to a GitHub Pages server. There is no logic on the server to receive a file, save it to a directory, or update a list of files.
* **The Alternative:** To keep it "database-less" but still have persistence, you would use **Browser LocalStorage** or **IndexedDB**. The files wouldn't live on a server; they would live in the user's specific browser cache. If they cleared their cache or changed computers, the "uploaded" files would disappear.
* **To get true server storage:** You would need a simple backend (like Node.js, Python, or PHP) or a service like Vercel/Netlify with "Functions."

**2. Is "Build-A-Bank" possible with JS and no server-side automation?**

**Short answer: Yes, absolutely.**

In fact, JavaScript is better suited for this than a server would be because the "Drag and Drop" and "Bank Building" happen entirely in the user's interface. You can achieve 100% of the logic you described (swapping, copying, and exporting) using only the browser.

**How the "Build-A-Bank" logic would work:**

* **The Workspace (State):** You would maintain a JavaScript Array with 40 slots (representing the SQ-80 internal memory). Each slot would hold the 102-byte PCB object.
* **Drag & Drop API:** Using the HTML5 Drag and Drop API, you can "attach" the patch data to the ghost image of the name being dragged.
* **The Swap/Copy Logic:**
  + **Normal Drag:** Bank[Target] = Bank[Source]; Bank[Source] = null;
  + **CTRL-Drag:** if (Bank[Target] == null) { Bank[Target] = Bank[Source]; }
  + **Swap:** let temp = Bank[Target]; Bank[Target] = Bank[Source]; Bank[Source] = temp;
* **The Export:** When the user clicks "Export," JavaScript can take those 40 sets of 102 bytes, wrap them in the necessary Ensoniq SysEx Header (e.g., $F0 $0F $02...) and Footer ($F7), and trigger a browser download. The server never even sees the new file.

**3. Structural Considerations for the UI**

To make this work without a database while still feeling "pro," here is how I would structure the components:

| **Component** | **Responsibility** |
| --- | --- |
| **Virtual File System** | A JS object that stores "Uploaded" files in memory for the duration of the session. |
| **The "Staging" Area** | The 8 placeholder slots. These are just another array that acts as a "buffer" for the drag-and-drop logic. |
| **The MIDI Bridge** | Using the **Web MIDI API**, you can bypass "files" entirely. The "Upload" button could literally be "Receive from SQ-80," which populates the left pane directly from the hardware. |

**A Potential Middle Ground: "JSON Manifest"**

If you eventually want the "uploaded" files to stay on a server without a complex database, you can store the .sysex files in a folder and have one single text file (a manifest.json) that stores the "Comments," "Upload Date," and "Author." The app reads that one text file to build the list on the left.

**Would you like me to create a prototype of the "Build-A-Bank" drag-and-drop grid to demonstrate how the "Swap vs. Copy" logic feels in the browser?**
