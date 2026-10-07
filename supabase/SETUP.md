# Turning on TripPilot accounts with Supabase

The site's code is ready: the sign-in page (Google and email link), profiles, trips and spending syncing to the profile, and settings that follow people between devices. What's missing is a Supabase project to hold the accounts. You only set this up once. It takes about 15 minutes and is free.

## Checklist
- [ ] Create a free Supabase project (step 1)
- [ ] Run `supabase/schema.sql` in its SQL Editor (step 2)
- [ ] Set the Site URL and redirect URL to the site's address (step 3)
- [ ] Paste the Project URL and anon public key into `js/account-config.js` (step 4)
- [ ] Optional: turn on Google sign-in (step 3.2)
- [ ] Before launch: connect your own email sender (see Good to know)

The site needs a public address before sign-in links can work, so do step 3 once the site is hosted (Netlify or Cloudflare Pages).

## 1. Create the project
1. Go to supabase.com and click **Start your project**. Sign up with GitHub or email.
2. Click **New project**. Name it `trippilot`, make up a database password (save it in your password manager), and pick the region closest to most of your visitors.
3. Wait a minute or two while it sets up.

## 2. Create the tables
1. In the left menu, open **SQL Editor**, then click **New query**.
2. Open `supabase/schema.sql` from the site folder, copy all of it, and paste it in.
3. Click **Run**. You should see "Success. No rows returned".

This creates two tables, `profiles` (name, home city, usual budget, styles and display settings) and `trips` (each trip, including its spending log). Its privacy rules mean each person can only ever see and change their own data.

## 3. Turn on sign-in
1. Open **Authentication**, then **Sign In / Providers**. **Email** is on by default. That's the "email me a link" option.
2. Optional: to offer **Continue with Google**, turn on **Google**. Supabase links to Google's steps for creating the Client ID and Client Secret it asks for. Without this, the Google button shows a message and email sign-in still works.
3. Open **Authentication**, then **URL Configuration**. Set **Site URL** to your site's address, such as `https://trippilot.com`. Under **Redirect URLs**, add the same address, plus `http://localhost:8000` if you test locally.

## 4. Connect the site
1. Open **Project Settings**, then **API**. Copy the **Project URL** and the **anon public** key.
2. Paste them into `js/account-config.js`:
   ```js
   window.TRIPPILOT_SUPABASE = {
     url: "https://YOUR-PROJECT.supabase.co",
     anonKey: "eyJ..."
   };
   ```
   Both values are safe to put in the site. Never paste the **service_role** key anywhere in the site.
3. Publish the site. The profile button and Settings now offer Google and email sign-in.

## 5. Check it works
1. Open the site, tap the profile icon, and request an email link to your own address.
2. Open the link on the same device. You land back on TripPilot, signed in, with a form to create your profile.
3. Create the profile, plan a trip, then open the site in another browser and sign in again. The trip should be there.

## Good to know
- Supabase's free plan covers about 50,000 monthly active users. Free projects pause after a week with no visits. You can un-pause them from the dashboard, or upgrade when you launch.
- Supabase's built-in email sender only sends a few sign-in emails per hour. Before launch, connect your own email sender under **Authentication**, then **Emails**, then **SMTP settings**. Resend, Postmark and Brevo all have free tiers.
- The claude.ai preview keeps using your claude.ai sign-in. Supabase is only used where `js/account-config.js` has the two values filled in.
