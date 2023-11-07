// import connection
import db from "../config/database.js";

// Get state water heater statistics
export const getStates = (req, res) => {
  db.query(
    "SELECT state, ROUND(AVG(tank_size),0) AS avg_tank_size, ROUND(AVG(btu),0) AS avg_btu, ROUND(AVG(current_temperature_setting),1) AS avg_temp_setting, SUM(CASE WHEN current_temperature_setting IS NOT NULL THEN 1 WHEN sequence_number IS NOT NULL THEN 0 ELSE NULL END) AS count_temp_provided, SUM(CASE WHEN sequence_number IS NOT NULL AND current_temperature_setting IS NULL THEN 1 WHEN sequence_number IS NOT NULL THEN 0 ELSE NULL END) AS count_temp_not_provided FROM PostalCode AS a LEFT JOIN Household AS b on a.code = b.postal_code LEFT JOIN (SELECT a.email, a.sequence_number, tank_size, btu, current_temperature_setting FROM Appliance AS a JOIN WaterHeater AS b on a.email = b.email) AS c on b.email = c.email GROUP BY state ORDER BY state;",
    (err, result) => {
      if (err) {
        res.flash("errors", err);
        return res.render("reports/water-heater");
      } else {
        res.render("static/water-heater", { states: result });
      }
    },
  );
};

// State drilldown
export const statedrilldown = (data, res) => {
  const state = data.query.oneState;
  db.query(
    "WITH calculations AS (SELECT energy_source, ROUND(MIN(tank_size),0) AS min_tank_size, ROUND(AVG(tank_size),0) AS avg_tank_size, ROUND(MAX(tank_size),0) AS max_tank_size, ROUND(MIN(current_temperature_setting),0) AS min_temp_setting, ROUND(AVG(current_temperature_setting),1) AS avg_temp_setting, ROUND(MAX(current_temperature_setting),0) AS max_temp_setting FROM PostalCode AS a LEFT JOIN Household AS b on a.code = b.postal_code LEFT JOIN (SELECT a.email, tank_size, btu, current_temperature_setting, energy_source FROM Appliance AS a JOIN WaterHeater AS b on a.email = b.email) AS c on b.email = c.email WHERE state = ? GROUP BY energy_source), energysources AS (SELECT 'Electric' AS energy_source UNION SELECT 'Gas' AS energy_source UNION SELECT 'Fuel Oil' AS energy_source UNION SELECT 'Heat Pump' AS energy_source) SELECT e.energy_source, c.min_tank_size, c.avg_tank_size, c.max_tank_size, c.min_temp_setting, c.avg_temp_setting, c.max_temp_setting FROM energysources AS e LEFT JOIN calculations AS c ON c.energy_source = e.energy_source ORDER BY e.energy_source;",
    [state],
    (err, result) => {
      if (err) {
        res.flash("errors", err);
        return res.render("/reports/state");
      } else {
        res.render("static/state/singleState", { state: state, data: result });
      }
    },
  );
};
