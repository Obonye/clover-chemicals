# Clover Industries — website copy

Every piece of wording a visitor reads on the site, organised by page and then by component, so you can see where you are working. Product names, descriptions, categories and news-style content that comes from Sanity is **not** here (see the last section).

## How to use this file

1. **Edit the text after the colon** on any line. That is all you need to change.
2. Leave the label, the `file:line` reference and the `(` `)` around it alone. Those tell me where the text lives.
3. When you're done, tell me **"apply the copy changes"**. I'll run `node scripts/check-copy.mjs`, which lists every line whose text no longer matches the code, apply each change in the right file, then re-run it until everything matches and refresh the line numbers.
4. Don't add or delete lines for new copy. Ask me and I'll add the entry.

**Conventions**

- `{curly braces}` are values the code fills in: `{foundedYear}` is 1980, `{years}` is the number of years since, `{siteName}` is "Clover Industries", `{count}` is a number. Keep them where you want them to appear.
- A line marked **⚠** has a question for you or the client, explained in the notes below.
- Some wording is defined once and shown in several places (the contact details, division names, taglines and branch addresses). Those are in **1. Global**, and you only edit them there.
- Wording that is repeated by hand on different pages (for example the "Citizen-Owned & EDD Certified" pillar on both About and the Chemical home page) has to be changed in each place. Both are listed.

## Things I noticed while collecting the copy

These look like inconsistencies or leftovers. None of them is changed yet. Tell me what you'd like done.

1. **"100% citizen-owned" vs "Majority citizen-owned".** Home and About say *100%*; the About pillar and the Chemical home pillar say *Majority* ("Majority citizen-owned and registered under…").
2. **"Eight divisions".** About, the Chemical home page and the stats say **8 Divisions**, but the site only has two division pages (Clover Chemicals and Clover Medical).
3. **"Clover Chemical Industries" vs "Clover Industries".** The News page intro, the news articles and an image description use the old name; everything else uses "Clover Industries".
4. **Placeholder brands on the Medical home page.** The "Brands We Work With" strip lists *Meridian Health, Solace Labs, Ionic Diagnostics, Halcyon Care, Vertex Medical, Nexora*. These look like stand-ins, not Clover's real partners (Philips Medical, Shimadzu and so on).
5. **Brochure link.** The quick-links bar has a "Brochure" button pointing to `/brochure.pdf`, but that file isn't in the site, so it leads nowhere.
6. **News articles can't be opened.** The news list links each story to `/news/{slug}`, but there is no article page, so "Read →" leads to a 404. The six articles are summaries only.
7. **Empty pages.** `/blog`, `/docs` and `/pricing` exist but only show a heading ("Blog", "Docs", "Pricing"). They aren't linked from the menus.
8. **Unused menu text.** `navMenuItems` and `footerItems` in the site config (Personal Protective Equipment, Pool Chemicals, and so on) aren't used anywhere; the menus use live Sanity categories instead.
9. **Contact page category list.** The "Browse by Category" links on the Contact page use a fixed list of four categories (Agricultural, Medical & Pharma, Laboratory, Industrial), not the live Sanity categories, so they don't mention PPE or pool chemicals.
10. **Plain error page.** The "Something went wrong!" page is unstyled and doesn't offer a way back or a contact number.

---

# 1. Global — appears on every page

## 1.1 Site identity and search results

Source: `config/site.ts`, `app/layout.tsx`

- **Company name** (`config/site.ts:10`): Clover Industries
- **Site description** (`config/site.ts:13`): Botswana's one-stop chemical and equipment partner — manufacturing and distribution for industry, agriculture, healthcare, and the laboratory, since 1980.
- **Browser tab title pattern** (`app/layout.tsx:26`): %s - {siteName}

The site description is also used as the home page hero text and in search results.

## 1.2 Company contact details

Source: `config/site.ts`. Shown on Contact, Locations, the footer, the quick-links bar and in emails.

- **Phone** (`config/site.ts:17`): +267 395 3035
- **Sales email** (`config/site.ts:18`): sales@cloverindustries.co.bw
- **WhatsApp** (`config/site.ts:19`): +267 77 816 000
- **Opening hours** (`config/site.ts:20`): Monday – Friday, 8:00 – 17:00 CAT
- **Menu link: About** (`config/site.ts:36`): About Us
- **Menu link: News** (`config/site.ts:37`): News
- **Menu link: Contact** (`config/site.ts:38`): Contact Us

## 1.3 Divisions

Source: `config/divisions.ts`. Shown in the top bar, the home page cards, the footer, menus and on social-share images.

- **Chemical division: name** (`config/divisions.ts:56`): Clover Chemicals
- **Chemical division: short name** (`config/divisions.ts:57`): Chemical
- **Chemical division: tagline** (`config/divisions.ts:58`): Chemicals, equipment & PPE for industry, agriculture, and the lab.
- **Chemical division: contact label** (`config/divisions.ts:68`): Sales
- **Medical division: name** (`config/divisions.ts:74`): Clover Medical
- **Medical division: short name** (`config/divisions.ts:75`): Medical
- **Medical division: tagline** (`config/divisions.ts:76`): Advanced medical, life sciences, and laboratory solutions for Botswana's healthcare sector.
- **Medical division: browse button** (`config/divisions.ts:78`): Explore Product Lines
- **Medical division: contact label** (`config/divisions.ts:86`): Medical Division

## 1.4 Branches

Source: `config/branches.ts`. Shown on Locations, Contact, the footer and in emails.

- **Gaborone: name** (`config/branches.ts:27`): Gaborone Branch (Head Office)
- **Gaborone: address** (`config/branches.ts:28`): Plot 1277, Old Lobatse Road, Gaborone, Botswana
- **Francistown: name** (`config/branches.ts:34`): Francistown Branch
- **Francistown: address** (`config/branches.ts:35`): Plot 31251, Somerset Industrial, Francistown, Botswana

## 1.5 Top bar (division switcher)

Component: `components/utility-bar.tsx`

- **Group name, desktop** (`components/utility-bar.tsx:189`): Clover Industries
- **Group name, phone menu** (`components/utility-bar.tsx:72`): Clover Industries
- **Group description, phone menu** (`components/utility-bar.tsx:72`): Group home: all our divisions
- **Screen-reader hint on the phone menu button** (`components/utility-bar.tsx:94`): : switch division
- **Dropdown label when there are many divisions** (`components/utility-bar.tsx:209`): Divisions

## 1.6 Main menu

Component: `components/navbar.tsx`

- **Logo, small text under CLOVER (group pages)** (`components/navbar.tsx:191`): Lift as you rise
- **Logo, name** (`components/navbar.tsx:183`): CLOVER INDUSTRIES
- **Menu item: Products (division pages)** (`components/navbar.tsx:213`): Products
- **Menu item: Divisions (group pages)** (`components/navbar.tsx:213`): Divisions
- **Dropdown: view all link** (`components/navbar.tsx:244`): View all products →
- **Main button, default** (`components/navbar.tsx:103`): Browse Products
- **Theme toggle label** (`components/navbar.tsx:284`): Toggle theme
- **Phone menu button label** (`components/navbar.tsx:309`): Toggle menu
- **Phone menu title (screen readers)** (`components/navbar.tsx:359`): Menu
- **Phone menu: Divisions heading** (`components/navbar.tsx:405`): Divisions
- **Phone menu: switch heading** (`components/navbar.tsx:434`): Switch Division
- **Phone menu: view all link** (`components/navbar.tsx:396`): View all products →
- **Phone menu: light mode** (`components/navbar.tsx:460`): Light Mode
- **Phone menu: dark mode** (`components/navbar.tsx:460`): Dark Mode

The "Get a Quote" button and the cart icon are in section 8 (RFQ).

## 1.7 Footer

Component: `components/footer.tsx`

- **Logo name** (`components/footer.tsx:63`): CLOVER
- **Logo sub-text** (`components/footer.tsx:66`): Industries
- **Company blurb** (`components/footer.tsx:71`): Manufacturer and distributor of chemicals, equipment, and total solutions for Botswana industry, since {foundedYear}.
- **Established line** (`components/footer.tsx:75`): Est. {foundedYear}
- **Column heading: Divisions** (`components/footer.tsx:82`): Divisions
- **Column heading: Products** (`components/footer.tsx:101`): Products
- **Products: view all** (`components/footer.tsx:119`): View all →
- **Column heading: Company** (`components/footer.tsx:128`): Company
- **Company link: About** (`components/footer.tsx:13`): About Us
- **Company link: News** (`components/footer.tsx:14`): News
- **Company link: Contact** (`components/footer.tsx:15`): Contact Us
- **Company link: Locations** (`components/footer.tsx:16`): Locations
- **Column heading: Branches** (`components/footer.tsx:147`): Branches
- **Copyright** (`components/footer.tsx:171`): © {year} {siteName}. All rights reserved.

## 1.8 Floating quick-links strip (right edge)

Component: `components/quick-links-bar.tsx`

- **Button: WhatsApp** (`components/quick-links-bar.tsx:10`): WhatsApp
- **Button: phone** (`components/quick-links-bar.tsx:15`): Call Us
- **Button: brochure ⚠ (file missing, note 5)** (`components/quick-links-bar.tsx:20`): Brochure

## 1.9 Error page

Component: `app/error.tsx`

- **Heading ⚠ (note 10)** (`app/error.tsx:20`): Something went wrong!
- **Button** (`app/error.tsx:27`): Try again

## 1.10 Social-share image (when a link is shared)

Source: `app/opengraph-image.tsx`, `app/[division]/opengraph-image.tsx`

- **Group image: small line** (`app/opengraph-image.tsx:35`): Est. {foundedYear}
- **Division image: small line** (`app/[division]/opengraph-image.tsx:51`): Clover Industries

The headline and description on these images come from the company name and description, or the division name and tagline, in sections 1.1 and 1.3.

## 1.11 Editor-only (Sanity preview)

Only people editing content in Sanity's preview ever see this. Component: `components/disable-draft-mode.tsx`

- **Button** (`components/disable-draft-mode.tsx:19`): Disable Draft Mode

---

# 2. Home page — `/` (Clover Industries group)

Page: `app/page.tsx`. The page title is the company name.

## 2.1 Hero

- **Small line above the headline** (`app/page.tsx:35`): Est. {foundedYear} · {years}+ Years · 100% Citizen-Owned · EDD Certified
- **Headline** (`app/page.tsx:38`): Botswana's total solutions partner, division by division.
- **Description** (`app/page.tsx:41`): {siteDescription}

The description is the site description in section 1.1.

## 2.2 Our divisions

Two cards, one per division. Name and tagline come from section 1.3.

- **Section label** (`app/page.tsx:50`): Our Divisions
- **Heading** (`app/page.tsx:53`): One group, built to circle the customer.
- **Card link** (`app/page.tsx:80`): Explore {divisionName} →

## 2.3 Who we are

- **Section label** (`app/page.tsx:95`): Who We Are
- **Paragraph** (`app/page.tsx:100`): {siteName} was established in Botswana in {foundedYear} to manufacture and supply chemicals for domestic and industrial use. Today we're 100% citizen-owned, EDD certified, and operating across chemicals, equipment, PPE, and medical divisions.
- **Button** (`app/page.tsx:109`): Learn More →

## 2.4 Latest news

Shows the first three articles from section 6.

- **Section label** (`app/page.tsx:121`): Latest Updates
- **Heading** (`app/page.tsx:124`): News across the group.
- **Link, top right** (`app/page.tsx:131`): View all →
- **Link on each article** (`app/page.tsx:157`): Read →

## 2.5 Call to action banner

Component: `components/cta-banner.tsx`. Also used at the bottom of the Chemical home page (section 9).

- **Small label** (`components/cta-banner.tsx:51`): Work With Us
- **Heading** (`components/cta-banner.tsx:54`): Ready to source with confidence?
- **Text** (`components/cta-banner.tsx:57`): Tell us what you need. Our team responds within one business day with specifications, pricing, and availability.
- **Main button** (`components/cta-banner.tsx:68`): Request a Quote
- **Second link** (`components/cta-banner.tsx:74`): Browse Products →

---

# 3. About page — `/about`

Page: `app/about/page.tsx`

## 3.1 Search result and tab title

- **Title** (`app/about/layout.tsx:4`): About Us
- **Description** (`app/about/layout.tsx:6`): Clover Industries — Botswana's citizen-owned, EDD certified group of divisions, manufacturing and distributing chemicals, equipment, and healthcare solutions since 1980.

## 3.2 Hero

- **Small line** (`app/about/page.tsx:97`): Est. {foundedYear}
- **Headline** (`app/about/page.tsx:100`): {years} years of precision.

## 3.3 Introduction

- **Large paragraph** (`app/about/page.tsx:109`): {siteName} was established in Botswana in {foundedYear} to manufacture and supply chemicals for domestic and industrial use. As demand grew, so did our scope.
- **Smaller paragraph** (`app/about/page.tsx:114`): Today we're 100% citizen-owned and registered under the Economic Diversification Drive (EDD) — manufacturing our own range of cleaning chemicals while serving as authorised distributor for world-leading brands including Diversey, Kimberly Clark, Columbus, Coopers, Shimadzu, and Philips Medical. From cleaning solutions and PPE to laboratory instruments and medical equipment, our strategy is simple: circle the customer.

## 3.4 Numbers strip (dark band)

Four figures, each a big number with a label underneath.

- **Label 1** (`app/about/page.tsx:7`): Year Founded
- **Label 2** (`app/about/page.tsx:8`): Global Partners
- **Number 2** (`app/about/page.tsx:8`): 6
- **Label 3** (`app/about/page.tsx:9`): Divisions
- **Number 3 ⚠ (note 2)** (`app/about/page.tsx:9`): 8
- **Label 4** (`app/about/page.tsx:10`): Certified
- **Number 4** (`app/about/page.tsx:10`): EDD

Number 1 is the founding year from section 1.1.

## 3.5 Pull quote

- **Quote** (`app/about/page.tsx:154`): We don't just supply. We supply certainty.
- **Attribution** (`app/about/page.tsx:157`): — {siteName}, Est. {foundedYear}

## 3.6 Vision, mission and values

- **Section label** (`app/about/page.tsx:166`): Vision, Mission & Values
- **Heading** (`app/about/page.tsx:169`): “Lift as you rise.”
- **Vision: label** (`app/about/page.tsx:174`): Vision
- **Vision: text** (`app/about/page.tsx:177`): To become a one-stop total solutions provider.
- **Mission: label** (`app/about/page.tsx:182`): Mission
- **Mission: text** (`app/about/page.tsx:185`): To provide quality, state-of-the-art, affordable total solutions through excellent customer service.
- **Value 1: heading** (`app/about/page.tsx:38`): Innovation
- **Value 1: text** (`app/about/page.tsx:39`): Flexibility is the key to our offerings — the same spirit of innovation runs through our products and services, from the first purchase through installation and customer support.
- **Value 2: heading** (`app/about/page.tsx:42`): Insight
- **Value 2: text** (`app/about/page.tsx:43`): Our team draws on decades of vision, skill, and professionalism to foresee industry trends and meet demanding customer needs, keeping our offering competitive at all times.
- **Value 3: heading** (`app/about/page.tsx:46`): Integrity
- **Value 3: text** (`app/about/page.tsx:47`): The very soul of our company — reflected in our finances and in the trusted relationships we share with our customers and business partners.

## 3.7 Our history (timeline)

- **Section label** (`app/about/page.tsx:209`): Our History
- **Heading** (`app/about/page.tsx:212`): From a single facility to a total solutions provider.
- **Entry 1: text** (`app/about/page.tsx:63`): Founded in Gaborone, Botswana to manufacture and supply chemicals for domestic and industrial use.
- **Entry 2: label** (`app/about/page.tsx:66`): Expansion
- **Entry 2: text** (`app/about/page.tsx:67`): Grew into distribution, becoming an authorised agent for global brands including Diversey, Kimberly Clark, Columbus, Coopers, Shimadzu, and Philips Medical.
- **Entry 3: label** (`app/about/page.tsx:70`): Compliance
- **Entry 3: text** (`app/about/page.tsx:71`): Registered under the EDD and certified in Agrochemicals, Manufacturing, Radiation, Workshop, and Public Health, holding BOBS standards for dishwash, disinfectant, and sanitiser.
- **Entry 4: label** (`app/about/page.tsx:74`): Today
- **Entry 4: text ⚠ (note 2)** (`app/about/page.tsx:75`): Operating eight divisions — from cleaning and paper products to PPE, pool care, lab & scientific, and medical equipment — under one strategy: circle the customer.

Entry 1's label is the founding year.

## 3.8 What sets us apart

Four numbered blocks. The numbers 01–04 are fixed.

- **Section label** (`app/about/page.tsx:236`): What Sets Us Apart
- **Heading** (`app/about/page.tsx:239`): Built on compliance, backed by global brands.
- **Block 1: heading** (`app/about/page.tsx:16`): Citizen-Owned & EDD Certified
- **Block 1: text ⚠ (note 1)** (`app/about/page.tsx:17`): Majority citizen-owned and registered under Botswana's Economic Diversification Drive, giving our clients the procurement compliance they need for government and institutional contracts.
- **Block 2: heading** (`app/about/page.tsx:21`): Global Brands, Local Support
- **Block 2: text** (`app/about/page.tsx:22`): Authorised distributor for Diversey, Kimberly Clark, Columbus, Coopers, Shimadzu, and Philips Medical — with world-class products backed by a team on the ground in Botswana.
- **Block 3: heading** (`app/about/page.tsx:26`): Foremost in Medical & Lab Solutions
- **Block 3: text** (`app/about/page.tsx:27`): One of Botswana's foremost providers of innovative healthcare and scientific instrumentation, from ventilators and patient monitors to autoclaves and analytical equipment.
- **Block 4: heading** (`app/about/page.tsx:31`): One-Stop, Total Solutions
- **Block 4: text** (`app/about/page.tsx:32`): Our strategy is to circle the customer — adding new products, equipment, and services so you get chemicals, equipment, and expertise from a single, trusted partner.

## 3.9 Our partners

- **Section label** (`app/about/page.tsx:263`): Our Partners
- **Heading** (`app/about/page.tsx:266`): Trusted agents for the world's leading manufacturers.
- **Partner 1** (`app/about/page.tsx:52`): Diversey
- **Partner 2** (`app/about/page.tsx:53`): Kimberly Clark
- **Partner 3** (`app/about/page.tsx:54`): Columbus
- **Partner 4** (`app/about/page.tsx:55`): Coopers
- **Partner 5** (`app/about/page.tsx:56`): Shimadzu
- **Partner 6** (`app/about/page.tsx:57`): Philips Medical

## 3.10 Closing call to action

- **Heading** (`app/about/page.tsx:289`): Ready to work with us?
- **Text** (`app/about/page.tsx:292`): Speak to our team about your supply needs — chemical, medical, or lab. We respond within one business day.
- **Main button** (`app/about/page.tsx:301`): Get in Touch
- **Second button** (`app/about/page.tsx:307`): Browse Products

---

# 4. Contact page — `/contact`

Page: `app/contact/page.tsx`. Messages from this form are emailed to the right Clover inbox (see section 11).

## 4.1 Search result and tab title

- **Title** (`app/contact/layout.tsx:4`): Contact Us
- **Description** (`app/contact/layout.tsx:6`): Get in touch with Clover Industries. Our team responds within one business day with specifications, pricing, and availability.

## 4.2 Page header

- **Small label** (`app/contact/page.tsx:41`): Get in Touch
- **Heading** (`app/contact/page.tsx:44`): Contact Us
- **Intro** (`app/contact/page.tsx:47`): Tell us what you need. Our team responds within one business day with specifications, pricing, and availability.

## 4.3 Form

- **Name: label** (`app/contact/page.tsx:103`): Full Name
- **Name: example text** (`app/contact/page.tsx:111`): John Smith
- **Company: label** (`app/contact/page.tsx:119`): Company / Organisation
- **Company: example text** (`app/contact/page.tsx:126`): Acme Ltd.
- **Email: label** (`app/contact/page.tsx:136`): Email Address
- **Email: example text** (`app/contact/page.tsx:144`): john@example.com
- **Phone: label** (`app/contact/page.tsx:152`): Phone Number
- **Phone: example text** (`app/contact/page.tsx:160`): +267 71 234 567
- **Nature of enquiry: label** (`app/contact/page.tsx:169`): Nature of Enquiry
- **Nature of enquiry: first option** (`app/contact/page.tsx:180`): Select an option
- **Nature of enquiry: option 1** (`config/enquiry-routing.ts:22`): Chemicals
- **Nature of enquiry: option 2** (`config/enquiry-routing.ts:23`): Medical
- **Nature of enquiry: option 3** (`config/enquiry-routing.ts:24`): Complaint
- **Nature of enquiry: option 4** (`config/enquiry-routing.ts:25`): Other
- **Message: label** (`app/contact/page.tsx:193`): Message / Requirements
- **Message: example text** (`app/contact/page.tsx:200`): Describe what you need — product names, quantities, grades, pack sizes, or any other details.
- **Submit button** (`app/contact/page.tsx:213`): Send Message
- **Submit button while sending** (`app/contact/page.tsx:213`): Sending…
- **Note under the button** (`app/contact/page.tsx:216`): We respond within one business day.

Fields with a red star (*) are Full Name, Email Address, Nature of Enquiry and Message. A complaint goes to one person; everything else goes to the three team inboxes (section 11).

## 4.4 After sending

- **Small label** (`app/contact/page.tsx:63`): Message Sent
- **Heading** (`app/contact/page.tsx:66`): Thank you — we'll be in touch.
- **Text** (`app/contact/page.tsx:69`): Our team will respond within one business day with specifications, pricing, and availability for your enquiry. Your reference is {reference}.
- **Link** (`app/contact/page.tsx:78`): Send another message →

## 4.5 Error messages

- **Name missing** (`app/contact/actions.ts:23`): Enter your full name
- **Email invalid** (`app/contact/actions.ts:24`): Enter a valid email address
- **Nature of enquiry not chosen** (`app/contact/actions.ts:25`): Choose the nature of your enquiry
- **Message missing** (`app/contact/actions.ts:26`): Tell us a little about what you need
- **Phone invalid** (`lib/contact/schema.ts:21`): Enter a valid phone number
- **Banner above the form** (`app/contact/actions.ts:53`): Please check the highlighted fields.
- **Too many messages** (`app/contact/actions.ts:64`): You've sent several messages in the last hour. Please try again in about {minutes} minute{s}, or call us directly.
- **Could not send** (`app/contact/actions.ts:75`): We couldn't send your message just now. Please try again, or email us directly.

## 4.6 Side panel: our offices

Names, addresses, phone, email, WhatsApp and hours come from sections 1.2 and 1.4.

- **Heading** (`app/contact/page.tsx:227`): Our Offices
- **Email label** (`app/contact/page.tsx:242`): Email
- **Phone label** (`app/contact/page.tsx:251`): Phone
- **WhatsApp label** (`app/contact/page.tsx:260`): WhatsApp
- **Hours label** (`app/contact/page.tsx:271`): Business Hours

## 4.7 Side panel: browse by category

- **Heading** (`app/contact/page.tsx:279`): Browse by Category

The category names are from section 7.8.

---

# 5. Locations page — `/locations`

Page: `app/locations/page.tsx`. Branch names, addresses, phone, email and hours come from sections 1.2 and 1.4.

## 5.1 Search result and tab title

- **Title** (`app/locations/layout.tsx:4`): Locations
- **Description** (`app/locations/layout.tsx:6`): Clover Industries branch locations in Botswana — addresses, contact details, and directions.

## 5.2 Page header

- **Small label** (`app/locations/page.tsx:18`): Find Us
- **Heading** (`app/locations/page.tsx:21`): Our Locations
- **Intro** (`app/locations/page.tsx:24`): Visit us at either branch, or reach our technical team directly — phone, email and WhatsApp details below.

## 5.3 Branch cards

- **Head office badge** (`app/locations/page.tsx:51`): Head Office
- **Directions button** (`app/locations/page.tsx:96`): Get Directions
- **Enquiry button** (`app/locations/page.tsx:102`): Send an Enquiry
- **WhatsApp line under the cards** (`app/locations/page.tsx:114`): Prefer WhatsApp?

---

# 6. News page — `/news`

Page: `app/news/page.tsx`. Articles are in `lib/news.ts`. ⚠ Notes 3 and 6 apply.

## 6.1 Search result and tab title

- **Title** (`app/news/layout.tsx:4`): News
- **Description** (`app/news/layout.tsx:6`): The latest news and announcements from Clover Industries and its divisions.

## 6.2 Page header

- **Small label** (`app/news/page.tsx:22`): Latest Updates
- **Heading** (`app/news/page.tsx:25`): News
- **Intro ⚠ (note 3)** (`app/news/page.tsx:28`): Company announcements, industry developments, and product updates from Clover Chemical Industries.

## 6.3 Buttons

- **Featured article link** (`app/news/page.tsx:71`): Read more →
- **Other article link** (`app/news/page.tsx:110`): Read →

## 6.4 Articles

Each article shows a category, headline, summary, date and reading time. The first article is the large featured one.

- **Article 1: category** (`lib/news.ts:14`): Company News
- **Article 1: headline ⚠ (note 3)** (`lib/news.ts:15`): Clover Chemical Expands Operations into Zambia
- **Article 1: summary ⚠ (note 3)** (`lib/news.ts:17`): Following sustained growth across our Medical & Laboratory division, Clover Chemical Industries has formalised its investment in Zambia, extending our precision chemical supply network to a second southern African market.
- **Article 1: date** (`lib/news.ts:18`): 12 May 2025
- **Article 1: reading time** (`lib/news.ts:19`): 4 min read
- **Article 2: category** (`lib/news.ts:25`): Products
- **Article 2: headline** (`lib/news.ts:26`): New Shimadzu Analytical Instruments Now Available
- **Article 2: summary** (`lib/news.ts:28`): As authorised agents for Shimadzu, we are pleased to offer the latest range of UV-Vis spectrophotometers, HPLC systems, and gas chromatographs to laboratories across Botswana.
- **Article 2: date** (`lib/news.ts:29`): 3 Apr 2025
- **Article 2: reading time** (`lib/news.ts:30`): 3 min read
- **Article 3: category** (`lib/news.ts:36`): Industry
- **Article 3: headline** (`lib/news.ts:37`): Agricultural Chemical Demand Grows Across Southern Africa
- **Article 3: summary** (`lib/news.ts:39`): Rising food security concerns and expanding commercial farming operations are driving significant growth in demand for crop-protection formulations and fertilizers across the SADC region.
- **Article 3: date** (`lib/news.ts:40`): 18 Mar 2025
- **Article 3: reading time** (`lib/news.ts:41`): 5 min read
- **Article 4: category** (`lib/news.ts:47`): Products
- **Article 4: headline** (`lib/news.ts:48`): Philips Medical Equipment Now Fully Serviced Locally
- **Article 4: summary ⚠ (note 3)** (`lib/news.ts:50`): Clover Chemical Industries has expanded its service capability for Philips Medical imaging and diagnostic equipment, reducing downtime for hospitals and clinics across Botswana.
- **Article 4: date** (`lib/news.ts:51`): 5 Feb 2025
- **Article 4: reading time** (`lib/news.ts:52`): 3 min read
- **Article 5: category** (`lib/news.ts:58`): Company News
- **Article 5: headline** (`lib/news.ts:59`): EDD Certification Renewed for 2025
- **Article 5: summary ⚠ (note 3)** (`lib/news.ts:61`): Clover Chemical Industries has successfully renewed its Economic Diversification Drive certification, reinforcing our compliance for government and institutional procurement contracts.
- **Article 5: date** (`lib/news.ts:62`): 20 Jan 2025
- **Article 5: reading time** (`lib/news.ts:63`): 2 min read
- **Article 6: category** (`lib/news.ts:69`): Partnerships
- **Article 6: headline** (`lib/news.ts:70`): Thermo Fisher Partnership Strengthens Laboratory Division
- **Article 6: summary** (`lib/news.ts:72`): Our ongoing partnership with Thermo Fisher Scientific brings the latest in laboratory consumables, reagents, and instrumentation to research facilities and quality-control labs across the region.
- **Article 6: date** (`lib/news.ts:73`): 8 Jan 2025
- **Article 6: reading time** (`lib/news.ts:74`): 3 min read

---

# 7. Products — `/products`, `/chemical/products`, `/medical/products`, category and product pages

The product names, descriptions, grades, pack sizes, categories and images all come from Sanity (see the last section). Only the wording around them is here.

## 7.1 All products page — `/products`

Page: `app/products/(catalogue)/page.tsx`

- **Title** (`app/products/(catalogue)/page.tsx:24`): All Products
- **Description** (`app/products/(catalogue)/page.tsx:26`): Browse the full Clover Industries catalogue — chemicals, equipment, PPE, and medical and laboratory supplies across every division.
- **Page heading (hidden, for search engines)** (`app/products/(catalogue)/page.tsx:44`): All Products
- **Bottom banner: heading** (`app/products/(catalogue)/page.tsx:66`): Can't find what you need?
- **Bottom banner: text** (`app/products/(catalogue)/page.tsx:69`): We source on request. Speak to our team about custom formulations and specialist procurement.
- **Bottom banner: button** (`app/products/(catalogue)/page.tsx:77`): Contact Us

## 7.2 Division product pages — `/chemical/products`, `/medical/products`

Page: `app/[division]/products/page.tsx`

- **Tab title** (`app/[division]/products/page.tsx:31`): Products
- **Page heading (hidden, for search engines)** (`app/[division]/products/page.tsx:53`): {divisionName} Products

## 7.3 Search and filters (all product listings)

Component: `components/product-catalogue.tsx`, `components/product-search.tsx`

- **Search box: label (screen readers)** (`components/product-search.tsx:18`): Search products
- **Search box: example text** (`components/product-search.tsx:21`): Search products — pine gel, sanitiser, X-ray film, herbicide...
- **Category chips: label (screen readers)** (`components/product-catalogue.tsx:278`): Filter by category
- **Category chips: first chip** (`components/product-catalogue.tsx:286`): All
- **Division toggle: label (screen readers)** (`components/product-catalogue.tsx:209`): Filter by division
- **Division toggle: option 1** (`components/product-catalogue.tsx:38`): All
- **Division toggle: option 2** (`components/product-catalogue.tsx:39`): Chemical
- **Division toggle: option 3** (`components/product-catalogue.tsx:40`): Medical
- **Sort: label (screen readers)** (`components/product-catalogue.tsx:227`): Sort products
- **Sort: option 1** (`components/product-catalogue.tsx:33`): Name (A–Z)
- **Sort: option 2** (`components/product-catalogue.tsx:34`): Featured first
- **Promotion switch** (`components/product-catalogue.tsx:250`): On Promotion
- **Phone: filters button** (`components/product-catalogue.tsx:266`): Filters
- **Phone: filters panel title** (`components/product-catalogue.tsx:315`): Filters
- **Phone: Division heading** (`components/product-catalogue.tsx:321`): Division
- **Phone: Sort heading** (`components/product-catalogue.tsx:329`): Sort by
- **Phone: clear button** (`components/product-catalogue.tsx:344`): Clear
- **Phone: done button** (`components/product-catalogue.tsx:347`): Done
- **Result count** (`components/product-catalogue.tsx:371`): {count} product{s}
- **No results message** (`components/product-catalogue.tsx:387`): No products matched your filters. Try a different term, or speak to our team about custom sourcing.
- **No results: clear link** (`components/product-catalogue.tsx:397`): Clear filters
- **No results: contact link** (`components/product-catalogue.tsx:404`): Contact Us →

## 7.4 Category page — `/products/{category}`

Page: `app/products/[category]/page.tsx`. The category name and description come from Sanity.

- **Back link** (`app/products/[category]/page.tsx:91`): ← All Products
- **Small label** (`app/products/[category]/page.tsx:94`): Product Range
- **Count** (`app/products/[category]/page.tsx:134`): {count} products
- **Bottom banner: heading** (`app/products/[category]/page.tsx:156`): Need something specific?
- **Bottom banner: text** (`app/products/[category]/page.tsx:159`): We source on request. Speak to our team about custom grades, pack sizes, and specialist procurement.
- **Bottom banner: button** (`app/products/[category]/page.tsx:167`): Contact Us

## 7.5 Product page — `/products/{category}/{product}`

Page: `app/products/[category]/[product]/page.tsx`

- **Tab title pattern** (`app/products/[category]/[product]/page.tsx:99`): {productName} ({grade}) | {categoryName}
- **Breadcrumb: first link** (`app/products/[category]/[product]/page.tsx:174`): Products
- **Badge on the photo** (`app/products/[category]/[product]/page.tsx:201`): On Promotion
- **Availability: in stock** (`app/products/[category]/[product]/page.tsx:238`): Available to Order
- **Availability: not in stock** (`app/products/[category]/[product]/page.tsx:238`): Contact for Availability
- **Pack sizes heading** (`app/products/[category]/[product]/page.tsx:248`): Pack Sizes
- **Link under the Add to RFQ button** (`app/products/[category]/[product]/page.tsx:269`): Or send a one-off enquiry about this product
- **Documents heading** (`app/products/[category]/[product]/page.tsx:30`): Documents
- **Document line: revision** (`app/products/[category]/[product]/page.tsx:35`): Revised {date}
- **Document line: file type** (`app/products/[category]/[product]/page.tsx:38`): PDF
- **Document button** (`app/products/[category]/[product]/page.tsx:58`): Download
- **Related products heading** (`app/products/[category]/[product]/page.tsx:284`): More in {categoryName}

## 7.6 Product cards (in every listing)

Component: `components/product-card.tsx`

- **Badge on the photo** (`components/product-card.tsx:49`): On Promotion
- **Safety sheet link** (`components/product-card.tsx:108`): SDS
- **Spec sheet link** (`components/product-card.tsx:108`): Spec sheet
- **File type after the link** (`components/product-card.tsx:108`): (PDF) ↓
- **Screen-reader text for the link** (`components/product-card.tsx:103`): Download the {document} for {productName} (PDF)

The "Add to RFQ" controls are in section 8.

## 7.7 Document names

Used when a product document has no title of its own. Source: `sanity/lib/format.ts`.

- **Spec sheet** (`sanity/lib/format.ts:11`): Spec sheet
- **Safety data sheet** (`sanity/lib/format.ts:12`): Safety Data Sheet (SDS)
- **Label** (`sanity/lib/format.ts:13`): Label
- **Certificate** (`sanity/lib/format.ts:14`): Certificate
- **Registration** (`sanity/lib/format.ts:15`): Registration
- **Anything else** (`sanity/lib/format.ts:27`): Document

## 7.8 Fixed category list (contact form)

The Contact page's "Browse by Category" links use this list, not the live catalogue (note 9). Source: `lib/products.ts`. Only the four names below are used. The same file also holds a category description and four sample products for each category (Clover Pure Lawn, Glyphosate 360 SL Herbicide, Hydrochloric Acid 37% and so on), but no page shows them, so they aren't listed here.

- **Category 1** (`lib/products.ts:21`): Agricultural Chemicals
- **Category 2** (`lib/products.ts:60`): Medical & Pharma
- **Category 3** (`lib/products.ts:98`): Laboratory Chemicals
- **Category 4** (`lib/products.ts:136`): Industrial Solutions

---

# 8. Request for Quote (RFQ) — `/rfq`, and the "Add to RFQ" controls

How an RFQ works: a visitor adds products to a list from any product, opens `/rfq`, reviews the list, fills in their details and sends it. They get a confirmation email (section 11) and the Sales team is copied.

## 8.1 Search result and tab title

- **Title** (`app/rfq/layout.tsx:4`): Request for Quote
- **Description** (`app/rfq/layout.tsx:5`): Review the products you've collected and send them to Clover Industries for a quotation.

## 8.2 Page header

- **Heading** (`app/rfq/page.tsx:9`): Your RFQ
- **Intro** (`app/rfq/page.tsx:11`): Review your products, then send the list to us for a quotation.

## 8.3 When the list is empty

Component: `components/rfq/rfq-list.tsx`

- **Heading** (`components/rfq/rfq-list.tsx:24`): Your RFQ list is empty
- **Text** (`components/rfq/rfq-list.tsx:27`): A Request for Quote lets you collect several products, from either division, and send them to us in one go.
- **Step label** (`components/rfq/rfq-list.tsx:36`): Step {number}
- **Step 1: title** (`components/rfq/rfq-list.tsx:15`): Add products
- **Step 1: text** (`components/rfq/rfq-list.tsx:15`): Use “Add to RFQ” on any product, with the pack size and quantity you need.
- **Step 2: title** (`components/rfq/rfq-list.tsx:16`): Review your list
- **Step 2: text** (`components/rfq/rfq-list.tsx:16`): Adjust quantities and add notes here. Your list is saved on this device.
- **Step 3: title** (`components/rfq/rfq-list.tsx:17`): Send it to us
- **Step 3: text** (`components/rfq/rfq-list.tsx:17`): We price every request for you and reply with a quotation.
- **Division buttons** (`components/rfq/rfq-list.tsx:51`): Browse {divisionName}
- **Question under the buttons** (`components/rfq/rfq-list.tsx:56`): Just have a single question?
- **Link** (`components/rfq/rfq-list.tsx:58`): Send us an enquiry
- **While loading (screen readers)** (`components/rfq/rfq-list.tsx:66`): Loading your RFQ list

## 8.4 The list

- **Table caption (screen readers)** (`components/rfq/rfq-list.tsx:195`): Products in your request for quote
- **Column 1** (`components/rfq/rfq-list.tsx:205`): Product
- **Column 2** (`components/rfq/rfq-list.tsx:206`): Pack size
- **Column 3** (`components/rfq/rfq-list.tsx:207`): Quantity
- **Column 4** (`components/rfq/rfq-list.tsx:208`): Note
- **Column 5 (screen readers)** (`components/rfq/rfq-list.tsx:210`): Remove
- **Note field: example text** (`components/rfq/rfq-table-row.tsx:153`): Optional note
- **Note field: hint on hover** (`components/rfq/rfq-table-row.tsx:27`): Anything we should know when quoting this item: grade or certification needs, preferred brand, packaging, delivery timing or a regular order schedule.
- **Note field label (screen readers)** (`components/rfq/rfq-table-row.tsx:149`): Note for {productName}
- **Pack size label (screen readers)** (`components/rfq/rfq-table-row.tsx:115`): Pack size for {productName}
- **Remove button label (screen readers)** (`components/rfq/rfq-table-row.tsx:185`): Remove {item} from RFQ
- **Problem: product removed** (`components/rfq/rfq-table-row.tsx:21`): This product is no longer in our catalogue, so it won't be included. Remove it, or mention it in your message.
- **Problem: product unavailable** (`components/rfq/rfq-table-row.tsx:22`): Currently unavailable, so it won't be included. Remove it, or ask us about alternatives in your message.
- **Problem: pack size gone** (`components/rfq/rfq-table-row.tsx:23`): The pack size you chose is no longer offered. Pick another to include this item.
- **Warning if the catalogue check fails** (`components/rfq/rfq-list.tsx:186`): We couldn't check your list against our latest catalogue.
- **Warning: retry link** (`components/rfq/rfq-list.tsx:188`): Try again
- **Link under the list** (`components/rfq/rfq-list.tsx:227`): ← Add more products
- **Clear: button** (`components/rfq/rfq-list.tsx:91`): Clear list
- **Clear: group label (screen readers)** (`components/rfq/rfq-list.tsx:104`): Confirm clearing the list
- **Clear: question** (`components/rfq/rfq-list.tsx:112`): Remove all {count} item{s}?
- **Clear: confirm** (`components/rfq/rfq-list.tsx:123`): Yes, clear
- **Clear: cancel** (`components/rfq/rfq-list.tsx:126`): Cancel

## 8.5 Summary box

- **Label (screen readers)** (`components/rfq/rfq-list.tsx:241`): RFQ summary
- **Heading** (`components/rfq/rfq-list.tsx:243`): Summary
- **Row: items** (`components/rfq/rfq-list.tsx:246`): Items
- **Row: problems** (`components/rfq/rfq-list.tsx:253`): Need attention
- **Note: no prices** (`components/rfq/rfq-list.tsx:259`): There are no prices online: we quote every request individually, based on your quantities and delivery location.
- **Note: problem items** (`components/rfq/rfq-list.tsx:264`): Items marked as needing attention won't be sent until they're fixed.

## 8.6 Details form

Component: `components/rfq/rfq-details-form.tsx`

- **Heading** (`components/rfq/rfq-details-form.tsx:134`): Your details
- **Intro** (`components/rfq/rfq-details-form.tsx:136`): We'll reply with a quotation, usually within one business day.
- **Full name** (`components/rfq/rfq-details-form.tsx:159`): Full name
- **Company** (`components/rfq/rfq-details-form.tsx:160`): Company
- **Email** (`components/rfq/rfq-details-form.tsx:161`): Email
- **Phone: label** (`components/rfq/rfq-details-form.tsx:162`): Phone
- **Phone: example text** (`components/rfq/rfq-details-form.tsx:162`): +267 71 234 567
- **Delivery or collection: heading** (`components/rfq/rfq-details-form.tsx:173`): Delivery or collection
- **Option 1: name** (`components/rfq/rfq-details-form.tsx:68`): Delivery
- **Option 1: description** (`components/rfq/rfq-details-form.tsx:68`): We deliver to your site and include it in the quote.
- **Option 2: name** (`components/rfq/rfq-details-form.tsx:69`): Collection
- **Option 2: description** (`components/rfq/rfq-details-form.tsx:69`): You collect the order from one of our branches.
- **Delivery: location label** (`components/rfq/rfq-details-form.tsx:202`): Delivery location
- **Delivery: location hint** (`components/rfq/rfq-details-form.tsx:201`): Town or site address.
- **Delivery: nearest branch label** (`components/rfq/rfq-details-form.tsx:205`): Nearest branch
- **Delivery: nearest branch placeholder** (`components/rfq/rfq-details-form.tsx:205`): No preference
- **Collection: branch label** (`components/rfq/rfq-details-form.tsx:209`): Collect from
- **Collection: branch placeholder** (`components/rfq/rfq-details-form.tsx:209`): Choose a branch
- **Date: label** (`components/rfq/rfq-details-form.tsx:214`): Required by
- **Date: button label (screen readers)** (`components/rfq/rfq-details-form.tsx:218`): Choose a required-by date
- **Date: calendar label (screen readers)** (`components/rfq/rfq-details-form.tsx:225`): Required-by date
- **Message: label** (`components/rfq/rfq-details-form.tsx:249`): Message
- **Message: example text** (`components/rfq/rfq-details-form.tsx:250`): Anything else we should know about this request.
- **Send button** (`components/rfq/rfq-details-form.tsx:256`): Send request ({count} item{s})
- **Send button while sending** (`components/rfq/rfq-details-form.tsx:256`): Sending…
- **Status while checking** (`components/rfq/rfq-details-form.tsx:258`): Checking your list…
- **Status if every item has a problem** (`components/rfq/rfq-details-form.tsx:260`): Fix the items marked above to send your request.

## 8.7 After sending

- **Small label** (`components/rfq/rfq-list.tsx:139`): Request sent
- **Heading** (`components/rfq/rfq-list.tsx:141`): Thank you. We'll be in touch with your quotation.
- **Text** (`components/rfq/rfq-list.tsx:144`): Your reference is {reference}. Please quote it if you contact us about this request.
- **Left-out items notice: start (one item)** (`components/rfq/rfq-list.tsx:150`): One item was
- **Left-out items notice: start (several)** (`components/rfq/rfq-list.tsx:150`): {count} items were
- **Left-out items notice: middle** (`components/rfq/rfq-list.tsx:150`): left out because
- **Left-out items notice: one item** (`components/rfq/rfq-list.tsx:151`): it's
- **Left-out items notice: several items** (`components/rfq/rfq-list.tsx:151`): they're
- **Left-out items notice: end** (`components/rfq/rfq-list.tsx:151`): no longer available as listed:
- **Button** (`components/rfq/rfq-list.tsx:155`): Start a new request

## 8.8 Error messages

- **Name missing** (`app/rfq/actions.ts:44`): Enter your full name
- **Company missing** (`app/rfq/actions.ts:45`): Enter your company or organisation
- **Email invalid** (`app/rfq/actions.ts:46`): Enter a valid email address
- **Phone invalid** (`lib/rfq/schema.ts:41`): Enter a valid phone number
- **Delivery or collection not chosen** (`lib/rfq/schema.ts:42`): Choose delivery or collection
- **Branch not recognised** (`lib/rfq/schema.ts:46`): Choose one of our branches
- **Date in the past** (`lib/rfq/schema.ts:54`): Required-by date can't be in the past
- **Delivery location missing** (`lib/rfq/schema.ts:60`): Enter where we should deliver to
- **Collection branch missing** (`lib/rfq/schema.ts:63`): Choose the branch you'll collect from
- **Banner above the form** (`app/rfq/actions.ts:126`): Please check the highlighted fields.
- **Product list unreadable** (`app/rfq/actions.ts:132`): Your product list couldn't be read. Refresh the page and try again.
- **Form unreadable** (`app/rfq/actions.ts:133`): Something in the form couldn't be read. Please try again.
- **Too many requests** (`app/rfq/actions.ts:146`): You've sent several requests in the last hour. Please try again in about {minutes} minute{s}, or call us directly.
- **Catalogue check failed** (`app/rfq/actions.ts:157`): We couldn't check your list against our catalogue just now. Please try again in a moment.
- **Nothing left to quote** (`app/rfq/actions.ts:164`): None of the products in your list can be quoted right now. Please review your list and try again.
- **Could not send** (`app/rfq/actions.ts:180`): We couldn't send your request just now. Please try again, or contact us directly.

## 8.9 "Add to RFQ" on products

Component: `components/rfq/add-to-rfq.tsx` (product cards and product pages)

- **Button** (`components/rfq/add-to-rfq.tsx:99`): Add to RFQ
- **Button after adding** (`components/rfq/add-to-rfq.tsx:145`): Added ✓
- **Link after adding** (`components/rfq/add-to-rfq.tsx:152`): View RFQ
- **Unavailable product: text** (`components/rfq/add-to-rfq.tsx:102`): Currently unavailable,
- **Unavailable product: link** (`components/rfq/add-to-rfq.tsx:104`): ask us
- **Pack size dropdown: placeholder** (`components/rfq/pack-size-select.tsx:37`): Choose a pack size
- **Pack size dropdown: label (screen readers)** (`components/rfq/add-to-rfq.tsx:117`): Pack size for {productName}
- **Quantity: label (screen readers)** (`components/rfq/quantity-stepper.tsx:26`): Quantity for {productName}
- **Confirmation (screen readers)** (`components/rfq/add-to-rfq.tsx:84`): Added {quantity} × {productName} to your RFQ
- **List is full** (`components/rfq/add-to-rfq.tsx:86`): Your RFQ already has {max} items. Send it or remove some before adding more.

## 8.10 "Get a Quote" button and cart icon

Component: `components/rfq/rfq-nav-button.tsx`

- **Main menu button** (`components/rfq/rfq-nav-button.tsx:87`): Get a Quote
- **Phone menu button when the list is empty** (`components/rfq/rfq-nav-button.tsx:70`): Get a Quote
- **Phone menu button when the list has items** (`components/rfq/rfq-nav-button.tsx:66`): View RFQ
- **Cart icon label, empty (screen readers)** (`components/rfq/rfq-nav-button.tsx:107`): Request for quote list
- **Cart icon label, with items (screen readers)** (`components/rfq/rfq-nav-button.tsx:10`): Request for quote, {count} item{s}

---

# 9. Clover Chemicals home page — `/chemical`

Page: `components/divisions/chemical-home.tsx`. Sections from top to bottom: Hero, Partners strip, Our Product Lines, Popular, Specials, Heritage, Call to action.

## 9.1 Hero

Component: `components/hero-chemicals.tsx`

- **Photo description (screen readers) ⚠ (note 3)** (`components/hero-chemicals.tsx:13`): Clover Chemical Industries facility
- **Small line** (`components/hero-chemicals.tsx:28`): {years}+ Years · 100% Citizen-Owned
- **Headline** (`components/hero-chemicals.tsx:32`): Botswana's One Stop Chemical & Equipment Partner.
- **Text** (`components/hero-chemicals.tsx:37`): Chemicals, equipment, and PPE for agriculture, healthcare, and industry.
- **Main button** (`components/hero-chemicals.tsx:46`): Browse Products
- **Second button** (`components/hero-chemicals.tsx:52`): Get a Quote

The words "One Stop" in the headline are shown in the accent colour.

## 9.2 Partners strip (scrolling names)

Component: `components/partners-strip.tsx`

- **Label** (`components/partners-strip.tsx:16`): Trusted Partners
- **Partner 1** (`components/partners-strip.tsx:2`): Diversey
- **Partner 2** (`components/partners-strip.tsx:3`): Kimberly Clark
- **Partner 3** (`components/partners-strip.tsx:4`): Columbus
- **Partner 4** (`components/partners-strip.tsx:5`): Coopers
- **Partner 5** (`components/partners-strip.tsx:6`): Shimadzu
- **Partner 6** (`components/partners-strip.tsx:7`): Philips Medical

## 9.3 Our product lines

Component: `components/products-section.tsx`. The panels (category name and description) come from Sanity.

- **Heading** (`components/products-section.tsx:52`): Our Product Lines.
- **Link** (`components/products-section.tsx:58`): View all →

## 9.4 Popular products

Component: `components/best-sellers.tsx`. The products are chosen in Sanity. The whole section is hidden if none are chosen.

- **Heading** (`components/best-sellers.tsx:23`): Popular.
- **Link** (`components/best-sellers.tsx:30`): View full catalogue →

## 9.5 Current specials

Component: `components/specials-banner.tsx`. Headline, description, picture and end date come from Sanity. The whole section is hidden when no promotion is active.

- **Badge** (`components/specials-banner.tsx:64`): Current Specials
- **End date** (`components/specials-banner.tsx:68`): Valid until {date}
- **Button** (`components/specials-banner.tsx:87`): Browse Products
- **Picture description if none is set** (`components/specials-banner.tsx:51`): Current specials

## 9.6 Heritage

Component: `components/heritage-section.tsx`. ⚠ Notes 1 and 2 apply. Wording here repeats the About page and has to be changed in both places.

- **Small label** (`components/heritage-section.tsx:36`): Est. {foundedYear}
- **Heading** (`components/heritage-section.tsx:42`): Rooted in Botswana. Trusted by global industry.
- **Paragraph 1** (`components/heritage-section.tsx:45`): {siteName} was established in Botswana in {foundedYear} to manufacture and supply chemicals for domestic and industrial use. As demand grew, so did our scope, and today we're authorised distributors for some of the world's leading manufacturers, including Diversey, Kimberly Clark, and Columbus.
- **Paragraph 2 ⚠ (note 2)** (`components/heritage-section.tsx:52`): Our Medical & Laboratory division brings equipment from Philips Medical and Shimadzu to hospitals, clinics, and research facilities — one of eight divisions built around a single strategy: circle the customer.
- **Data table heading** (`components/heritage-section.tsx:62`): Company Data
- **Row 1: label** (`components/heritage-section.tsx:4`): Year Founded
- **Row 2: label** (`components/heritage-section.tsx:5`): Global Partners
- **Row 2: value** (`components/heritage-section.tsx:5`): 6
- **Row 3: label** (`components/heritage-section.tsx:6`): Divisions
- **Row 3: value ⚠ (note 2)** (`components/heritage-section.tsx:6`): 8
- **Row 4: label** (`components/heritage-section.tsx:7`): Certification
- **Row 4: value** (`components/heritage-section.tsx:7`): EDD
- **Block 1: heading** (`components/heritage-section.tsx:12`): Citizen-Owned & EDD Certified
- **Block 1: text ⚠ (note 1)** (`components/heritage-section.tsx:13`): Majority citizen-owned and registered under Botswana's Economic Diversification Drive, giving our clients the procurement compliance they need for government and institutional contracts.
- **Block 2: heading** (`components/heritage-section.tsx:16`): Global Brands, Local Support
- **Block 2: text** (`components/heritage-section.tsx:17`): Authorised distributor for Diversey, Kimberly Clark, Columbus, Coopers, Shimadzu, and Philips Medical, with world-class products backed by a team on the ground in Botswana.
- **Block 3: heading** (`components/heritage-section.tsx:20`): Foremost in Medical & Lab Solutions
- **Block 3: text** (`components/heritage-section.tsx:21`): One of Botswana's foremost providers of innovative healthcare and scientific instrumentation, serving hospitals, clinics, and research facilities across the region.

Row 1's value is the founding year.

## 9.7 Call to action

The same banner as the group home page. See section 2.5.

---

# 10. Clover Medical home page — `/medical`

Page: `components/divisions/medical-home.tsx`. Sections from top to bottom: Hero with highlight cards, Brands, Product carousel, Sectors, Quote, Why partner, Services, Call to action.

## 10.1 Hero

Component: `components/hero-medical.tsx`

- **Small line** (`components/hero-medical.tsx:24`): A Division of Clover Industries
- **Headline** (`components/hero-medical.tsx:31`): Welcome to Clover Medical.
- **Text** (`components/hero-medical.tsx:35`): Botswana's leading partner in advanced medical, life sciences, and laboratory solutions.
- **Main button** (`components/hero-medical.tsx:44`): Explore Product Lines
- **Second button** (`components/hero-medical.tsx:50`): Contact Us

## 10.2 Highlight cards under the hero

Component: `components/medical-highlights.tsx`

- **Photo description (screen readers)** (`components/medical-highlights.tsx:31`): Clover Medical diagnostic imaging team
- **Photo caption** (`components/medical-highlights.tsx:39`): Diagnostic Imaging Team
- **Figure card: number** (`components/medical-highlights.tsx:45`): 6+
- **Figure card: label** (`components/medical-highlights.tsx:47`): Comprehensive product lines
- **Card: Precision** (`components/medical-highlights.tsx:54`): Precision & Compliance
- **Card: Support** (`components/medical-highlights.tsx:62`): Rapid After-Sales Support
- **Card: coverage** (`components/medical-highlights.tsx:70`): Serving all of Botswana
- **Tag 1** (`components/medical-highlights.tsx:3`): Hospitals
- **Tag 2** (`components/medical-highlights.tsx:3`): Clinics
- **Tag 3** (`components/medical-highlights.tsx:3`): Research Labs

## 10.3 Brands we work with (scrolling names)

Component: `components/medical-partners.tsx`. ⚠ Note 4: these names look like placeholders.

- **Label** (`components/medical-partners.tsx:66`): Brands We Work With
- **Brand 1 ⚠ (note 4)** (`components/medical-partners.tsx:41`): Meridian Health
- **Brand 2 ⚠ (note 4)** (`components/medical-partners.tsx:42`): Solace Labs
- **Brand 3 ⚠ (note 4)** (`components/medical-partners.tsx:43`): Ionic Diagnostics
- **Brand 4 ⚠ (note 4)** (`components/medical-partners.tsx:44`): Halcyon Care
- **Brand 5 ⚠ (note 4)** (`components/medical-partners.tsx:45`): Vertex Medical
- **Brand 6 ⚠ (note 4)** (`components/medical-partners.tsx:46`): Nexora

## 10.4 Product carousel

Component: `components/medical-product-carousel.tsx`, cards in `components/medical-product-card.tsx`. These six are fixed examples, not products from Sanity. Each card has a tag, a name, a description and a grade line.

- **Heading** (`components/medical-product-carousel.tsx:192`): A closer look at each line.
- **Link** (`components/medical-product-carousel.tsx:198`): View All Products
- **Previous button (screen readers)** (`components/medical-product-carousel.tsx:206`): Previous product
- **Next button (screen readers)** (`components/medical-product-carousel.tsx:217`): Next product
- **Page dot (screen readers)** (`components/medical-product-carousel.tsx:246`): Go to page {number}
- **Card button** (`components/medical-product-card.tsx:48`): Request Quote
- **Card 1: tag** (`components/medical-product-carousel.tsx:16`): Imaging
- **Card 1: name** (`components/medical-product-carousel.tsx:18`): CombiDiagnost R90
- **Card 1: description** (`components/medical-product-carousel.tsx:19`): Ceiling-mounted digital radiography and fluoroscopy system for high-throughput diagnostic imaging.
- **Card 1: grade line** (`components/medical-product-carousel.tsx:20`): Digital Radiography
- **Card 2: tag** (`components/medical-product-carousel.tsx:26`): Diagnostics
- **Card 2: name** (`components/medical-product-carousel.tsx:28`): Automated Hematology Analyzer
- **Card 2: description** (`components/medical-product-carousel.tsx:29`): High-throughput cellular analysis platform for rapid, reliable blood diagnostics in pathology labs.
- **Card 2: grade line** (`components/medical-product-carousel.tsx:30`): Clinical Chemistry
- **Card 3: tag** (`components/medical-product-carousel.tsx:36`): Chemistry
- **Card 3: name** (`components/medical-product-carousel.tsx:38`): Ion Chromatography System
- **Card 3: description** (`components/medical-product-carousel.tsx:39`): Precision separation and detection system for rigorous chemical and environmental analysis.
- **Card 3: grade line** (`components/medical-product-carousel.tsx:40`): Analytical Instrumentation
- **Card 4: tag** (`components/medical-product-carousel.tsx:46`): Surgery
- **Card 4: name** (`components/medical-product-carousel.tsx:48`): Disposable Surgical Scalpel Set
- **Card 4: description** (`components/medical-product-carousel.tsx:49`): Sterile, single-use scalpel blades for open, minimally invasive, and micro-surgery procedures.
- **Card 4: grade line** (`components/medical-product-carousel.tsx:50`): Sterile, Single-Use
- **Card 5: tag** (`components/medical-product-carousel.tsx:56`): Patient Care
- **Card 5: name** (`components/medical-product-carousel.tsx:58`): Trilogy Portable Ventilator
- **Card 5: description** (`components/medical-product-carousel.tsx:59`): Philips Respironics portable ventilator for critical, sub-acute, and home respiratory care.
- **Card 5: grade line** (`components/medical-product-carousel.tsx:60`): Portable Ventilator
- **Card 6: tag** (`components/medical-product-carousel.tsx:66`): Renal Care
- **Card 6: name** (`components/medical-product-carousel.tsx:68`): Hemodialysis Bloodline Set
- **Card 6: description** (`components/medical-product-carousel.tsx:69`): Sterile, single-use bloodline set engineered for precise fluid management during dialysis.
- **Card 6: grade line** (`components/medical-product-carousel.tsx:70`): Sterile, Single-Use

## 10.5 Medical and scientific sectors (picture tiles)

Component: `components/medical-product-bento.tsx`. The heading shows on every tile; the description appears when a visitor hovers. Every tile links to the Contact page.

- **Heading** (`components/medical-product-bento.tsx:55`): Dedicated medical and scientific sectors.
- **Tile 1: title** (`components/medical-product-bento.tsx:13`): Advanced Diagnostic Imaging & Healthcare IT
- **Tile 1: description** (`components/medical-product-bento.tsx:14`): Cutting-edge imaging modalities and digital infrastructure for exceptional diagnostic clarity.
- **Tile 2: title** (`components/medical-product-bento.tsx:19`): Clinical Laboratory Diagnostics & Automation
- **Tile 2: description** (`components/medical-product-bento.tsx:20`): Robust, automated systems and highly reliable testing portfolios for medical pathology labs.
- **Tile 3: title** (`components/medical-product-bento.tsx:25`): Analytical Chemistry & Institutional Research
- **Tile 3: description** (`components/medical-product-bento.tsx:26`): Elite scientific instrumentation and daily consumables for research and quality-control labs.
- **Tile 4: title** (`components/medical-product-bento.tsx:31`): Surgery & Advanced Wound Care
- **Tile 4: description** (`components/medical-product-bento.tsx:32`): Ergonomic instrumentation, sterile environment solutions, and high-performance consumables.
- **Tile 5: title** (`components/medical-product-bento.tsx:37`): Patient Care Continuum
- **Tile 5: description** (`components/medical-product-bento.tsx:38`): Tailored in-patient and out-patient solutions across every stage of treatment and recovery.
- **Tile 6: title** (`components/medical-product-bento.tsx:43`): Renal Care & Dialysis Systems
- **Tile 6: description** (`components/medical-product-bento.tsx:44`): Dedicated infrastructure and consumables for advanced renal replacement therapies.

## 10.6 Mission statement

Component: `components/medical-quote.tsx`

- **Statement** (`components/medical-quote.tsx:79`): We are dedicated to elevating healthcare delivery, academic excellence, and scientific innovation across the nation by supplying world-class medical technology, sophisticated laboratory instrumentation, high-purity reagents, and premium surgical solutions — supporting public and private hospitals, diagnostic imaging hubs, medical clinics, and premier national research and academic institutions.

## 10.7 Why partner with Clover Medical?

Component: `components/medical-why-partner.tsx`. Three blocks numbered 01–03 (fixed).

- **Heading** (`components/medical-why-partner.tsx:31`): Why partner with Clover Medical?
- **Block 1: heading** (`components/medical-why-partner.tsx:3`): End-to-End Solutions
- **Block 1: text** (`components/medical-why-partner.tsx:4`): From heavy diagnostic machinery and IT integration to everyday laboratory glassware, pipettes, and consumables, we are your single-source healthcare and research provider.
- **Block 2: heading** (`components/medical-why-partner.tsx:7`): Uncompromising Quality Standards
- **Block 2: text** (`components/medical-why-partner.tsx:8`): Every item in our catalog meets strict international medical, scientific, and regulatory benchmarks.
- **Block 3: heading** (`components/medical-why-partner.tsx:11`): Local Presence
- **Block 3: text** (`components/medical-why-partner.tsx:12`): Our Gaborone-based engineering support ensures rapid response times and reliable on-site technical assistance whenever your facility or institution needs it.

## 10.8 Technical and after-sales support

Component: `components/medical-services.tsx`. Three blocks numbered 01–03 (fixed).

- **Small label** (`components/medical-services.tsx:21`): Beyond the Sale
- **Heading** (`components/medical-services.tsx:24`): After-sales support.
- **Block 1: heading** (`components/medical-services.tsx:3`): Professional Installation & Commissioning
- **Block 1: text** (`components/medical-services.tsx:4`): We manage the complete delivery, assembly, and integration of all medical and laboratory systems to ensure they function seamlessly within your existing facility infrastructure.
- **Block 2: heading** (`components/medical-services.tsx:7`): Precision Calibration & Quality Assurance
- **Block 2: text** (`components/medical-services.tsx:8`): Our engineering team conducts rigorous testing and metrology calibration aligned with global medical and ISO standards, guaranteeing analytical precision, regulatory compliance, and maximum safety.
- **Block 3: heading** (`components/medical-services.tsx:11`): Comprehensive After-Sales Support
- **Block 3: text** (`components/medical-services.tsx:12`): We offer reliable preventative maintenance agreements, prompt troubleshooting, rapid spare parts fulfillment, and comprehensive laboratory and clinical user training to minimize downtime.

## 10.9 Closing call to action

Component: `components/divisions/medical-home.tsx`

- **Heading** (`components/divisions/medical-home.tsx:33`): Talk to our medical equipment team.
- **Text** (`components/divisions/medical-home.tsx:36`): Reach out to discuss equipment, installation, or after-sales support for your facility.
- **Button** (`components/divisions/medical-home.tsx:44`): Contact Us

---

# 11. Emails sent to customers

When a visitor sends an RFQ or a contact message, they get one email, and the Clover team is copied. RFQs, and contact-form messages of any type except Complaint, go to `sales@`, `khofi.gabosekwe@` and `sanka@cloverindustries.co.bw`. A Complaint goes to `sanka@cloverindustries.co.bw` only. Where it goes is set in `config/enquiry-routing.ts`, not in this file.

## 11.1 Quote request email (RFQ)

Source: `lib/rfq/email.ts`

- **Subject** (`lib/rfq/email.ts:91`): Quote request {reference} received — {company}
- **Preview text in the inbox list** (`lib/rfq/email.ts:61`): We've received your quote request {reference}. We'll respond within one business day.
- **Heading** (`lib/rfq/email.ts:62`): We've received your quote request
- **Intro** (`lib/rfq/email.ts:68`): Thank you for your request. Our team will come back to you with availability and pricing within one business day.
- **Row label: name** (`lib/rfq/email.ts:70`): Name
- **Row label: company** (`lib/rfq/email.ts:71`): Company
- **Row label: email** (`lib/rfq/email.ts:72`): Email
- **Row label: phone** (`lib/rfq/email.ts:73`): Phone
- **Row label: fulfilment** (`lib/rfq/email.ts:74`): Fulfilment
- **Row text: collection** (`lib/rfq/email.ts:42`): Collection from {branch}
- **Row text: delivery** (`lib/rfq/email.ts:45`): Delivery to {location}
- **Row label: nearest branch** (`lib/rfq/email.ts:76`): Nearest branch
- **Row label: required by** (`lib/rfq/email.ts:79`): Required by
- **Row label: message** (`lib/rfq/email.ts:80`): Message

## 11.2 Contact message email

Source: `lib/contact/email.ts`

- **Subject** (`lib/contact/email.ts:47`): We've received your message {reference}
- **Preview text in the inbox list** (`lib/contact/email.ts:25`): We've received your message {reference}. We'll respond within one business day.
- **Heading** (`lib/contact/email.ts:25`): We've received your message
- **Intro** (`lib/contact/email.ts:31`): Thank you for getting in touch. Our team will respond within one business day with specifications, pricing and availability.
- **Row label: name** (`lib/contact/email.ts:33`): Name
- **Row label: company** (`lib/contact/email.ts:34`): Company
- **Row label: email** (`lib/contact/email.ts:42`): Email
- **Row label: phone** (`lib/contact/email.ts:36`): Phone
- **Row label: nature of enquiry** (`lib/contact/email.ts:37`): Nature of enquiry
- **Row label: message** (`lib/contact/email.ts:38`): Message

## 11.3 Wording shared by both emails

Source: `lib/email/templates/enquiry-email.tsx`. The plain-text version of each email repeats this wording at the bottom of the same file.

- **Greeting** (`lib/email/templates/enquiry-email.tsx:114`): Hi {name},
- **Reference box: label** (`lib/email/templates/enquiry-email.tsx:123`): Reference
- **Reference box: date label** (`lib/email/templates/enquiry-email.tsx:127`): Received
- **Details heading** (`lib/email/templates/enquiry-email.tsx:136`): Your details
- **Products heading** (`lib/email/templates/enquiry-email.tsx:152`): Products requested
- **Closing line** (`lib/email/templates/enquiry-email.tsx:175`): Need to add or change something? Reply to this email, or call {phone} ({hours}).
- **Footer** (`lib/email/templates/enquiry-email.tsx:183`): Clover Industries · {branches}, Botswana

---

# 12. Pages with only a heading

These exist but have no content and aren't linked from the menus (note 7).

- **Blog** (`app/blog/page.tsx:6`): Blog
- **Docs** (`app/docs/page.tsx:6`): Docs
- **Pricing** (`app/pricing/page.tsx:6`): Pricing

---

# 13. Content managed in Sanity (not in this file)

Edit these in the Sanity Studio. I can't change them from the code.

- **Products:** name, description, grade, tag, pack sizes, availability, promotion flag, images, documents (spec sheets, safety data sheets).
- **Product categories:** name, description, image and which division they belong to.
- **Current specials:** headline, description, image and end date.
- **Popular products on the Chemical home page:** which products are shown.
- **Image descriptions** (alt text) for anything uploaded in Sanity.

The fixed copy above (including the six news articles and the Medical carousel examples) is in the code, and I can change it for you.
