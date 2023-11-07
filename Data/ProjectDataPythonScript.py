# In this directory run the following commands:
# conda env create -f environment.yml
# conda activate CS6400
# python ProjectDataPythonScript.py YOUR_MYSQL_USER YOUR_MYSQL_PASSWORD

# Windows-only MySQL setup instructions
# Go to the MySQL shell
# Run in the MySQL shell "\sql"
# Run in the MySQL shell "\connect {root}@localhost" with {root} replaced with your username
# Run in the MySQL shell "use cs6400_su23_team27"
# Run schema file we turned in for phase 2 in MySQL shell "source filepath" with filepath replaced
# Explore the data with SQL queries in the MySQL shell

import mysql.connector
import random
import pandas as pd
import numpy as np
import platform
import sys

user, password = tuple(sys.argv[1:3])

# Set seed (comment out if random data is needed)
random.seed(1)

# Read postal code data and make it into list
postalCodeData = pd.read_csv("postal_codes.csv", header = 0)
postalCodeDataList = list(postalCodeData.itertuples(index=False, name=None))

# Make variables that are empty lists or pregenerated lists
numberEmail = 50
emailNumbers = range(numberEmail)
householdType = ["House", "apartment", "townhome", "condominium", "modular home", "tiny house"]
utilitiesList = ["electric", "gas", "steam", "liquid fuel"]
manufactureList = ["Whirlpool Corporation", "GE Appliances", "General Electric", "KitchenAid", "Kenmore", "Amana Corporation", "JennAir", "Admiral", "Bosch", "Samsung", "Electrolux", "Frigidaire", "Miele", "Sub-Zero", "Haier", "Thermador", "Hotpoint", "Panasonic", "Fisher & Paykel", "Cuisinart", "Beko", "LG Electronics", "AEG", "Viking"]
modelList = [None, "model1", "model2", "model3", "model4", "model5", "model6", "model7", "model8", "model9", "model10", "model11", "model12", "model13", "model14", "model15", "model16", "model17", "model18", "model19", "model20"]
generatorTypeList = ["solar", "wind-turbine"]
randomBattery = ["none", "number"]
energySource = ["electric", "gas", "thermosolar"]
waterHeaterEnergySource = ["electric", "gas", "fuel oil", "heat pump"]
householdList = []
temporaryList = []

# For loop to populate household data
for i in range(numberEmail):
     email = "user" + str(emailNumbers[i]) + "@gatech.edu"
     squareFootage = random.randint(0, 10000)
     tupleHousehold = householdType[random.randint(0, len(householdType) - 1)]
     numberOfUtilities = random.randint(0, len(utilitiesList))
     if (numberOfUtilities == 0):
          temporaryList.append((email, ""))
     else:
          for k in range(numberOfUtilities):
               oneUtility = utilitiesList[random.randint(0, len(utilitiesList) - 1)]
               whileBoolean = False
               while whileBoolean == False:
                    if ((email, oneUtility) not in temporaryList):
                         temporaryList.append((email, oneUtility))
                         whileBoolean = True
                    else:
                         oneUtility = utilitiesList[random.randint(0, len(utilitiesList) - 1)]
     if (numberOfUtilities == 0):
          ifUsePublicUtility = False
     else:
          ifUsePublicUtility = True
     thermoSettingHeat = random.randint(60, 80)
     thermoSettingCool = random.randint(60, 80)
     zipcode = postalCodeData["Zip"].iloc[random.randint(0, len(postalCodeData) - 1)]
     trueOrFalseHeat = random.randint(0, 1)
     trueOrFalseCool = random.randint(0, 1)
     if ((trueOrFalseCool == 1) and (trueOrFalseHeat == 1)):
          householdList.append((email, int(squareFootage), tupleHousehold, int(thermoSettingCool), int(thermoSettingHeat), str(zipcode), ifUsePublicUtility))
     elif ((trueOrFalseCool == 1) and (trueOrFalseHeat == 0)):
          householdList.append((email, int(squareFootage), tupleHousehold, int(thermoSettingCool), None, str(zipcode), ifUsePublicUtility))
     elif ((trueOrFalseCool == 0) and (trueOrFalseHeat == 1)):
          householdList.append((email, int(squareFootage), tupleHousehold, None, int(thermoSettingHeat), str(zipcode), ifUsePublicUtility))
     else:
          householdList.append((email, int(squareFootage), tupleHousehold, None, None, str(zipcode), ifUsePublicUtility))
     
householdTable = pd.DataFrame(householdList, columns = ["email", "square_footage", "type", "thermostat_setting_cool", "thermostat_setting_heat", "postal_code", "if_use_public_utility"])

applianceList = []
for m, v, w in zip(householdTable["email"], householdTable["thermostat_setting_heat"], householdTable["thermostat_setting_cool"]):
     numberOfAppliances = random.randint(1, 10) + (v != None) + (w != None)
     for n in range(numberOfAppliances):
          modelName = modelList[random.randint(0, len(modelList) - 1)]
          btuNumber = random.randint(500, 18000)
          temporaryManufacturer = manufactureList[random.randint(0, len(manufactureList) - 1)]
          applianceList.append((m, n, "", modelName, btuNumber, temporaryManufacturer))

generatorList = []
for r in range(householdTable.shape[0]):
     if (householdTable["if_use_public_utility"].iloc[r] == False):
          temporaryNumberNeeded = random.randint(1, 10)
     else:
          temporaryNumberNeeded = random.randint(0, 10)
     
     if (temporaryNumberNeeded != 0):
          for s in range(temporaryNumberNeeded):
               temporaryGenerator = generatorTypeList[random.randint(0, len(generatorTypeList) - 1)]
               randomBatteryTemporary = randomBattery[random.randint(0, len(randomBattery) - 1)]
               if (randomBatteryTemporary == "none"):
                    temporaryBattery = None
               else:
                    temporaryBattery = random.randint(0, 100)
               storageCapacity = random.randint(0, 10000)
               generatorList.append((householdTable["email"].iloc[r], s, temporaryGenerator, temporaryBattery, storageCapacity))

waterHeaterList = []
applianceTable = pd.DataFrame(applianceList, columns = ["email", "sequence_number", "type", "model", "BTU", "manufacturer"])
heaterDictionary = {}
coolerDictionary = {}
heatPumpDictionary = {}
for y in householdTable["email"]:
     heaterDictionary[y] = 0
     coolerDictionary[y] = 0
     heatPumpDictionary[y] = 0
householdTableEmailIndex = pd.DataFrame(householdList, columns = ["email", "square_footage", "type", "thermostat_setting_cool", "thermostat_setting_heat", "postal_code", "if_use_public_utility"])
householdTableEmailIndex = householdTableEmailIndex.set_index("email")
heaterList = []
coolerList = []
airHandlerList = []
heatPumpList = []
applianceChoice = ["heater", "heat pump", "air conditioner", "water heater"]
for o in range(applianceTable.shape[0]):
     temporaryEmail = applianceTable["email"].iloc[o]
     rpm = int(random.randint(1000, 50000))
     randomEER = random.uniform(0, 100)
     randomSEER = random.uniform(0, 100)
     randomHSPF = random.uniform(0, 100)
     
     if (((heaterDictionary[temporaryEmail] < 1) and (coolerDictionary[temporaryEmail] < 1) and not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_heat"])) and not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_cool"]))) and ((heatPumpDictionary[temporaryEmail] < 1) and not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_heat"])) and not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_cool"])))):
          
          whichWay = random.randint(0, 1)
          if (whichWay == 0):
               heaterList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), energySource[random.randint(0, len(energySource) - 1)]))
               coolerList.append((temporaryEmail, 10000 * (1 + int(applianceTable["sequence_number"].iloc[o])), randomEER))
               applianceTable["type"].iloc[o] = "air handler"
               applianceTable = applianceTable.append(pd.Series({"email": temporaryEmail, "sequence_number": (10000 * (1 + int(applianceTable["sequence_number"].iloc[o]))), "type": "air handler", "model": modelList[random.randint(0, len(modelList) - 1)], "BTU": random.randint(500, 18000), "manufacturer": manufactureList[random.randint(0, len(manufactureList) - 1)]}), ignore_index = True)
               heaterDictionary[temporaryEmail] += 1
               coolerDictionary[temporaryEmail] += 1
               airHandlerList.append((temporaryEmail, (10000 * (1 + int(applianceTable["sequence_number"].iloc[o]))), int(rpm)))
          else:
               airHandlerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), int(rpm)))
               heatPumpList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), float(randomSEER), float(randomHSPF)))
               applianceTable["type"].iloc[o] = "air handler"
               heatPumpDictionary[temporaryEmail] += 1
          
     elif ((heaterDictionary[temporaryEmail] < 1) and not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_heat"])) and (heatPumpDictionary[temporaryEmail] < 1)):
          
          heaterList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), energySource[random.randint(0, len(energySource) - 1)]))
          airHandlerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), int(rpm)))
          applianceTable["type"].iloc[o] = "air handler"
          heaterDictionary[temporaryEmail] += 1
          
     elif ((coolerDictionary[temporaryEmail] < 1) and not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_cool"])) and (heatPumpDictionary[temporaryEmail] < 1)):
          
          coolerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), randomEER))
          airHandlerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), int(rpm)))
          applianceTable["type"].iloc[o] = "air handler"
          coolerDictionary[temporaryEmail] += 1
          
     else:
          if (not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_heat"])) and not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_cool"])) and (applianceChoice[random.randint(0, len(applianceChoice) - 1)] == "heat pump")):
               
               airHandlerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), int(rpm)))
               heatPumpList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), float(randomSEER), float(randomHSPF)))
               applianceTable["type"].iloc[o] = "air handler"
               
          elif (not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_heat"])) and (applianceChoice[random.randint(0, len(applianceChoice) - 1)] == "heater")):
               heaterList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), energySource[random.randint(0, len(energySource) - 1)]))
               airHandlerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), int(rpm)))
               applianceTable["type"].iloc[o] = "air handler"
               
          elif (not (np.isnan(householdTableEmailIndex.loc[temporaryEmail]["thermostat_setting_cool"])) and (applianceChoice[random.randint(0, len(applianceChoice) - 1)] == "air conditioner")):
               coolerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), randomEER))
               airHandlerList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), int(rpm)))
               applianceTable["type"].iloc[o] = "air handler"
               
          else:
               randomSource = waterHeaterEnergySource[random.randint(0, len(waterHeaterEnergySource) - 1)]
               tankSize = random.uniform(0, 100)
               tempSettingIndicator = random.randint(0, 1)
               if (tempSettingIndicator == 0):
                    randomTemp = None
               else:
                    randomTemp = random.randint(0, 100)
               
               waterHeaterList.append((temporaryEmail, int(applianceTable["sequence_number"].iloc[o]), tankSize, randomSource, randomTemp))
               applianceTable["type"].iloc[o] = "water heater"

countEmail = {}
for oneEmail in set(applianceTable["email"]):
     countEmail[oneEmail] = 0

for oneEmail2 in applianceTable["email"]:
     countEmail[oneEmail2] += 1

cnx = mysql.connector.connect(user = user, password = password, host = '127.0.0.1', database = 'cs6400_su23_team27')

mycursor = cnx.cursor()

# Create and run delete statements to clean up DB
mycursor.execute("Delete From Manufacturer")
cnx.commit()

mycursor.execute("Delete From WaterHeater")
cnx.commit()

mycursor.execute("Delete From HeatPump")
cnx.commit()


mycursor.execute("Delete From AirConditioner")
cnx.commit()

mycursor.execute("Delete From Heater")
cnx.commit()

mycursor.execute("Delete From AirHandler")
cnx.commit()

mycursor.execute("Delete From Generator")
cnx.commit()

mycursor.execute("Delete From Appliance")
cnx.commit()

mycursor.execute("Delete From PublicUtility")
cnx.commit()

mycursor.execute("Delete From Household")
cnx.commit()

mycursor.execute("Delete From PostalCode")
cnx.commit()

# Create SQL statements with values to be added into string
manufacturers = [("Whirlpool Corporation",), ("GE Appliances",), ("General Electric",), ("KitchenAid",), ("Kenmore",), ("Amana Corporation",), ("JennAir",), ("Admiral",), ("Bosch",), ("Samsung",), ("Electrolux",), ("Frigidaire",), ("Miele",), ("Sub-Zero",), ("Haier",), ("Thermador",), ("Hotpoint",), ("Panasonic",), ("Fisher & Paykel",), ("Cuisinart",), ("Beko",), ("LG Electronics",), ("AEG",), ("Viking",)]

sqlHousehold = "Insert into Household (email, square_footage, type, thermostat_setting_cool, thermostat_setting_heat, postal_code, if_use_public_utility) values (%s, %s, %s, %s, %s, %s, %s)"
val = householdList

sqlUtilities = "Insert into PublicUtility (email, utility) values (%s, %s)"

valUtilities = temporaryList

sqlAppliances = "Insert into Appliance (email, sequence_number, type, model, BTU, manufacturer) values (%s, %s, %s, %s, %s, %s)"

sqlGenerators = "Insert into Generator (email, sequence_number, type, storage_capacity, avg_monthly) values (%s, %s, %s, %s, %s)"

sqlAirHandlers = "Insert into AirHandler (email, sequence_number, RPM) values (%s, %s, %s)"

sqlHeaters = "Insert into Heater (email, sequence_number, energy_source) values (%s, %s, %s)"

sqlCoolers = "Insert into AirConditioner (email, sequence_number, EER) values (%s, %s, %s)"

sqlHeatPumps = "Insert into HeatPump (email, sequence_number, SEER, HSPF) values (%s, %s, %s, %s)"

sqlWaterHeaters = "Insert into WaterHeater (email, sequence_number, tank_size, energy_source, current_temperature_setting) values (%s, %s, %s, %s, %s)"

sqlPostal = "Insert into PostalCode (code, city, state, latitude, longitude) values (%s, %s, %s, %s, %s)"

# Run the above SQL queries
mycursor.executemany("Insert into Manufacturer (name) values (%s)", manufacturers)
cnx.commit()

mycursor.executemany(sqlPostal, postalCodeDataList)
cnx.commit()

mycursor.executemany(sqlHousehold, val)
cnx.commit()
print(mycursor.rowcount, "details inserted")

mycursor.executemany(sqlUtilities, valUtilities)
cnx.commit()

mycursor.executemany(sqlAppliances, applianceTable.values.tolist())
cnx.commit()

mycursor.executemany(sqlGenerators, generatorList)
cnx.commit()

mycursor.executemany(sqlAirHandlers, airHandlerList)
cnx.commit()

mycursor.executemany(sqlHeaters, heaterList)
cnx.commit()

mycursor.executemany(sqlCoolers, coolerList)
cnx.commit()

mycursor.executemany(sqlHeatPumps, heatPumpList)
cnx.commit()

mycursor.executemany(sqlWaterHeaters, waterHeaterList)
cnx.commit()

cnx.close()
