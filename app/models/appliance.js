// import connectionHousehold
import db from "../config/database.js";

// New Appliance form
export const applianceForm = (req, res) => {
  repopulateApplianceForm(req, res);
};

const repopulateApplianceForm = (req, res) => {
  let email = req.query.email;

  db.query(`SELECT name FROM Manufacturer;`, (err, results) => {
    if (err) {
      throw err;
    } else {
      return res.render("appliances/form", { email: email, manufacturers: results });
    }
  });
}

export const createAppliance = async (req, res) => {
  let email = req.body.email;
  let type = req.body.type;
  let manufacturer = req.body.manufacturer;
  let model = req.body.model;
  let btu = req.body.btus;

  // sub-class attributes
  let air_handler_type = req.body.air_handler_type;
  let rpm = req.body.rpm;
  let ac_eer = req.body.eer;
  let heatpump_seer = req.body.seer;
  let heatpump_hspf = req.body.hspf;
  let heater_source = req.body.heater_source;
  let wh_tank_size = req.body.tank_size;
  let wh_source = req.body.water_heater_source;
  let wh_temp = req.body.temp ? req.body.temp : "NULL";

  // Get last sequence number and increment
  let [rows, fields] = await db.promise().query(`SELECT max(sequence_number) AS max FROM Appliance WHERE email = '${email}'`);
  let seq_number = rows[0].max > 0 ? rows[0].max + 1 : 1

  // Insert into Appliance table
  await db.promise().query(`INSERT INTO Appliance(email,sequence_number,type,manufacturer,model,btu) VALUES('${email}', ${seq_number}, '${type}', '${manufacturer}', '${model}', ${btu});`),
    (err) => {
      if (err) {
        res.flash("errors", err);
        repopulateApplianceForm(req, res);
        throw err;
      }
    }

  // Insert into sub-type tables
  if (type == "water_heater") {
    db.query(
      `INSERT INTO WaterHeater(email,sequence_number,tank_size,energy_source,current_temperature_setting) VALUES('${email}', ${seq_number}, ${wh_tank_size}, '${wh_source}', ${wh_temp});`,
      (err) => {
        if (err) {
          res.flash("errors", err);
          repopulateApplianceForm(req, res);
          throw err;
        }  
      },
    );
  } else if (type == "air_handler") {
    // Insert into AirHandler tables and sub-type tables
    db.query(`INSERT INTO AirHandler(email,sequence_number,rpm) VALUES('${email}', ${seq_number}, ${rpm});`)
    
    let ac_regex = new RegExp("ac", "gi");
    let heater_regex = new RegExp("heater", "gi");
    let heatpump_regex = new RegExp("heat pump", "gi");

    let ac_result = String(air_handler_type).match(ac_regex)
    let heater_result = String(air_handler_type).match(heater_regex)
    let heatpump_result = String(air_handler_type).match(heatpump_regex)

    if (ac_result) {
      db.query(`INSERT INTO AirConditioner(email,sequence_number,eer) VALUES('${email}',${seq_number},${ac_eer});`);
    }

    if (heater_result) {
      db.query(`INSERT INTO Heater(email,sequence_number,energy_source) VALUES('${email}', ${seq_number}, '${heater_source}');`);
    }

    if (heatpump_result) {
      db.query(`INSERT INTO HeatPump(email,sequence_number,seer,hspf) VALUES('${email}', ${seq_number}, ${heatpump_seer}, ${heatpump_hspf});`);
    }
  }

  res.redirect(`/appliances/list?email=${email}`);
};

// List Appliances for a household
export const listAppliances = (req, res) => {
  let email = req.query.email;
  let query = `SELECT sequence_number, type, manufacturer, model, btu FROM Appliance WHERE email = '${email}';`;
  let query1 = `
  WITH agg AS (
    SELECT a.email, a.sequence_number,'AC' AS type, "" AS manufacturer, "" as model
    FROM AirHandler AS a
    JOIN AirConditioner AS b on a.email = b.email and a.sequence_number = b.sequence_number
    WHERE a.email = '${email}'

    UNION
    SELECT a.email, a.sequence_number, 'Heater' AS type, "" AS manufacturer, "" as model
    FROM AirHandler as a
    JOIN Heater AS c on a.email = c.email and a.sequence_number = c.sequence_number
    WHERE a.email = '${email}'

    UNION
    SELECT a.email, a.sequence_number, 'Heat pump' AS type, "" AS manufacturer, "" as model
    FROM AirHandler AS a
    JOIN HeatPump AS d on a.email = d.email and a.sequence_number = d.sequence_number
    WHERE a.email = '${email}'
    GROUP BY 1,2
    )

    SELECT a.email, a.sequence_number, CONCAT('Air Handler:', ' ', COALESCE(GROUP_CONCAT(DISTINCT agg.type),' ')) AS type, a.manufacturer, a.model
    FROM Appliance AS a
    LEFT JOIN agg on a.email = agg.email and a.sequence_number = agg.sequence_number
    WHERE a.email = '${email}' and a.type = "air_handler"
    GROUP BY 1,2

    UNION
    SELECT a.email, a.sequence_number, 'Water Heater' AS type,  manufacturer, model
    FROM Appliance AS a
    WHERE a.email = '${email}' and a.type = "water_heater"
    GROUP BY 1,2
    `;

  db.query(query1, (err, result) => {
    if (err) {
      res.flash("errors", err);
      return res.render("appliances/list", {
        email: email,
      });
    } else {
      res.render("appliances/list", { apps: result, email: email });
    }
  });
};

// Delete Appliance
export const deleteApplianceById = (req, res) => {
  let email = req.query.email;
  let seq_number = req.query.seq_number;

  let query = `DELETE FROM Appliance WHERE sequence_number = ${seq_number} AND email = '${email}';`;
  db.query(query, err => {
    if (err) {
      throw err;
    } else {
      // res.redirect() needs to be absolute path otherwise it'll going to appliances/delete/appliances/list/?email=... whereas res.render() is relative to current model
      res.redirect("/appliances/list/?email=" + email);
    }
  });
};