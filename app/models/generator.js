// import connectionHousehold
import db from "../config/database.js";

// New Generator form
export const generatorForm = (req, res) => {
  let email = req.query.email;
  let query = `SELECT if_use_public_utility FROM Household WHERE email = '${email}';`;
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    } else {

      db.query(`SELECT * FROM Generator where email = '${email}'`, (err, genResult) => {
        if (err) {
          throw err;
        } else {
          const offgrid = result[0].if_use_public_utility == 1 ? true : false;
          const hasGenerators = genResult.length > 0 ? true : false;
          let skipButtonEnabled = hasGenerators ? true : offgrid
          res.render("generators/form", {email: email, skipButtonEnabled: skipButtonEnabled});
        }
      })

    }
  });
};

// Create New Generator
export const createGenerator = (req, res) => {
  let email = req.body.email;
  let type = req.body.type;
  let avg_monthly = req.body.avg_monthly;
  let storage_capacity = req.body.storage_capacity
    ? req.body.storage_capacity
    : 0;

  let query0 = `SELECT max(sequence_number) AS max FROM Generator WHERE email = '${email}';`;
  db.query(query0, (err, result) => {
    if (err) {
      throw err;
    } else {
      let seq_number = 1;
      if (result[0].max) {
        seq_number = result[0].max + 1;
      }

      let query = `INSERT INTO Generator(email,sequence_number,type,avg_monthly,storage_capacity) VALUES('${email}',${seq_number},'${type}',${avg_monthly},${storage_capacity});`;
      db.query(query, (err, results) => {
        if (err) {
          throw err;
        } else {
          res.redirect("/generators/list/?email=" + email);
        }
      });
    }
  });
};

// List Generators
export const listGenerators = (req, res) => {
  let email = req.query.email;
  let query = `SELECT * FROM Generator WHERE email = '${email}'`;
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    } else {
      res.render("generators/list", { gens: results, email: email });
    }
  });
};

// Delete Generator
export const deleteGeneratorById = (req, res) => {
  let email = req.query.email;
  let seq_number = req.query.seq_number;

  let query = `DELETE FROM Generator WHERE sequence_number = ${seq_number} AND email = '${email}'`;
  db.query(query, err => {
    if (err) {
      res.flash("errors", err);
      return res.render("generators");
    } else {
      res.redirect("/generators/list/?email=" + email);
    }
  });
};
