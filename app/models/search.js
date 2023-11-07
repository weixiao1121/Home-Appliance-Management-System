import db from "../config/database.js";

export const searchManufactures = (req, res) => {
  const search_term = req.body.search_term;
  const query = `SELECT DISTINCT m.name, a.model FROM Manufacturer AS m CROSS JOIN Appliance AS a ON m.name = a.manufacturer WHERE m.name LIKE '%${search_term}%' OR a.model LIKE '%${search_term}%' ORDER BY m.name, a.model`;

  db.query(query, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.render("static/search", { results: rows, search_term: search_term });
    }
  });
};
