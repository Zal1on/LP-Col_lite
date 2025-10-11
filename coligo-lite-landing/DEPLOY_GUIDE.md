# 🚀 Deployment Guide - COLIGO Lite Landing Page

## Step-by-Step Deployment to Netlify (From GitHub)

### ✅ Prerequisites
- GitHub account with your code uploaded
- SendGrid account with API key ready
- Verified sender email in SendGrid

---

## 📝 EXACT STEPS

### **Step 1: Sign Up for Netlify**
1. Go to: https://www.netlify.com/
2. Click **"Sign up"** (top right)
3. Choose **"Sign up with GitHub"**
4. Authorize Netlify to access your GitHub

### **Step 2: Deploy Your Site**
1. Once logged in, click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Find and click your repository: **`LP-Col_lite`**
4. Configure build settings:
   - **Branch to deploy:** `main`
   - **Base directory:** `coligo-lite-landing`
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (just a dot)
5. Click **"Deploy site"**

Wait 1-2 minutes for the initial deploy to complete.

### **Step 3: Add Environment Variables**
1. In your Netlify dashboard, go to: **Site settings** → **Environment variables**
2. Click **"Add a variable"** and add these 3 variables:

   | Key | Value | Example |
   |-----|-------|---------|
   | `SENDGRID_API_KEY` | Your SendGrid API key | `SG.abc123...` |
   | `FROM_EMAIL` | Your verified sender email | `M.alsharif@be-services.com` |
   | `TO_EMAIL` | Where to receive demo requests | `r.maidel@be-services.com` |

3. Click **"Save"** after each one

### **Step 4: Trigger Redeploy**
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait 1-2 minutes for the new deploy with environment variables

### **Step 5: Test Your Site** ✅
1. Click the URL Netlify gave you (looks like: `https://your-site-name.netlify.app`)
2. Fill out the demo request form
3. Submit and check the email arrives at your TO_EMAIL address

---

## 🔧 SendGrid Setup (If Not Done Yet)

### Get Your API Key:
1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **"Create API Key"**
3. Name: `Coligo Landing Page`
4. Permissions: **"Full Access"** (or at least "Mail Send")
5. Click **"Create & View"**
6. **COPY THE KEY** (you won't see it again!)
7. Use this as your `SENDGRID_API_KEY`

### Verify Your Sender Email:
1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **"Create New Sender"**
3. Fill in your details with `FROM_EMAIL` address
4. Verify the email SendGrid sends you
5. **Must do this or emails won't send!**

---

## 🎯 What Your Live URL Will Look Like
```
https://coligo-lite-landing.netlify.app
```
(You can customize this or add a custom domain later)

---

## ⚠️ Troubleshooting

### Form submits but no email arrives?
- Check Netlify Function logs: **Functions** tab → **send-email** → View logs
- Verify `SENDGRID_API_KEY` is correct
- Verify `FROM_EMAIL` is verified in SendGrid
- Check SendGrid dashboard activity: https://app.sendgrid.com/email_activity

### Form shows error?
- Open browser console (F12) to see the error
- Check Netlify Function logs for server errors

### Need to update the code?
1. Make changes locally
2. Commit: `git add . && git commit -m "Update"`
3. Push: `git push`
4. Netlify automatically redeploys in 1-2 minutes!

---

## 🎉 You're Done!
Your landing page is now live and sending emails!

