// import connection
import db from "../config/database.js";

// get info for bullet 1
export const getBulletOne = (req, res, next) => {
  const query1 =
    "SELECT state, COUNT(email) AS email_count FROM Household AS h JOIN PostalCode ON code = h.postal_code WHERE if_use_public_utility IS FALSE GROUP BY state ORDER BY email_count DESC LIMIT 1;";
  db.query(query1, (err, rows) => {
    if (err) {
      console.log("query1 error");
      throw err;
    } else {
      res.locals.bulletone = rows[0];
      next();
    }
  });
};

// get info for bullet 2
export const getBulletTwo = (req, res, next) => {
  const query2 =
    "with hh as (SELECT h.email, sum(storage_capacity) AS hh_storage_capacity FROM Household AS h JOIN Generator AS g ON h.email = g.email WHERE if_use_public_utility IS FALSE GROUP BY h.email) SELECT ROUND(AVG(hh_storage_capacity),0) avg_storage_capacity FROM hh;";

  db.query(query2, (err, rows) => {
    if (err) {
      console.log("query2 error");
      throw err;
    } else {
      res.locals.bullettwo = rows[0];
      next();
    }
  });
};

// get info for bullet 3
export const getBulletThree = (req, res, next) => {
  const query3 =
    "SELECT g.type, COALESCE(ROUND(CAST(COUNT(*) AS float) * 100 / (SELECT COUNT(*) FROM Household AS h JOIN Generator AS g ON g.email = h.email WHERE if_use_public_utility IS FALSE) , 1), '0%') AS Percentage FROM Household AS h JOIN Generator AS g ON g.email = h.email WHERE if_use_public_utility IS FALSE GROUP BY g.type";

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

// get info for bullet 4
export const getBulletFour = (req, res, next) => {
  const query4 =
    "SELECT h.type, ROUND( COALEScE (COUNT (*), 0) *100/ COALESCE( (SELECT COUNT(*) FROM Household AS h JOIN Generator AS g ON h.email = g.email WHERE if_use_public_utility IS FALSE),1) ,1) AS Percentage FROM Household AS h JOIN Generator AS g ON h.email = g.email WHERE if_use_public_utility IS FALSE GROUP BY h.type;";

  db.query(query4, (err, rows) => {
    if (err) {
      console.log("query4 error");
      throw err;
    } else {
      res.locals.bulletfour = rows;
      next();
    }
  });
};

// get info for bullet 5
export const getBulletFive = (req, res, next) => {
  const query5_1 =
    "SELECT ROUND(AVG(tank_size), 1) AS avg_tank_size FROM Household AS h LEFT JOIN Appliance AS a ON h.email = a.email LEFT JOIN WaterHeater AS w ON h.email = w.email WHERE if_use_public_utility is FALSE;";
  const query5_2 =
    "SELECT ROUND(AVG(tank_size), 1) AS avg_tank_size FROM Household AS h LEFT JOIN Appliance AS a ON h.email = a.email LEFT JOIN WaterHeater AS w ON h.email = w.email WHERE if_use_public_utility is TRUE;";

  db.query(query5_1, (err, rows) => {
    if (err) {
      console.log("query5_1 error");
      throw err;
    } else {
      res.locals.bulletfiveone = rows;
      next();
    }
  });

  db.query(query5_2, (err, rows) => {
    if (err) {
      console.log("query5_2 error");
      throw err;
    } else {
      res.locals.bulletfivetwo = rows;
      next();
    }
  });
};

// get info for bullet 6
export const getBulletSix = (req, res, next) => {
  const query6 = `
  SELECT 'Air Handler' AS type, COALESCE(ROUND(MIN(a.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(a.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(a.btu), 0), 0) AS max_btu 
    FROM Appliance a 
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE 
    WHERE a.type = 'air_handler' 
    UNION 
    SELECT 'Water Heater' AS type, COALESCE(ROUND(MIN(a.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(a.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(a.btu), 0), 0) AS max_btu 
    FROM Appliance a 
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE
    WHERE a.type = 'water_heater'
    UNION
    SELECT 'Air Conditioner' AS type, COALESCE(ROUND(MIN(b.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(b.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(b.btu), 0), 0) AS max_btu
    FROM AirConditioner a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number 
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE 
    UNION 
    SELECT 'Heat Pump' AS type, COALESCE(ROUND(MIN(b.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(b.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(b.btu), 0), 0) AS max_btu 
    FROM HeatPump a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number  
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE
    UNION
    SELECT 'Heater' AS type, COALESCE(ROUND(MIN(b.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(b.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(b.btu), 0), 0) AS max_btu 
    FROM Heater a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number  
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE
    ;
  `;
  db.query(query6, (err, rows) => {
    if (err) {
      console.log("query6 error");
      throw err;
    } else {
      const bulletsix = rows;
      res.locals.bulletsix = bulletsix;
      next();
    }
  });
};

// function to handle data saving issue or data from bullet 6 will be overwright
export const getBulletSeven = (req, res, next) => {
  const query7 = `
  SELECT 'Air Handler' AS type, COALESCE(ROUND(MIN(a.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(a.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(a.btu), 0), 0) AS max_btu 
    FROM Appliance a 
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE 
    WHERE a.type = 'air_handler' 
    UNION 
    SELECT 'Water Heater' AS type, COALESCE(ROUND(MIN(a.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(a.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(a.btu), 0), 0) AS max_btu 
    FROM Appliance a 
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE
    WHERE a.type = 'water_heater'
    UNION
    SELECT 'Air Conditioner' AS type, COALESCE(ROUND(MIN(b.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(b.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(b.btu), 0), 0) AS max_btu
    FROM AirConditioner a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number 
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE 
    UNION 
    SELECT 'Heat Pump' AS type, COALESCE(ROUND(MIN(b.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(b.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(b.btu), 0), 0) AS max_btu 
    FROM HeatPump a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number  
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE
    UNION
    SELECT 'Heater' AS type, COALESCE(ROUND(MIN(b.btu), 0), 0) AS min_btu, COALESCE(ROUND(AVG(b.btu), 0), 0) AS avg_btu, COALESCE(ROUND(MAX(b.btu), 0), 0) AS max_btu 
    FROM Heater a 
    JOIN Appliance b on a.email = b.email and a.sequence_number = b.sequence_number  
    JOIN Household AS h ON a.email = h.email AND h.if_use_public_utility is FALSE
    ;
  `;

  db.query(query7, (err, rows) => {
    if (err) {
      console.log("query7 error");
      throw err;
    } else {
      const bulletseven = rows;
      res.locals.bulletsix = bulletseven;
      next();
    }
  });
};

// page rendering function
export function renderOffgrid(req, res) {
  res.render("static/offgrid", res.locals);
}
