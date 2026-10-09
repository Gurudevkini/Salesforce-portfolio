# Gurudev Kini – Salesforce Experience Cloud Portfolio

A one-page developer portfolio built with **Lightning Web Components** for an **Experience Cloud (LWR)** site. Content comes from your portfolio at gurudevk.vercel.app; the layout is original (left-aligned "ledger" style, one load animation, light/dark via OS setting).

![Hero](docs/screenshots/desktop-hero.png)

## Features
- Sections: Hero, About, Projects (PageMint, LinkSense, Stockly, Deep Packet Inspection), GitHub, Involvement, Skills, Contact, Footer
- Sticky navbar with scroll-spy, mobile menu, skip link, keyboard focus, reduced-motion support
- **GitHub section**: Apex callout to the public GitHub API (profile, repos, 12-week activity from the public events feed)
- **Contact form**: Apex stores messages in `Portfolio_Message__c` (honeypot, validation, 5/hour/email rate limit, optional email notification)
- Resume button (static resource), responsive 320px–desktop, no horizontal overflow (checked)

## Salesforce technologies
LWC, Apex (+ tests), Custom Object, Custom Metadata Type, Custom Labels, Static Resource, Remote Site Setting, Permission Set, Custom Tab, Experience Cloud (LWR).

## Structure
```
force-app/main/default/
  classes/            GitHubService, PortfolioContactController, PortfolioSettings (+ tests)
  lwc/                portfolioApp (root) + Navbar, Hero, About, Projects, ProjectCard,
                      Github, Experience, Skills, Contact, Footer, Icon,
                      portfolioData (all content), portfolioUtils, portfolioTheme (shared CSS)
  objects/            Portfolio_Message__c, Portfolio_Setting__mdt
  customMetadata/     Portfolio_Setting.Default
  labels/             name, role, tagline, email, LinkedIn/GitHub URLs, form messages
  permissionsets/     Portfolio_Admin
  remoteSiteSettings/ GitHub_API
  staticresources/    GurudevKiniAssets (resume PDF + profile image) 
  tabs/               Portfolio_Message__c
config/project-scratch-def.json   docs/   jest-stubs/   package.json
```

## Prerequisites
Salesforce CLI (`sf`), a Developer Edition org or Trailhead Playground with **Digital Experiences enabled**, Node 18+ (only for unit tests).

## Authenticate and deploy
```bash
sf org login web --alias portfolio --set-default
sf project deploy start --source-dir force-app --test-level RunLocalTests
sf org assign permset --name Portfolio_Admin
```
Scratch org alternative:
```bash
sf org create scratch --definition-file config/project-scratch-def.json --alias portfolio-scratch --set-default
sf project deploy start --source-dir force-app
```
Unit tests (LWC): `npm install && npm test`. Apex tests: `sf apex run test --test-level RunLocalTests --wait 10`.

## Create the Experience Cloud site (manual – cannot be created from files)
Full steps: [docs/EXPERIENCE_BUILDER_SETUP.md](docs/EXPERIENCE_BUILDER_SETUP.md). Short version:
1. Setup → Digital Experiences → New → **Build Your Own (LWR)**, URL path e.g. `portfolio`.
2. Builder → Home page: remove default content, drag **Portfolio App** onto the page. Hide/blank the theme header & footer (the component has its own).
3. Settings → Guest user profile → **Enabled Apex Class Access**: add `GitHubService`, `PortfolioContactController`, `PortfolioSettings`.
4. Publish. (Optional, to keep it in source control: `sf project retrieve start --metadata "ExperienceBundle:<YourSite1>" --metadata "Network:<YourSite>" --metadata CustomSite:<YourSite>`.)

## Configuration
| What | Where |
|---|---|
| Name, role, tagline, email, LinkedIn/GitHub URLs | `labels/CustomLabels.labels-meta.xml` (**email is `[ADD EMAIL ADDRESS]`**) |
| Projects, skills, involvement, about copy | `lwc/portfolioData/portfolioData.js` |
| GitHub username, repo count, hidden repos | Setup → Custom Metadata Types → Portfolio Setting → Default |
| Contact message owner (**set this**) and notification email | same record (`Message_Owner_Username__c`, `Notification_Email__c`) |

## Resume
Replace `force-app/main/default/staticresources/GurudevKiniAssets/Gurudev-Kini-Resume.pdf` with your PDF (same file name) and redeploy:
`sf project deploy start --metadata StaticResource:GurudevKiniAssets`.
The profile photo is `profile.jpg` in the same folder and is referenced by `PROFILE_IMAGE_FILE` in `portfolioData.js`.

## GitHub integration
Works unauthenticated (60 requests/hour per IP; results are cached client-side). No secret is stored in the repo. For a higher limit: create a Named Credential in Setup (with your token, in the org only) and put its developer name in `GitHub_Named_Credential__c`. The activity map uses the public events feed (recent window), not the full contribution graph (needs GraphQL + token).

## Placeholders to fill
Search for `[ADD`: email address, and the DPI project's implementation details, metric and repository URL (nothing was invented).

## Known limitations / notes
- **No ExperienceBundle is included.** Its LWR JSON can't be reliably hand-written or validated without an org; create the site once (above) and retrieve it.
- Guests can't own records: set `Message_Owner_Username__c`, otherwise form inserts may fail.
- Stockly uses the details on your live site (React/TypeScript, XGBoost, FastAPI); your brief listed Next.js/Inngest/Gemini. Edit `portfolioData.js` if that is the correct stack.
- Not deployed to a real org by the author: Apex and metadata were reviewed and cross-checked, LWC compiled and unit-tested (33 tests), but run `RunLocalTests` on first deploy and report any error.
- Fonts are the system stack (LWR CSP blocks external font hosts).

## Troubleshooting
- *GitHub section says unavailable*: check the Remote Site `GitHub_API` is active, guest profile has `GitHubService` access, or the rate limit was hit.
- *Contact form shows an error*: guest profile needs `PortfolioContactController`; set message owner username.
- *Resume 404*: redeploy the static resource; ensure site cache is cleared by republishing.
- *Deploy error on a field/tab*: deploy objects first: `sf project deploy start --metadata CustomObject`.
