// ===============================================================
//  AItoGO_classic_fixed.jsx
//  ---------------------------------------------------------------
//  Embed all linked artwork, outline all text, and save as new file
//  with user-entered suffix.
//  Compatible: Adobe Illustrator CS6 → 2024
//  Author: Ace Billet / billetandsons.com
// ===============================================================

#target "illustrator"

// --- 1. EMBED ALL LINKED ARTWORK ---
if (app.documents.length > 0) {
    var doc = app.activeDocument;
    while (doc.placedItems.length > 0) {
        var placedArt = doc.placedItems[0];
        placedArt.embed();
    }
} else {
    alert("No open document found!");
    exit();
}

// --- 2. OUTLINE ALL TEXT ---

outlineDocText();

function outlineDocText() {
    if (app.documents.length == 0) return;
    var docRef = app.activeDocument;
    recurseLayers(docRef.layers);
}

function recurseLayers(objArray) {
    for (var i = 0; i < objArray.length; i++) {
        var lyr = objArray[i];
        var wasLocked = lyr.locked;
        if (wasLocked) lyr.locked = false;

        var wasVisible = lyr.visible;
        if (!wasVisible) lyr.visible = true;

        outlineText(lyr.textFrames);

        if (lyr.layers.length > 0) recurseLayers(lyr.layers);
        if (lyr.groupItems.length > 0) recurseGroups(lyr.groupItems);

        lyr.locked = wasLocked;
        lyr.visible = wasVisible;
    }
}

function recurseGroups(objArray) {
    for (var i = 0; i < objArray.length; i++) {
        var grp = objArray[i];
        var wasLocked = grp.locked;
        if (wasLocked) grp.locked = false;

        var wasHidden = grp.hidden;
        if (wasHidden) grp.hidden = false;

        outlineText(grp.textFrames);

        if (grp.groupItems.length > 0) recurseGroups(grp.groupItems);

        grp.locked = wasLocked;
        grp.hidden = wasHidden;
    }
}

function outlineText(objArray) {
    // Reverse loop: createOutline() destroys the original textFrame
    for (var i = objArray.length - 1; i >= 0; i--) {
        var tf = objArray[i];
        var wasLocked = tf.locked;
        if (wasLocked) tf.locked = false;

        var wasHidden = tf.hidden;
        if (wasHidden) tf.hidden = false;

        var g = tf.createOutline();
        g.locked = wasLocked;
        g.hidden = wasHidden;
    }
}

// --- 3. PROMPT FOR SUFFIX AND SAVE AS NEW FILE ---

var title = "AI to GO";
var addSuffix = prompt(
    "Save as new file with your suffix\nExample: Store_Sign → Store_Sign_Embed",
    "YourSuffix",
    title
);

if (!addSuffix || addSuffix.replace(/\s+/g, "") === "") {
    alert("Operation cancelled. No suffix provided.");
    exit();
}

// Save to same folder with new suffix
var originalDoc = app.activeDocument;
var originalPath = originalDoc.path;
var originalName = originalDoc.name.replace(/\.ai$|\.pdf$/i, "");
var newFile = new File(originalPath + "/" + originalName + "_" + addSuffix + ".ai");

if (newFile.exists) {
    var overwrite = confirm("File already exists.\nOverwrite?");
    if (!overwrite) {
        alert("Operation cancelled. File not saved.");
        exit();
    }
}

originalDoc.saveAs(newFile);

// --- 4. SUMMARY FEEDBACK ---
alert(
    "AI to GO complete!\n\n" +
    "All links embedded and text outlined.\n" +
    "Saved as:\n" + newFile.fsName
);

// ===============================================================
//  END OF SCRIPT
// ===============================================================
