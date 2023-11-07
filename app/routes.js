// import express
import express from "express";

// import functions from controllers
import {
  generatorForm,
  createGenerator,
  deleteGeneratorById,
  listGenerators,
} from "./models/generator.js";
import {
  index,
  reports,
  search,
  average,
  submission,
} from "./models/static.js";

import { householdForm, createHousehold } from "./models/household.js";
import { searchManufactures } from "./models/search.js";
import {
  applianceForm,
  createAppliance,
  deleteApplianceById,
  listAppliances,
} from "./models/appliance.js";
import { getStates, statedrilldown } from "./models/water-heater.js";
import { getTopManufacturers, manufacturerdrilldown, airhandlerDrilldown, renderManufacturers } from "./models/top25.js";
import { hhAverages } from "./models/averages.js";
import {
  getBulletOne,
  getBulletTwo,
  getBulletThree,
  getBulletFour,
  getBulletFive,
  getBulletSix,
  getBulletSeven,
  renderOffgrid,
} from "./models/offgrid.js";
import {
  getBulletOneHC,
  getBulletTwoHC,
  getBulletThreeHC,
  renderHC,
} from "./models/heat-cool.js";

// init express router
const router = express.Router();

// Static pages e.g. welcome menu
router.get("/", index);
router.get("/submission", submission);

// Get forms
router.get("/households", householdForm);
router.get("/appliances", applianceForm);
router.get("/generators", generatorForm);

// Create new entities
router.post("/households/add", createHousehold);
router.post("/appliances/add", createAppliance);
router.post("/generators/add", createGenerator);

// Delete entities
router.post("/appliances/delete", deleteApplianceById);
router.post("/generators/delete", deleteGeneratorById);

// List
router.get("/appliances/list", listAppliances);
router.get("/generators/list", listGenerators);

// View report pages
router.get("/reports", reports);
router.get("/reports/top25", getTopManufacturers);
router.get("/reports/manufacturers", manufacturerdrilldown, airhandlerDrilldown,renderManufacturers);
router.get("/reports/search", search);
router.post("/reports/search", searchManufactures);
router.get(
  "/reports/heat-cool",
  getBulletOneHC,
  getBulletTwoHC,
  getBulletThreeHC,
  renderHC,
);
router.get("/reports/water-heater", getStates);
router.get("/reports/state", statedrilldown);
router.get(
  "/reports/offgrid-households",
  getBulletOne,
  getBulletTwo,
  getBulletThree,
  getBulletFour,
  getBulletFive,
  getBulletSix,
  getBulletSeven,
  renderOffgrid,
);
router.get("/reports/household-average", average);
router.post("/reports/household-average", hhAverages);

// export default router
export default router;
