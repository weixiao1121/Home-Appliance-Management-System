// Main Menu
export const index = (req, res) => {
  res.render("static/index");
};

// Reports
export const reports = (req, res) => {
  res.render("static/reports");
};

export const search = (req, res) => {
  res.render("static/search");
};

export const heatCool = (req, res) => {
  res.render("static/heat-cool");
};

export const waterHeater = (req, res) => {
  res.render("static/water-heater");
};

export const offgrid = (req, res) => {
  res.render("static/offgrid");
};

export const average = (req, res) => {
  res.render("static/average", {postal_code: ""});
};

export const submission = (req, res) => {
  res.render("static/submission");
};
