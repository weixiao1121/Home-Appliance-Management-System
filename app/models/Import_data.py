# Import libraries
import mysql.connector
import pandas as pd
import numpy as np
import sys
user, password = tuple(sys.argv[1:3])

# Read data
applianceData = pd.read_csv("Appliance.tsv", sep = "\t", header = 0, dtype = {'btu': object, "rpm": object, 'temperature': object})
applianceData = applianceData.where((pd.notnull(applianceData)), None)
householdData = pd.read_csv("Household.tsv", sep = "\t", header = 0, dtype={'postal_code': object})
manufacturerData = pd.read_csv("Manufacturer.tsv", sep = "\t", header = 0)
powerData = pd.read_csv("Power.tsv", sep = "\t", header = 0, dtype = {'kilowatt_hours': object, 'battery': object})
print(applianceData.shape)
print(householdData.shape)
print(manufacturerData.shape)
print(powerData.shape)
powerData = powerData.where((pd.notnull(powerData)), None)

# Read postal code data and make it into list
postalCodeData = pd.read_csv("postal_codes.csv", header = 0, dtype={'Zip': object})
postalCodeDataList = list(postalCodeData.itertuples(index=False, name=None))

# Appliance function to make lists of tuples for Appliance, AirHandler, WaterHeater, HeatPump, 
# Heater, and AirConditioner tables
def applianceFunction(applianceData):
     applianceList = []
     airHandlerList = []
     waterHeaterList = []
     heatPumpList = []
     heaterList = []
     airConditionerList = []
     for i in range(applianceData.shape[0]):
          applianceEmail = applianceData.iloc[i]["household_email"]
          sequenceNumber = int(applianceData.iloc[i]["appliance_number"])
          applianceType = applianceData.iloc[i]["appliance_type"]
          model = applianceData.iloc[i]["model"]
          btu = int(applianceData.iloc[i]["btu"])
          manufacturer = applianceData.iloc[i]["manufacturer_name"]
          airHandlerTypes = applianceData.iloc[i]["air_handler_types"]
          rpm = applianceData.iloc[i]["rpm"]
          tankSize = float(applianceData.iloc[i]["tank_size"])
          energySource = applianceData.iloc[i]["energy_source"]
          temperature = applianceData.iloc[i]["temperature"]
          seer = float(applianceData.iloc[i]["seer"])
          hspf = float(applianceData.iloc[i]["hspf"])
          eer = float(applianceData.iloc[i]["eer"])
          applianceList.append((applianceEmail, sequenceNumber, applianceType, model, btu, manufacturer))
          
          if (applianceType == "air_handler"):
               allAirHandler = airHandlerTypes.split(",")
               airHandlerList.append((applianceEmail, sequenceNumber, rpm))
               for j in allAirHandler:
                    if (j == "heatpump"):
                         heatPumpList.append((applianceEmail, sequenceNumber, seer, hspf))
                    elif (j == "heater"):
                         heaterList.append((applianceEmail, sequenceNumber, energySource))
                    else:
                         airConditionerList.append((applianceEmail, sequenceNumber, eer))
          else:
               waterHeaterList.append((applianceEmail, sequenceNumber, tankSize, energySource, temperature))
     return (applianceList, airHandlerList, waterHeaterList, heatPumpList, heaterList, airConditionerList)

# Household function to make lists of tuples for Household and PublicUtilities tables
def householdFunction(householdData):
     utilitiesList = []
     householdList = []
     for k in range(householdData.shape[0]):
          householdEmail = householdData.iloc[k]["email"]
          householdType = householdData.iloc[k]["household_type"]
          footage = householdData.iloc[k]["footage"]
          heatingTemperature = householdData.iloc[k]["heating_temp"]
          coolingTemperature = householdData.iloc[k]["cooling_temp"]
          postalCode = householdData.iloc[k]["postal_code"]
          utilities = householdData.iloc[k]["utilities"]
          if (isinstance(utilities, str)):
               allUtilities = utilities.split(",")
               for n in allUtilities:
                    utilitiesList.append((householdEmail, n))
               if (np.isnan(heatingTemperature) and not(np.isnan(coolingTemperature))):
                    householdList.append((householdEmail, int(footage), householdType, postalCode, None, int(coolingTemperature), 1))
               elif (not(np.isnan(heatingTemperature)) and np.isnan(coolingTemperature)):
                    householdList.append((householdEmail, int(footage), householdType, postalCode, int(heatingTemperature), None, 1))
               elif (np.isnan(heatingTemperature) and np.isnan(coolingTemperature)):
                    householdList.append((householdEmail, int(footage), householdType, postalCode, None, None, 1))
               else:
                    householdList.append((householdEmail, int(footage), householdType, postalCode, int(heatingTemperature), int(coolingTemperature), 1))
          else:
               if (np.isnan(heatingTemperature) and not(np.isnan(coolingTemperature))):
                    householdList.append((householdEmail, int(footage), householdType, postalCode, None, int(coolingTemperature), 0))
               elif (not(np.isnan(heatingTemperature)) and np.isnan(coolingTemperature)):
                    householdList.append((householdEmail, int(footage), householdType, postalCode, int(heatingTemperature), None, 0))
               elif (np.isnan(heatingTemperature) and np.isnan(coolingTemperature)):
                    householdList.append((householdEmail, int(footage), householdType, postalCode, None, None, 0))
               else:
                    householdList.append((householdEmail, int(footage), householdType, postalCode, int(heatingTemperature), int(coolingTemperature), 0))
     return (householdList, utilitiesList)

# Manufacturer function to make list of tuples for Manufacturer table
def manufacturerFunction(manufacturerData):
     manufacturerList = list(manufacturerData.itertuples(index=False, name=None))
     return manufacturerList

# Power function to make list of tuples for Generator table
def powerFunction(powerData):
     powerList = list(powerData.itertuples(index=False, name=None))
     return powerList

# Running functions and putting results in variables
manufacturerList = manufacturerFunction(manufacturerData)
householdList, utilitiesList = householdFunction(householdData)
applianceList, airHandlerList, waterHeaterList, heatPumpList, heaterList, airConditionerList = applianceFunction(applianceData)
powerList = powerFunction(powerData)

# Connecting to database
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

# Insert statements and running
mycursor.executemany("Insert into Manufacturer (name) values (%s)", manufacturerList)
cnx.commit()

sqlPostal = "Insert into PostalCode (code, city, state, latitude, longitude) values (%s, %s, %s, %s, %s)"
mycursor.executemany(sqlPostal, postalCodeDataList)
cnx.commit()

sqlHousehold = "Insert into Household (email, square_footage, type, postal_code, thermostat_setting_heat, thermostat_setting_cool, if_use_public_utility) values (%s, %s, %s, %s, %s, %s, %s)"
mycursor.executemany(sqlHousehold, householdList)
cnx.commit()
print(mycursor.rowcount, "details inserted")

sqlUtilities = "Insert into PublicUtility (email, utility) values (%s, %s)"
mycursor.executemany(sqlUtilities, utilitiesList)
cnx.commit()

sqlAppliances = "Insert into Appliance (email, sequence_number, type, model, BTU, manufacturer) values (%s, %s, %s, %s, %s, %s)"
mycursor.executemany(sqlAppliances, applianceList)
cnx.commit()

sqlGenerators = "Insert into Generator (email, sequence_number, type, avg_monthly, storage_capacity) values (%s, %s, %s, %s, %s)"
mycursor.executemany(sqlGenerators, powerList)
cnx.commit()

sqlAirHandlers = "Insert into AirHandler (email, sequence_number, RPM) values (%s, %s, %s)"
mycursor.executemany(sqlAirHandlers, airHandlerList)
cnx.commit()

sqlHeaters = "Insert into Heater (email, sequence_number, energy_source) values (%s, %s, %s)"
mycursor.executemany(sqlHeaters, heaterList)
cnx.commit()

sqlCoolers = "Insert into AirConditioner (email, sequence_number, EER) values (%s, %s, %s)"
mycursor.executemany(sqlCoolers, airConditionerList)
cnx.commit()

sqlHeatPumps = "Insert into HeatPump (email, sequence_number, SEER, HSPF) values (%s, %s, %s, %s)"
mycursor.executemany(sqlHeatPumps, heatPumpList)
cnx.commit()

sqlWaterHeaters = "Insert into WaterHeater (email, sequence_number, tank_size, energy_source, current_temperature_setting) values (%s, %s, %s, %s, %s)"
mycursor.executemany(sqlWaterHeaters, waterHeaterList)
cnx.commit()

cnx.close()