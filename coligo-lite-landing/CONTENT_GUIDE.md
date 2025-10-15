# Content Configuration Guide

This guide explains how to edit the content of your COLIGO lite landing page using the `content-config.json` file.

## Overview

**ALL website content is now editable in ONE file: `content-config.json`**

The following content elements can be edited:
- **Site Settings** (Page title, meta description, logo text, CTA buttons)
- **Hero Section** (Headline & subheadline)
- **Demo Form Section** (Title, subtitle, submit button text)
- **Demo Features** (6 feature points with icons)
- **FAQ Section** (6 questions and answers)
- **Footer** (Logo text and navigation links)

## Editing Content

Simply open `content-config.json` and edit the values directly. The changes will be reflected on your website after refreshing the page.

### Complete Structure

```json
{
  "site": {
    "title": "Page title (appears in browser tab)",
    "description": "Meta description for SEO",
    "logo_text": "Logo text in header",
    "cta_button_text": "Text for all CTA buttons"
  },
  "hero": {
    "headline": "Your main headline",
    "subheadline": "Your subheadline (HTML supported with <br> tags)"
  },
  "demo_form": {
    "title": "Demo form section title",
    "subtitle": "Demo form section subtitle",
    "submit_button_text": "Form submit button text"
  },
  "demo_features": {
    "title": "Section title",
    "features": [
      {
        "icon": "📡",
        "title": "Feature title",
        "description": "Feature description"
      }
      // ... up to 6 features
    ]
  },
  "faq": {
    "title": "FAQ Section title",
    "items": [
      {
        "question": "Your question?",
        "answer": "Your answer"
      }
      // ... up to 6 FAQ items
    ]
  },
  "footer": {
    "logo_text": "Footer logo text",
    "links": [
      {
        "text": "Link text",
        "url": "URL or anchor (#privacy)"
      }
      // ... any number of links
    ]
  }
}
```

## Editing Instructions

### 1. Site Settings

Edit site-wide settings that appear across multiple pages:

```json
"site": {
  "title": "COLIGO lite - AI + MQTT for Real-Time Edge Analytics",
  "description": "Request a live demo of COLIGO lite - containerized AI module for edge analytics with streaming learning and MQTT integration",
  "logo_text": "COLIGO lite",
  "cta_button_text": "Book My Demo"
}
```

**Notes:**
- `title`: Appears in browser tab and search results
- `description`: Used by search engines (keep under 160 characters)
- `logo_text`: Appears in header and footer
- `cta_button_text`: Used for all Call-to-Action buttons throughout the site

### 2. Hero Section

Edit the main headline and subheadline that appear at the top of the page:

```json
"hero": {
  "headline": "See COLIGO lite in action — AI + MQTT for real-time edge analytics",
  "subheadline": "Request a live demo and discover how you can deploy<br>anomaly detection, predictive insights, and streaming AI<br>directly into your IoT system — without coding"
}
```

**Notes:**
- You can use `<br>` tags in the subheadline for line breaks
- Keep headlines concise and impactful

### 3. Demo Form Section

Edit the demo request form section:

```json
"demo_form": {
  "title": "Ready to see COLIGO lite in action?",
  "subtitle": "Book a 30-minute live demo and see how streaming AI can transform your IoT analytics",
  "submit_button_text": "Schedule a Live Demo"
}
```

**Notes:**
- `title`: Main heading above the form
- `subtitle`: Descriptive text below the title
- `submit_button_text`: Text on the form submission button

### 4. Demo Features Section

Edit the "What You'll See in the Demo" section with 6 feature points:

```json
"demo_features": {
  "title": "What You'll See in the Demo:",
  "features": [
    {
      "icon": "📡",
      "title": "Live data ingestion via MQTT",
      "description": "Seamlessly connect to your existing IoT infrastructure"
    }
    // Add 5 more features...
  ]
}
```

**Notes:**
- You can use emoji icons or change to text icons
- Keep exactly 6 features for the best layout
- Each feature should have: icon, title, and description

### 5. FAQ Section

Edit the Frequently Asked Questions with 6 Q&A pairs:

```json
"faq": {
  "title": "Frequently Asked Questions",
  "items": [
    {
      "question": "How long is the demo?",
      "answer": "~30 minutes"
    }
    // Add 5 more FAQ items...
  ]
}
```

**Notes:**
- Keep exactly 6 FAQ items for the best layout
- Questions should be concise
- Answers can be longer if needed

### 6. Footer Section

Edit the footer content:

```json
"footer": {
  "logo_text": "COLIGO lite",
  "links": [
    {
      "text": "Privacy",
      "url": "#privacy"
    },
    {
      "text": "Terms",
      "url": "#terms"
    },
    {
      "text": "Contact",
      "url": "#contact"
    }
  ]
}
```

**Notes:**
- `logo_text`: Brand name displayed in footer
- `links`: Array of navigation links
- Each link has `text` (displayed) and `url` (destination)
- You can add or remove links as needed

## Adding/Removing Items

### To Add More Features or FAQ Items:

Simply add more objects to the `features` or `items` array:

```json
{
  "icon": "🚀",
  "title": "New Feature",
  "description": "Description of the new feature"
}
```

### To Remove Features or FAQ Items:

Delete the entire object from the array, making sure to maintain valid JSON syntax (check commas).

## Important Notes

1. **Valid JSON**: Make sure your JSON is valid. Use a JSON validator if needed.
2. **Quotation Marks**: Always use double quotes `"` for JSON strings, not single quotes.
3. **Commas**: Don't forget commas between items, but no comma after the last item in an array.
4. **HTML Support**: The headline and subheadline support HTML tags like `<br>`.
5. **Emojis**: You can use emojis in the icons field or replace them with text.

## Testing Your Changes

1. Edit `content-config.json`
2. Save the file
3. Refresh your browser (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
4. Your changes should appear immediately

## Troubleshooting

If content doesn't appear:
1. Check the browser console for errors (F12)
2. Validate your JSON syntax using an online JSON validator
3. Make sure all quotes and commas are in the right place
4. Ensure the file is saved as `content-config.json` in the root directory

## About package.json

**Important:** The `package.json` file is a separate technical configuration file that manages backend dependencies (like SendGrid email service) and should NOT be edited for website content.

- `package.json` = Backend/server configuration (dependencies, scripts)
- `content-config.json` = Website content (text, headings, links)

Keep these files separate to maintain a clean separation between technical setup and content management.

