import db from "../config/database.js";
import { search } from "./static.js";

// Get averages within the radius of the given postal code
export const hhAverages = (req, res) => {
  const postal_code = req.body.postal_code;
  const radius = req.body.search_radius;

  // SQL query to retrieve all postal codes from the "PostalCode" table
  const postalCodeQuery = `SELECT code FROM PostalCode`;

  // Check if the entered postal code exists in the database
  db.query(postalCodeQuery, (postalCodeErr, postalCodeRows) => {
    if (postalCodeErr) {
      res.flash("errors", postalCodeErr.message);
      res.render("static/average", {postal_code: postal_code, radius: radius });
    } else {
      const postalCodes = postalCodeRows.map(row => row.code);
      // If the entered postal code does not exist in the database, show an error message
      if (!postalCodes.includes(postal_code)) {
        const errorMessage = "Not a valid postal code, please check your input";

        // Render the same page with the error message
        res.flash("errors", errorMessage);
        res.render("static/average", {postal_code: postal_code, radius: radius });
        return;
      }

      // Proceed with the original query if the postal code is valid
      const query = `
        WITH point as ( 
          SELECT latitude * PI()/180 AS lat1, longitude * PI()/180 AS lon1 
          FROM PostalCode
          WHERE code = '${postal_code}' 
         ) 
         , rads as ( 
          SELECT code, latitude * PI()/180 AS lat2, longitude * PI()/180 AS lon2 
          FROM PostalCode
         ) 
         , calculation as ( 
          SELECT code,  
            sin((lat2-lat1)/2) * sin((lat2-lat1)/2) + 
            cos(lat1) * cos(lat2) * 
            sin((lon2-lon1)/2) * sin((lon2-lon1)/2) AS a 
          FROM rads
          JOIN point b on TRUE 
         ) 
         , dist as ( 
          SELECT code, 3958.75 * (2 * atan2(sqrt(a), sqrt(1-a))) AS dist 
          FROM calculation 
         ) 
         , util as ( 
          SELECT  
           GROUP_CONCAT(DISTINCT utility SEPARATOR ', ') AS utils
          FROM Household AS a  
          JOIN dist AS b on a.postal_code = b.code 
          JOIN PublicUtility AS c on a.email = c.email 
         WHERE dist <= ${radius}
         )
         , gen_count as ( 
          SELECT 
            count(distinct c.email) AS generator_households 
            , count(distinct case when storage_capacity is not null then c.email else null end) AS households_with_battery_storage  
         FROM Household AS a  
          JOIN dist AS b on a.postal_code = b.code 
          JOIN Generator c on a.email = c.email       
         WHERE dist <= ${radius}
         ) 
         , hh_power_gen as ( 
          SELECT c.email
            , sum(storage_capacity) AS hh_batt_capacity 
          FROM Household AS a  
           JOIN dist AS b on a.postal_code = b.code 
           JOIN Generator AS c on a.email = c.email 
          WHERE dist <= ${radius}
          GROUP BY c.email 
         ), avg_power as ( 
          SELECT round(avg(hh_batt_capacity),0) AS avg_monthly_power_generated 
          FROM hh_power_gen 
         ) , gen_max as ( 
          SELECT c.type, count(*) counts 
          FROM Household AS a  
           JOIN dist AS b on a.postal_code = b.code 
           JOIN Generator c on a.email = c.email 
          WHERE dist <= ${radius}
          GROUP BY c.type 
          ORDER by counts desc 
          LIMIT 1 
         ) 
          SELECT '${postal_code}' AS central_postal_code 
           , ${radius} AS search_radius 
           , count(distinct email) AS households_count 
           , count(distinct case when a.type = 'house' then email else null end) AS house_type_count 
           , count(distinct case when a.type = 'apartment' then email else null end) AS apartment_type_count 
           , count(distinct case when a.type = 'townhome' then email else null end) AS townhome_type_count 
           , count(distinct case when a.type = 'condominium' then email else null end) AS condominium_type_count 
           , count(distinct case when a.type = 'modular home' then email else null end) AS modular_home_type_count 
           , count(distinct case when a.type = 'tiny house' then email else null end) AS tiny_house_type_count 
           , round(avg(square_footage),0) AS avg_sq_footage 
           , round(avg(thermostat_setting_heat),1) AS avg_heat_thermostat_setting 
           , round(avg(thermostat_setting_cool),1) AS avg_cool_thermostat_setting 
           , max(c.utils) AS utilities_list 
           , count(distinct case when NOT if_use_public_utility then email else null end) AS off_grid_homes 
           , max(generator_households) AS households_with_generators 
           , max(e.type) AS most_common_generation_method 
           , max(f.avg_monthly_power_generated) AS avg_monthly_power_generated 
           , max(households_with_battery_storage) AS households_with_battery_storage 
          FROM Household AS a 
           LEFT JOIN dist AS b on a.postal_code = b.code 
           LEFT JOIN util AS c on TRUE 
           LEFT JOIN gen_count AS d on TRUE 
           LEFT JOIN gen_max AS e on TRUE 
           LEFT JOIN avg_power AS f on TRUE 
          WHERE dist <= ${radius}`;

      db.query(query, (err, rows) => {
        if (err) {
          throw err;
        } else {
          // Render the same page with the query results
          res.render("static/average", { results: rows, postal_code: postal_code, radius: radius });
        }
      });
    }
  });
};
