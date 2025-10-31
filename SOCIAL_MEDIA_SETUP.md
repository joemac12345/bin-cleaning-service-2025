# Social Media Setup Guide

## ✅ What's Been Added

Open Graph meta tags have been added to your site for optimal social media sharing on:
- **Facebook** (Facebook posts, Messenger)
- **LinkedIn** (Professional network)
- **WhatsApp** (Message previews)
- **Twitter/X** (Tweet cards)
- **Pinterest** (Pins)
- **iMessage** (Rich link previews)

---

## 🎨 Next Steps

### 1. Create Social Media Preview Image

You need to create an image called `social-preview.jpg` and place it in the `/public` folder.

**Image Requirements:**
- **Size**: 1200px × 630px (Facebook's recommended size)
- **Format**: JPG or PNG
- **Content suggestions**:
  - Show a clean wheelie bin (before/after if possible)
  - Add your business name/logo
  - Include text: "Professional Bin Cleaning Service"
  - Use bright, clean colors
  - Keep important content in the center (safe zone)

**Free Design Tools:**
- Canva (easiest - has templates for "Facebook Link")
- Figma (more professional)
- Photoshop/GIMP (if you have design skills)

### 2. Update Your Domain

In `/src/app/layout.tsx`, replace:
```typescript
url: "https://yourdomain.com"
```

With your actual domain (once you have it).

---

## 🧪 Test Your Setup

### Facebook Sharing Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your website URL
3. Click "Debug"
4. Click "Scrape Again" to refresh cache
5. Check the preview - you should see:
   - Your title
   - Your description
   - Your social preview image

### Twitter Card Validator
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Check the preview

---

## 📱 How It Works

When someone shares your link on social media:

**Before (without Open Graph):**
```
[No image]
yourdomain.com
```

**After (with Open Graph):**
```
[Beautiful image of clean bins]
Bin Cleaning Service - Professional Wheelie Bin Cleaning
Professional bin cleaning service. Get your wheelie bins cleaned professionally. Book online now!
yourdomain.com
```

---

## 🚀 Facebook Business Page Tips

### Setting Up Your Page:
1. Create a Facebook Business Page
2. Category: "Local Service" or "Cleaning Service"
3. Add your website URL
4. Add Call-to-Action button: "Book Now" → Link to your booking page
5. Fill out About section completely
6. Add business hours
7. Upload profile picture (logo) and cover photo (clean bins)

### Content Strategy:
- Post **2-3 times per week**
- Best times: 7-9am, 12-1pm, 5-7pm
- Mix of content:
  - Before/after photos (70%)
  - Educational posts (20%)
  - Booking reminders (10%)

### Post Ideas:
- "Did you know dirty bins attract rats? 🐀 Book a professional clean today!"
- "Before & After: See the difference! [Photo]"
- "Spring cleaning reminder! Book your bin clean now 🌸"
- "Customer testimonial: [Quote]"
- "Serving [Your Areas]: [List postcodes you cover]"

### Engagement Tips:
- Reply to all comments within 24 hours
- Join local community Facebook groups
- Share posts in local groups (with permission)
- Ask customers for reviews
- Use local hashtags: #[YourTown]Business #[YourTown]Services

---

## 💰 Facebook Ads (Optional)

If you want to run ads:

**Budget**: Start with £5-10/day
**Targeting**:
- Location: Specific postcodes you serve
- Age: 25-65
- Interests: Homeowners, cleaning, home improvement

**Ad Content**:
- Use your best before/after photo
- Clear headline: "Professional Bin Cleaning - Book Now"
- Call-to-action: "Book Now" button
- Landing page: Your booking page

**Ad Rules to Follow**:
- Don't use excessive caps or emojis
- Match ad content to landing page
- Include business name clearly
- Have a privacy policy on your site

---

## 📊 Tracking (Optional - Advanced)

### Facebook Pixel Setup:
1. Go to Facebook Events Manager
2. Create a Pixel
3. Copy the Pixel ID
4. Add to your site's `<head>` section
5. Track conversions (bookings)

This lets you:
- See which Facebook posts drive bookings
- Retarget visitors who didn't book
- Measure ad performance
- Optimize campaigns

---

## ✅ Checklist

- [x] Open Graph tags added to site
- [ ] Create social-preview.jpg image (1200x630px)
- [ ] Upload image to /public folder
- [ ] Update domain URL in layout.tsx
- [ ] Test with Facebook Sharing Debugger
- [ ] Create Facebook Business Page
- [ ] Set up Call-to-Action button
- [ ] Post first content on Facebook
- [ ] Join local Facebook groups
- [ ] (Optional) Set up Facebook Pixel
- [ ] (Optional) Create first Facebook Ad

---

## 🆘 Need Help?

If you see issues when sharing:
1. Clear Facebook's cache: Use the Sharing Debugger and click "Scrape Again"
2. Wait 24 hours for changes to propagate
3. Make sure your image is publicly accessible
4. Check image size is exactly 1200x630px
5. Ensure HTTPS is working on your domain

---

Your site is now optimized for social media sharing! 🎉
