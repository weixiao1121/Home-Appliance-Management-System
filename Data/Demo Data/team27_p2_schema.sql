CREATE DATABASE IF NOT EXISTS cs6400_su23_team27
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;
USE cs6400_su23_team27;

/* Tables */

CREATE TABLE IF NOT EXISTS PostalCode (
code VARCHAR(5) NOT NULL,
city VARCHAR(255) NOT NULL,
state VARCHAR(2) NOT NULL,
latitude DECIMAL(9,6) NOT NULL,
longitude DECIMAL(9,6) NOT NULL,
PRIMARY KEY (code)
);

CREATE TABLE IF NOT EXISTS Household (
email VARCHAR(255) NOT NULL,
square_footage INT NOT NULL,
type VARCHAR (255) NOT NULL,
postal_code VARCHAR(5) NOT NULL,
thermostat_setting_heat INT,
thermostat_setting_cool INT,
if_use_public_utility TINYINT NOT NULL,
PRIMARY KEY (email),
FOREIGN KEY (postal_code) REFERENCES PostalCode(code)
);

CREATE TABLE IF NOT EXISTS Manufacturer (
name VARCHAR(255) NOT NULL,
PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS PublicUtility  (
email VARCHAR(255) NOT NULL,
utility VARCHAR(255),
PRIMARY KEY (email, utility),
FOREIGN KEY (email) REFERENCES Household(email)
);

CREATE TABLE IF NOT EXISTS Appliance (
email VARCHAR(255) NOT NULL,
sequence_number INT NOT NULL,
type VARCHAR(255) NOT NULL,
model VARCHAR(255),
btu INT NOT NULL,
manufacturer VARCHAR(255) NOT NULL,
PRIMARY KEY (email, sequence_number),
FOREIGN KEY (email) REFERENCES Household(email)
);

CREATE TABLE IF NOT EXISTS Generator (
email VARCHAR(255) NOT NULL,
sequence_number INT NOT NULL,
type VARCHAR(255) NOT NULL,
storage_capacity INT,
avg_monthly INT NOT NULL,
PRIMARY KEY (email, sequence_number),
FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AirHandler (
email VARCHAR(255) NOT NULL,
sequence_number INT NOT NULL,
rpm INT NOT NULL,
PRIMARY KEY (email, sequence_number),
FOREIGN KEY (email, sequence_number) REFERENCES Appliance(email,sequence_number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Heater (
email VARCHAR(255) NOT NULL,
sequence_number INT NOT NULL,
energy_source  VARCHAR(255) NOT NULL,
PRIMARY KEY (email, sequence_number),
FOREIGN KEY (email, sequence_number) REFERENCES Appliance(email,sequence_number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AirConditioner (
email VARCHAR(255) NOT NULL,
sequence_number INT NOT NULL,
eer FLOAT NOT NULL,
PRIMARY KEY (email, sequence_number),
FOREIGN KEY (email, sequence_number) REFERENCES Appliance(email,sequence_number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS HeatPump (
email VARCHAR(255) NOT NULL,
sequence_number INT NOT NULL,
seer FLOAT NOT NULL,
hspf FLOAT NOT NULL,
PRIMARY KEY (email, sequence_number),
FOREIGN KEY (email, sequence_number) REFERENCES Appliance(email,sequence_number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WaterHeater (
email VARCHAR(255) NOT NULL,
sequence_number INT NOT NULL,
tank_size FLOAT NOT NULL,
energy_source VARCHAR(255) NOT NULL,
current_temperature_setting INT,
PRIMARY KEY (email, sequence_number),
FOREIGN KEY (email, sequence_number) REFERENCES Appliance(email,sequence_number) ON DELETE CASCADE
);





