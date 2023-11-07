// import connection
import db from "../config/database.js";

// New Household form
export const householdForm = (req, res) => {
  res.render("households/form", {email: '', zip: '', sqft: '', heat_setting: '', cool_setting: ''} );
};

// Insert PublicUtility
const insertUtility = (data, result) => {
  db.query(
    "INSERT INTO PublicUtility(email,utility) VALUES(?);",
    [data],
    (err, results) => {
      if (err) {
        throw err;
      }
    },
  );
};

// Create New Household
export const createHousehold = (req, res) => {
  let email = req.body.email;
  let sqft = parseInt(req.body.sqft);
  let type = req.body.hometype;
  let zip = req.body.zip;
  let cool = req.body.cool_setting;
  let heat = req.body.heat_setting;

  let cool_setting = cool ? cool : "NULL"
  let heat_setting = heat ? heat : "NULL"

  let utilities = [];
  req.body.electric ? utilities.push(req.body.electric) : "NULL"
  req.body.gas ? utilities.push(req.body.gas) : "NULL"
  req.body.steam ? utilities.push(req.body.steam) : "NULL"
  req.body.liquid_fuel ? utilities.push(req.body.liquid_fuel) : "NULL"
  let offgrid = utilities.length > 0 ? true : false

  let repopulate_values = {email: email, zip, zip, sqft: sqft, heat_setting: heat_setting, cool_setting: cool_setting}

  // SQL query to retrieve all postal codes from the "PostalCode" table
  const postalCodeQuery = `SELECT code FROM PostalCode`;

  // Check if the entered postal code exists in the database
  db.query(postalCodeQuery, (postalCodeErr, postalCodeRows) => {
    if (postalCodeErr) {
      res.flash("errors", postalCodeErr.message);
      res.render("households/form", repopulate_values);
    } else {
      const postalCodes = postalCodeRows.map(row => row.code);

      // If the entered postal code does not exist in the database, show an error message
      if (!postalCodes.includes(zip)) { 
        const PCerrorMessage = "Not a valid postal code, please check your input";

        // Render the same page with the error message
        res.flash("postal_code_errors", PCerrorMessage);
        res.render("households/form", repopulate_values);
        return;
      }
      // SQL query to retrieve all emails from db
      const emailQuery = `SELECT email FROM Household`;

      // Check if the entered email exists in the database
      db.query(emailQuery, (emailErr, emailRows) => {
        if (emailErr) {
          res.flash("errors", emailErr.message);
          res.render("households/form", repopulate_values);
        } else {
          const emails = emailRows.map(row => row.email);

          // If the entered email already exists in the database, show an error message
          if (emails.includes(email)) {
            const EMerrorMessage = "This email already exists, please enter a unique email";

            // Render the same page with the error message
            res.flash("email_errors", EMerrorMessage);
            res.render("households/form", repopulate_values);
            return;
          }

          let query = `INSERT INTO Household(email, square_footage, type, postal_code, thermostat_setting_heat, thermostat_setting_cool, if_use_public_utility) VALUES ('${email}', ${sqft}, '${type}', ${zip}, ${heat_setting}, ${cool_setting}, ${offgrid});`;

          db.query(query, err => {
            if (err) {
              res.flash("household_errors", err);
              return res.render("households/form", repopulate_values);
            }

            if (!offgrid) {
              utilities.forEach(utility => {
                if (utility) {
                  insertUtility([email, utility], err => {
                    if (err) {
                      res.flash("household_errors", err);
                      return res.render("households/form", repopulate_values);
                    }
                  });
                }
              });
            }

            res.redirect("/appliances/?email=" + email);
          });
        }
      });
    }
  });
};