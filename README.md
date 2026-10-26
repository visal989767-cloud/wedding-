# Wedding Invitation

A static wedding invitation and RSVP page.

## Customize

Edit `index.html` to replace the couple's names, date, and venue.

## Share RSVPs across devices

By default, responses are saved only in the browser where they were submitted. To share the guest list between phones and computers:

1. Create a Google Sheet for the guest book.
2. In the sheet, open **Extensions → Apps Script**.
3. Replace the editor contents with `google-sheets-rsvp.gs` and save.
4. Choose **Deploy → New deployment**, select **Web app**, set **Execute as** to **Me**, and set access to **Anyone**. Deploy and authorize the script.
5. Copy the web app URL ending in `/exec`.
6. Open `config.js` and paste the URL between the quotes, for example: `window.GUEST_API_URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';`
7. Push the change to `main` so GitHub Pages publishes the connected site.

The first submission creates an `RSVPs` sheet tab automatically. The endpoint is publicly accessible so invitees can submit and view names; do not store sensitive information in it. Existing responses saved only in individual browsers are not copied to the Google Sheet.

## Publish with GitHub Pages

1. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.
2. Push changes to the `main` branch. The included workflow publishes the site automatically.
