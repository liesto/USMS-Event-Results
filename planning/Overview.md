New UI for Old Event Results
# Summary
KD's idea of seeing if we can put a modern UI to some of the existing event results data, so members get a quicker win

JBW likes this idea, as it also gives us a chance to get into the legacy code & data to better understand it.  

# Initial research
Whatif'n - Mock up a UI & see what it would take. 

## Mockup new designs for 2 pages
- v0 mockups for toptime.php & indresults.php
### Prompt
This is an old presentation of individual swim meet results.  https://www.usms.org/comp/meets/indresults.php?SwimmerID=GAT0R.  The modernized site has branding like this. https://www.usms.org/events.  I want a refreshed version of the individual swimmer results page.  It needs to have friendly filtering and be responsive.  I like this, but I think we can do better. 

These...
https://www.usms.org/comp/meets/toptimes.php
https://www.usms.org/comp/meets/indresults.php?SwimmerID=GAT0R

### Output from v0
Now in GitHub as this project.
Commit Details:
  - Repository: https://github.com/liesto/USMS-Event-Results
  - Commit Hash: 359fbfa
  - 31 files changed, 5,302 insertions, 300 deletions

  The commit includes:
  - Complete v0 UI implementation
  - Both pages (Individual Results & Top Times)
  - All components and styling
  - Fonts and configuration
  - Detailed commit message explaining the v0 integration

## How to wire up a new UI to the legacy data

### Individual Results
Example: http://localhost:5173/individual-results
Current page in PHP: https://www.usms.org/comp/meets/indresults.php?SwimmerID=GAT0R
This is a link to the indresults.php page code - /Users/jbwmson/Agent/USMS Event Results/planning/indresults.php


### Top-times
Example:  http://localhost:5173/top-times
Current page in PHP: https://www.usms.org/comp/meets/toptimes.php
This is a link to the toptimes.php page code - /Users/jbwmson/Agent/USMS Event Results/planning/top-times.php

## Current structure
This is an old PHP app that runs on a not very optimized mySQL DB.  

## Main project goal
This more modern presentation of individual results and top-times would be a bridge-the-gap UI improvement as we work to redesign/rebuild the entire results & rankings section of USMS.  We'd need to be able to stand up the new page designs and return dynamic results without making any database changes. 

## Suggested approach
- Use React for the front-end, since we already use it. 
- Host those pages in IIS/Sitecore (not PHP), since we already have that
- Database calls to the legacy mySQL database
- Middleware/data manipulation via .net core app (in production, not now)
- Use .ts for the POC (What we're working on today)



