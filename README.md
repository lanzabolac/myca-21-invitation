# Debut Invitation Template

Plain HTML, CSS and JavaScript. No build step, no libraries.

## Run it
Open `index.html` in a browser. (Fonts load from Google Fonts, so go online for the intended look.)

## Customize (everything is at the top of `script.js`)
| To change | Edit in `eventData` |
|---|---|
| Name / age / nickname | `celebrantName`, `age`, `nickname` |
| Date | `eventDate` (display text) **and** `eventDateTime` (countdown, `YYYY-MM-DDTHH:MM:SS`) |
| Time | `eventTime` |
| Venue | `venue`, `venueAddress` |
| Map button | `mapLink` (leave `""` to search the venue automatically) |
| Dress code | `dressCode`, `ladies`, `gentlemen` |
| Debut traditions cards | `traditions` |
| RSVP deadline | `rsvpDeadline` (`null` = always open) |

## Images
Put photos in the `images/` folder (create it next to `index.html`):
`hero.jpg` (cover), `portrait.jpg` (celebrant), and `gallery-01.jpg`, `gallery-02.jpg`, ...
Missing files show a "PHOTO 01 – Replace with your image" placeholder, so nothing breaks.

**Add/remove gallery photos:** add or delete filenames in `eventData.galleryImages`. The gallery rebuilds itself.

## Colors
Edit the variables in `:root` at the top of `style.css`.

## Guest greeting
`index.html?guest=Lanz` shows "WELCOME, LANZ". Turn off with `personalization: false`.

## RSVP: read this
- With `endpoint: null` (default), responses are saved in `localStorage` **in the guest's own browser only**. The organizer never receives them. This is for local/demo use.
- The site never claims the response was sent unless an `endpoint` is set. Reword `rsvpConfig.confirmationMessage` if you like.
- For a real public invitation, set `rsvpConfig.endpoint` to a backend/database you control or a trusted form service. The form sends the RSVP as JSON with `fetch()`. Never put API keys or secrets in `script.js`; anything in it is visible to everyone.
- **Admin view:** set `adminConfig.enabled = true` to see a summary, table, CSV export and clear button for responses stored in *your* browser. It is not authentication and is not secure; don't enable it on a public site.
