function doGet() {
  try {
    var sheet = getRsvpSheet();
    var rows = sheet.getDataRange().getValues();
    var guests = rows.slice(1).filter(function (row) {
      return row[0] && (row[2] === 'join' || row[2] === 'cant');
    }).map(function (row) {
      return {
        name: String(row[0]),
        title: String(row[1]),
        status: String(row[2]),
        t: Number(row[3])
      };
    });
    return jsonResponse({ success: true, guests: guests });
  } catch (error) {
    console.error('Unable to read RSVPs: ' + error);
    return jsonResponse({ success: false, error: 'Unable to read the guest book.' });
  }
}

function doPost(event) {
  try {
    var guest = JSON.parse(event.postData.contents);
    var name = String(guest.name || '').trim().replace(/\s+/g, ' ');
    var title = String(guest.title || '');
    var status = String(guest.status || '');

    if (name.length < 2 || name.length > 60 ||
        (title !== 'Mr.' && title !== 'Mrs.') ||
        (status !== 'join' && status !== 'cant')) {
      return jsonResponse({ success: false, error: 'Please provide a valid name and RSVP.' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getRsvpSheet().appendRow([name, title, status, Date.now()]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Unable to save RSVP: ' + error);
    return jsonResponse({ success: false, error: 'Unable to save the RSVP.' });
  }
}

function getRsvpSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('This script must be attached to a spreadsheet.');

  var sheet = spreadsheet.getSheetByName('RSVPs');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('RSVPs');
    sheet.appendRow(['Name', 'Title', 'RSVP', 'Submitted']);
  }
  return sheet;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
