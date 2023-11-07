## Alternakraft Web App

This database application uses [Express.js](https://expressjs.com/), [MySQL](https://www.mysql.com/), and [EJS](https://ejs.co/).

### Run Prettier
Run prettier before submission `npx prettier . --write` 


### Setup Workstation

- Install node and npm following instructions here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

#### Setup MySQL

Install MySQL for your OS following the instructions here: https://dev.mysql.com/doc/refman/8.0/en/installing.html. Set it up with root user password as 'password'

Then setup the DB by running our SQL creation statements: https://github.gatech.edu/cs6400-2023-02-summer/cs6400-2023-02-Team27/blob/main/Phase_2/team27_p2_schema.sql

On Linux this was running it (you may not need privilege access and can remove the `sudo`):

```code
sudo mysql -u root -p < team27_p2_schema.sql
(enter 'password' as password)
sudo mysql -u root
show schemas;
use cs6400_su23_team27
show tables;
```

#### Known Issues

Issues with versioning

```code
node_modules/lru-cache/dist/cjs/index.js:359
    #initializeTTLTracking() {
                          ^

SyntaxError: Unexpected token '('
```

See: https://stackoverflow.com/questions/76103984/unexpected-token-syntaxerror-after-git-pushing-to-remote-server

### Run the application

This installs the necessary packages for the application as specified in the `package-lock.json` file. Then it runs the server at localhost. It runs in dev
mode and should auto-reload upon changes.

In this directory run:

```code
cd app
npm install
npm run dev
```

See the app at: http://localhost:3000/

## Reports Split

Name - Report

- [X] Caitlyn - Initial household/appliance/generator flow (I may split this up into subtasks to delegate)
- [X] Matt - Top 25
- [X] Xiao - Manufacturer/model search
- [X] Yujen - Heating/cooling method details
- [X] Nicholas - Water heater statistics
- [X] Yujen - Off-grid household dashboard
- [X] Matt - Household average by radius

- [X] Xiao - Error handling and displaying to user on all form pages
- [X] Nicholas - JS to selectively show additional attributes for "Add Appliance" page (i.e. when air handler or water heater is selected)
- [X] Xiao - Ensure at least one subtype for air handler is selected (i.e. ac, heater, heatpump)
- [X] Nicholas - JS to selectively show "Skip" option for generators if not off-grid
- [X] Caitlyn - Pass email ID across pages
- [X] Matt - Handle sequence numbers for appliances and subtypes

- [X] Caitlyn - Delete appliance/generators functionality
- [X] Caitlyn - Highlighting search results
- [X] Caitlyn - Finish any remaining TODOs


## Remaining TODOs
- [X] \_\_\_ - Load provided demo data: https://piazza.com/class/lh6xbdjtdpd2la/post/478
- [X] Matt / Everyone - Fix appliance submission (related to sequence numbers task above)
- [X] Nicholas - Fix python script to load postal code as 'string' not as integer as this currently does not include leading zeros in a zip code
- [X] Nicholas - Fix python script to load lat/long as the full string values
- [X] Matt - Add subtypes for Air Handlers to the "Manufacturer" report page
- [X] Xiao - Fix postal code formatting validation on average radius by household report to check against database
- [X] Xiao - Fix appliance type check boxes after Nicholas's work
- [X] Xiao - Update email validation on /households
- [ ] Yujen - Beautify tables
- [ ] Everyone - review all the Reports pages/queries

##Presentation:
Reports
- [2m Matt] Top 25
- [2m Xiao] Manufacturer/Model Search
- [2m Yujen] Heating/Cooling Method Details
- [2m Nicholas] Water Heater Stats
- [2m Yujen] Off-Grid Household Dashboard
- [2m Matt] Household Average by radius

Input flow
- [8m Caitlyn] Farm out anything you want others to present. Could include:
    - [1m Xiao] Validation
    - [1m Nicholas] Conditional form expansion

