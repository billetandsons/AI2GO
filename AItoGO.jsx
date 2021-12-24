//AI to GO Script - Embed all linked documents, Outline all the fonts, Save as a new File
// Cobbled by Ace Billet billetandsons.com
// Original script pieces from Adobe forums
// https://community.adobe.com/t5/user/viewprofilepage/user-id/9510373
// https://community.adobe.com/t5/user/viewprofilepage/user-id/9000514

#target Illustrator

if ( app.documents.length > 0 ) {
    while ( app.activeDocument.placedItems.length > 0 ) {
        placedArt = app.activeDocument.placedItems[0];
        placedArt.embed();
    }
}

function outlineDocText(  ) {


      if ( app.documents.length == 0 ) return;


var docRef = app.activeDocument;

      recurseLayers( docRef.layers );

};

outlineDocText();

function recurseLayers( objArray ) {

      for ( var i = 0; i < objArray.length; i++ ) {

                // Record previous value with conditional change
                var l = objArray[i].locked;
                if ( l ) objArray[i].locked = false;

                // Record previous value with conditional change
                var v = objArray[i].visible;
                if ( !v ) objArray[i].visible = true;

                outlineText( objArray[i].textFrames );

                // Recurse the contained layer collection
                if ( objArray[i].layers.length > 0 ) {
                          recurseLayers( objArray[i].layers )
                }

                // Recurse the contained group collection
                if ( objArray[i].groupItems.length > 0 ) {
                          recurseGroups( objArray[i].groupItems )
                }

                // Return to previous values
                objArray[i].locked = l;
                objArray[i].visible = v;
      }

};

function recurseGroups( objArray ) {

      for ( var i = 0; i < objArray.length; i++ ) {

                // Record previous value with conditional change
                var l = objArray[i].locked;
                if ( l ) objArray[i].locked = false;

                // Record previous value with conditional change
                var h = objArray[i].hidden;
                if ( h ) objArray[i].hidden = false;

                outlineText( objArray[i].textFrames );

                // Recurse the contained group collection
                if ( objArray[i].groupItems.length > 0 ) {
                          recurseGroups( objArray[i].groupItems )
                }

                // Return to previous values
                objArray[i].locked = l;
                objArray[i].hidden = h;
      }

};

function outlineText( objArray ) {

      // Reverse this loop as it brakes the indexing
      for ( var i = objArray.length-1; i >= 0; i-- ) {

                // Record previous value with conditional change
                var l = objArray[i].locked;
                if ( l ) objArray[i].locked = false;

                // Record previous value with conditional change
                var h = objArray[i].hidden;
                if ( h ) objArray[i].hidden = false;

                var g = objArray[i].createOutline(  );

                // Return new group to previous Text Frame values
                g.locked = l;
                g.hidden = h;
      }

};

{
  // Add Suffix dialogue window
  var title = "AI to GO";
  var addSuffix = prompt
  ("Save as new file with your suffix \nExample: Store_Sign => Store_Sign_Embed", "Your Suffix Here", title);
  if (!addSuffix) exit();
}


{

  // Save the document in the original folder using the original name with _LR suffix
  // The active document
  var doc = app.activeDocument;
  // The path of the original document
  var originalDocPath = doc.path;
  // The name of the original document
  var originalDocName = doc.name;
  // Get just the file name. Ignore the file extension .pdf and .ai
  originalDocName = originalDocName.replace(/\.pdf|\.ai/gi, "")

  doc.saveAs(File(originalDocPath + "/" + originalDocName + "_" + addSuffix));

}
