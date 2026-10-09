# Experience Cloud setup (manual steps)

1. **Enable**: Setup → Digital Experiences → Settings → Enable Digital Experiences (choose a domain name).
2. **Create site**: Digital Experiences → All Sites → New → *Build Your Own (LWR)* → name `Portfolio`, URL path `portfolio`.
3. **Builder → Pages → Home**: delete default components, drag **Portfolio App** onto the page.
   Optional: also available as separate drag-and-drop sections (Hero, About, Projects, GitHub, Involvement, Skills, Contact, Footer, Navbar).
4. **Theme**: Theme → Layouts → set the header/footer regions empty (the app includes navbar and footer).
5. **Settings → General**: tick *Guest users can see other members of this site* = off; enable guest access (*Public access*).
6. **Guest user profile** (Builder → Settings → Guest user profile → Apex Class Access): `GitHubService`, `PortfolioContactController`, `PortfolioSettings`.
7. **Custom Metadata**: Setup → Custom Metadata Types → Portfolio Setting → Manage Records → Default: set `Message_Owner_Username__c` (an active user) and optionally `Notification_Email__c`.
8. **Security**: Setup → Sites → ensure Clickjack protection stays on; trusted sites are not needed (no external scripts/fonts/images).
9. **Publish**, then open the site URL.
10. **Admin**: assign permission set *Portfolio Admin* to yourself; open *Portfolio Messages* via App Launcher.
