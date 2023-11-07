// import connection
import db from "../config/database.js";

// Get top 25 manufacturers
export const getTopManufacturers = (req, res) => {
  db.query(
    "SELECT manufacturer, count(email) num_appliances FROM Appliance GROUP BY manufacturer ORDER BY count(email) desc, manufacturer asc LIMIT 25;",
    (err, result) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        res.render("static/top25", { mans: result });
      }
    },
  );
};

// Manufacturer drilldown
export const manufacturerdrilldown = (req, res, next) => {
  let man_name = req.query.man_name;
  let query = `
    SELECT 'Air Handler' AS type, count(*) num_appliances 
    FROM Appliance 
    WHERE manufacturer = '${man_name}' and type = 'air_handler' 
    UNION 
    SELECT 'Water Heater' AS type, count(*) num_appliances 
    FROM Appliance 
    WHERE manufacturer = '${man_name}' and type = 'water_heater';`;
    db.query(query, (err, rows) => {
      if (err) {
        console.log("query error");
        throw err;
      } else {
        res.locals.types = rows;
        res.locals.man_name = man_name
        next();
      }
    });
  };

// Air Handler drilldown
export const airhandlerDrilldown = (req, res, next) => {
  let man_name = req.query.man_name;
  let query1 = `
    SELECT 'Air Conditioner' AS type, count(*) num_appliances 
    FROM AirConditioner a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number  
    WHERE manufacturer = '${man_name}'
    UNION 
    SELECT 'Heat Pump' AS type, count(*) num_appliances 
    FROM HeatPump a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number  
    WHERE manufacturer = '${man_name}'
    UNION
    SELECT 'Heater' AS type, count(*) num_appliances 
    FROM Heater a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number  
    WHERE manufacturer = '${man_name}'
    `;
    db.query(query1, (err, rows) => {
      if (err) {
        console.log("query1 error");
        throw err;
      } else {
        res.locals.types1 = rows;
        next();
      }
    });
  };

// page rendering function
export function renderManufacturers(req, res) {
  res.render("static/manufacturers", res.locals);
}
