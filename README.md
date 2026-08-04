# StockHub — Stock Marketplace (ধাপ ৪: Forgot Password + Upload পেজ যোগ হয়েছে)

## ভাষা নিয়ে নোট
সাইটের সব UI টেক্সট (বাটন, লেবেল, মেসেজ) এখন **ইংরেজিতে**। এই README ফাইলটা শুধু আপনার নিজের রেফারেন্সের জন্য বাংলায় রাখা হয়েছে — এটা ওয়েবসাইটে দেখায় না।

## এই ফোল্ডারে কী আছে
- `app/` — পেজ ও লেআউট (Next.js App Router)
  - `app/page.js` — হোমপেজ
  - `app/login/page.js` — লগইন পেজ (এখন "Forgot password?" লিঙ্ক সহ)
  - `app/signup/page.js` — সাইনআপ পেজ (Buyer/Contributor রোল বাছাই করা যায়)
  - `app/forgot-password/page.js` — পাসওয়ার্ড রিসেট রিকোয়েস্ট পেজ
  - `app/browse/page.js` — Browse/Search পেজ (টাইপ, ক্যাটাগরি, লাইসেন্স ফিল্টার + সর্ট)
  - `app/upload/page.js` — Contributor আপলোড পেজ (drag & drop, per-file title/category/keywords, submit for review)
- `components/` — Navbar, SearchBar, AssetCard, AuthCard, FilterSidebar, UploadDropzone
- `lib/sampleAssets.js` — placeholder ডেটা, হোমপেজ আর ব্রাউজ পেজ দুটোই এখান থেকে শেয়ার করে
- `public/` — স্ট্যাটিক ফাইল (লোগো, আইকন ইত্যাদি পরে এখানে রাখবেন)

## ধাপ ৪ সম্পর্কে জরুরি নোট
- **Forgot password:** লগইন পেজে পাসওয়ার্ডের পাশে লিঙ্ক আছে, `/forgot-password`-এ ইমেইল দিলে "check your email" মেসেজ দেখায় — কিন্তু আসল ইমেইল এখনো যায় না (Supabase auth যোগ হলে কাজ করবে)।
- **Upload:** ফাইল ড্র্যাগ-ড্রপ বা ক্লিক করে বাছাই করা যায়, প্রতিটার জন্য টাইটেল/ক্যাটাগরি/কিওয়ার্ড দিতে হয়, সাবমিট করলে কনসোলে লগ হয় আর "submitted for review" মেসেজ দেখায় — কিন্তু ফাইল এখনো কোথাও আসলে আপলোড হয় না (Supabase Storage যোগ হলে কাজ করবে)।
- Navbar-এর "Become a Contributor" আর হোমপেজের "Start Contributing" বাটন এখন `/upload`-এ নিয়ে যায়।

## আপনার কম্পিউটারে চালানোর ধাপ

1. **Node.js ইনস্টল আছে কিনা চেক করুন** (টার্মিনালে):
   ```
   node -v
   ```
   না থাকলে [nodejs.org](https://nodejs.org) থেকে LTS ভার্সন ইনস্টল করুন।

2. **এই ফোল্ডার VS Code-এ খুলুন**, তারপর টার্মিনাল খুলে (`Ctrl+~`) লিখুন:
   ```
   npm install
   ```
   এটা package.json দেখে দরকারি সব প্যাকেজ ডাউনলোড করবে (Next.js, React, Tailwind)।

3. **ডেভেলপমেন্ট সার্ভার চালু করুন:**
   ```
   npm run dev
   ```

4. ব্রাউজারে যান: **http://localhost:3000**

## এখন যা দেখতে পাবেন
- একটা হোমপেজ: হেডার (Navbar), সার্চ বার, ক্যাটাগরি, placeholder ছবির গ্রিড, আর contributor CTA সেকশন
- ছবিগুলো এখন placeholder (picsum.photos থেকে) — পরে আপনার নিজের ডাটাবেস থেকে আসবে

## পরের ধাপগুলো (একটার পর একটা বানাবো)
- [x] Login/Signup পেজ (Contributor আর Buyer আলাদা)
- [x] Forgot password পেজ
- [x] Browse/Search পেজ (ফিল্টার সহ)
- [x] Upload পেজ (Contributor-দের জন্য)
- [ ] Admin panel (approve/reject আপলোড)
- [ ] Database কানেকশন (Supabase)
- [ ] Payment ইন্টিগ্রেশন

কোনো এরর পেলে বা কোনো ধাপ না বুঝলে জানাবেন।
