# Issues and corrections

A running record of problems found on the live site, and of every change we have made to content compared with the live site (https://digitaldundee.com).

Rule of thumb: tell the site owner about a problem before it goes in the open issues list, and log every content correction below as soon as it is made.

## Corrections made

Changes to content that differ from the live site, or that fix a fault in our own copy.

| Date | Where | What changed | Why |
|---|---|---|---|
| 2026-10-08 | Contact page | `+44 (0) 01382 434602` is now `+44 (0)1382 434602` | The live number had an extra `0` after the `(0)` |
| 2026-10-08 | Contact, Careers and Jobs, Tay5G pages | Plain-text email addresses are now `mailto:` links and phone numbers are `tel:` links | They were not clickable |
| 2026-10-08 | Talent & Skills, Invest In Dundee, Locate Dundee | Replaced with the live page text | Our copies held the Enjoy Dundee text ("See Dundee Safely", Covid-era travel advice) |
| 2026-10-08 | Connected Dundee | Replaced with the live page text | Our copy had paragraphs from the Collaborate page pasted into it |
| 2026-10-08 | Tay5G Challenge Fund 2 | `tay5g@dundeecity.gv.uk` is now `tay5g@dundeecity.gov.uk` (text and `mailto:` link, 2 places) | Typo in the live copy; the Tay5G landing page and Challenge Fund 2 itself use the `.gov.uk` address |
| 2026-10-08 | Get Services | Page replaced with the live text; title is now "Get Services" | Our copy had "Get Serivices" in the hero, a mismatched meta title and the wrong hero alt text |
| 2026-10-08 | Tay5G landing page | Replaced with the live page text | Ours was a placeholder copied from the Contact page |
| 2026-10-08 | Connected Dundee, Enjoy Dundee | Images re-hosted locally | They pointed at old Drupal paths (`/sites/default/files/...`) that do not exist here |
| 2026-10-08 | Home page | "Get In Touch" now links to `/contact` | It linked to `contact-us`, which is a 404 here |
| 2026-10-08 | Privacy policy | Replaced the draft text with the live privacy statement (version 12 May 2021). `/privacy` redirects to `/privacy-policy`. Bold standalone lines became `h2` headings | The draft was adapted from another site and was not Digital Dundee's text |
| 2026-10-08 | Tay5G landing page | A link that wrapped only a full stop was unwrapped | It was a stray link in the live copy |
| 2026-10-08 | Tay5G pages | Meta descriptions are the first paragraph of each page | The live ones were generated junk (`Tay5G Image`, `WHAT IS 5G?`) |
| 2026-10-08 | Tay5G News, About Tay5G | The success-story link now uses `/success-stories/...`, and the "5G Effect" PDF is hosted at `/documents/` | The old paths do not exist here |
| 2026-10-02 | 60 content files | Meta descriptions that held a whole article body (with markup) were replaced with plain text of up to 160 characters | See CHANGES.md, "Content: missing images and sanitising" |
| 2026-10-02 | 5 news articles and others | Word `<o:p>` tags, HTML headings and tables, garbled bold/italic markers and stray "Image" lines were cleaned up | See CHANGES.md, "Content: missing images and sanitising" |

### Content added (it was missing here)

- Pages: 5G Guide, Why do 5G Trials?, Tay5G Challenge Fund, Tay5G Challenge Fund 2, Tay5G News
- Event: Techscaler x ScotlandIS Webinar
- Success story: Innovation, collaboration, tech - a winning combination for life sciences. The live site shows no date for it, so the publication date `2026-01-01` was chosen to place it first.
- Images dropped by the original migration, restored in 14 news articles and 8 events

### Menu and URLs matched to the live site

- Menu labels are now "Locate" and "Innovate" (they were "Be Dundee" and "Tay5G"), with the live children, including the third level under "5G Guide"
- `/be-dundee/get-service` is now `/be-dundee/get-services`
- Redirects: `/be-dundee/get-service`, `/innovate/about-tay5g`, `/innovate/tay5g-news`, `/contact-us` and `/privacy`

## Open issues

Problems found on the live site or in our copy of its content. Tell the site owner before adding a new one.

1. **Live consent banner links to a 404.** The banner's "Privacy Statement (Opens in a new window)" link goes to https://www.dundeecity.gov.uk/privacy-policy, which returns "Page not found" on the council's site. (Separately, https://digitaldundee.com/privacy-policy is an empty page; the real Digital Dundee statement is at https://digitaldundee.com/privacy.) Fixed in this build: our banner and footer link to `/privacy-policy`, which now holds the real Digital Dundee statement.
2. **Covid-era content.** The Enjoy Dundee page (live and here) still says non-essential travel is discouraged and that staycations are "beginning to beckon". It needs reviewing and updating.
3. **Links rewritten by email security tools.** Seven content files link through rewritten URLs copied from pasted emails: Check Point (`protect.checkpoint.com`) in `news/groundbreaking-ar-software-safer-epidurals`, `events/phase-25-esports-conference-edinburgh-sep-25`, `success-stories/transatlantic-op-shows-distance-no-problem-stroke-treatment` and `success-stories/innovation-collaboration-tech-winning-combination-life-sciences`; Microsoft Safe Links or Mimecast in `news/abertay-university-new-labs-video-games-digital-arts`, `success-stories/bt-creating-landmark-presence-tech-city-dundee` and `events/digital-tech-grow-your-business-green-webinar`. They carry tracking tokens and can stop working. The real destination is inside each URL and should replace it.
4. **Out-of-date Challenge Fund information.** The Tay5G landing page says the funding competition is "open now". Challenge Fund 1 says it is closed. Challenge Fund 2 says "Opportunity status: Open" with an extended closing date of 13th May 2024. All three need updating or archiving, and the page's past webinar dates (December and January) are long gone.
5. **Duplicated paragraph.** Tay5G Challenge Fund 2, section 2, repeats the paragraph beginning "Tay5G Challenge Fund 2 is a competitive two-stage process" twice in a row, both on the live site and here.
6. **Non-descriptive link text.** "Click here to find out more about the Tay5G Challenge Fund." on the Tay5G landing page, and four webinar-date links on Challenge Fund 1 whose link text is only the date and time. Link text should say where it goes.
7. **Old privacy statement.** The live privacy statement (version 12 May 2021, now at `/privacy-policy`) refers to the old website's cookie control tool, not the consent banner used here, and is more than five years old. It needs a review by Digital Dundee.
8. **Copy-pasted page metadata.** `be-dundee.astro` has the meta description "The metadescription". The Collaborate page has the Careers and Jobs description. Enjoy Dundee's hero image has the alt text "Collaborate page header". These pages were written by hand and are not on the live site in this form.
