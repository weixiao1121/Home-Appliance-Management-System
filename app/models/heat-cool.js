// import connection
import db from "../config/database.js";

// get info for bullet 1
export const getBulletOneHC = (req, res, next) => {
  //const query1 = ""
  const query1 =
    "SELECT h.type AS HouseholdType, COALESCE(COUNT(eer), 0) AS num_air_conditioners, ROUND(COALESCE(AVG(btu), 0), 0) AS avg_btu,ROUND(COALESCE(AVG(rpm), 0), 1) AS avg_rpm, ROUND(COALESCE(AVG(eer), 0), 1) AS avg_eer FROM Appliance AS app LEFT JOIN AirHandler AS a ON app.email = a.email LEFT JOIN AirConditioner AS c ON app.email = c.email LEFT JOIN Household AS h ON app.email = h.email GROUP BY h.type ORDER BY h.type;";
  db.query(query1, (err, rows) => {
    if (err) {
      console.log("query1 error");
      throw err;
    } else {
      res.locals.bulletone = rows;
      next();
    }
  });
};

// get info for bullet 2
export const getBulletTwoHC = (req, res, next) => {
  const query2 =
    "SELECT HouseholdType, num_heaters, avg_btu, avg_rpm, most_source FROM ( SELECT h.type AS HouseholdType, COALESCE(COUNT(he.energy_source), 0) AS num_heaters, ROUND(COALESCE(AVG(btu), 0), 0) AS avg_btu, ROUND(COALESCE(AVG(rpm), 0), 1) AS avg_rpm, he.energy_source AS most_source, ROW_NUMBER() OVER (PARTITION BY h.type ORDER BY COUNT(he.energy_source) DESC) AS rn FROM Appliance AS app LEFT JOIN AirHandler AS a ON app.email = a.email LEFT JOIN Heater AS he ON app.email = he.email LEFT JOIN Household AS h ON app.email = h.email GROUP BY h.type, he.energy_source ) AS subquery WHERE rn = 1;";

  db.query(query2, (err, rows) => {
    if (err) {
      console.log("query2 error");
      throw err;
    } else {
      res.locals.bullettwo = rows;
      next();
    }
  });
};

// get info for bullet 3
export const getBulletThreeHC = (req, res, next) => {
  const query3 =
    "SELECT h.type AS HouseholdType, COALESCE(COUNT(SEER), 0) AS num_heatpumps, ROUND(COALESCE(AVG(btu), 0), 0) AS avg_btu,ROUND(COALESCE(AVG(rpm), 0), 1) AS avg_rpm, ROUND(COALESCE(AVG(SEER), 0), 1) AS avg_seer, ROUND(COALESCE(AVG(HSPF), 0), 1) AS avg_hspf FROM Appliance AS app LEFT JOIN AirHandler AS a ON app.email = a.email LEFT JOIN HeatPump AS hp ON app.email = hp.email LEFT JOIN Household AS h ON app.email = h.email GROUP BY h.type ORDER BY h.type;";

  db.query(query3, (err, rows) => {
    if (err) {
      console.log("query3 error");
      throw err;
    } else {
      res.locals.bulletthree = rows;
      next();
    }
  });
};

// page rendering function
export function renderHC(req, res) {
  res.render("static/heat-cool", res.locals);
}
