# Srijit T N Portfolio Website

A responsive personal portfolio website built with plain HTML, CSS, and JavaScript for GitHub Pages hosting.

## Live Site

[https://srijittn.github.io](https://srijittn.github.io)

## LinkedIn

[https://www.linkedin.com/in/srijit-tn](https://www.linkedin.com/in/srijit-tn)

## Files

- `index.html`: Main website structure and content
- `styles.css`: Visual design, layout, responsive behavior, and theme styles
- `script.js`: Interactions, animations, form validation, certification ribbon, and theme toggle

## Deployment

This project is static, so it can be deployed directly on GitHub Pages.

1. Upload `index.html`, `styles.css`, and `script.js` to the root of your GitHub repository.
2. In GitHub, open repository `Settings`.
3. Open `Pages`.
4. Set the source branch to your main branch and root folder.
5. Save and wait for GitHub Pages to publish the site.

## Contact Form

The contact form uses [FormSubmit](https://formsubmit.co/) to send messages to `srijitnavi@gmail.com`.

### First-time setup

1. Open the live website.
2. Fill the form and submit one test enquiry.
3. Check `srijitnavi@gmail.com` for a FormSubmit activation email.
4. Confirm the activation.

After that, future submissions from the website should arrive in the inbox.

## Features

- Premium one-page portfolio layout
- Dark and light theme toggle
- Responsive design for desktop, tablet, and mobile
- Interactive hover effects and animated background
- Searchable country code picker
- Contact form with validation
- Rotating certifications ribbon

## Editing Guide

### Update profile content

Edit the text in `index.html`:

- Hero section
- Experience section
- Education section
- Certifications section
- Contact details

### Update styles

Edit `styles.css`:

- Colors are near the top under `:root`
- Theme styles are under the `body[data-theme="light"]` section
- Responsive changes are near the bottom in media queries

### Update interactions

Edit `script.js`:

- `countryList` controls the phone code dropdown
- `certifications` controls the certification ribbon items
- form validation functions control contact form rules
- `setTheme()` handles dark/light theme persistence

## Local Preview

You can open `index.html` directly in a browser, or use a local server if you prefer.

Example:

```bash
python3 -m http.server
```

Then open:

`http://localhost:8000`

## Notes

- Google Fonts are loaded from the internet.
- The form requires internet access to send submissions.
- Theme preference is saved in the browser using `localStorage`.
