const express = require("express");
const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    database: "apollo_technical"
});
const app = express();
const PORT = 8000;
app.use(express.json());

const vehicleValidation = (req, res, next) => {
    let {
        manufacturer_name,
        description,
        horse_power,
        model_name,
        model_year,
        purchase_price,
        fuel_type
    } = req.body;
    if(!manufacturer_name){
        return res.status(400).send("manufacturer_name not provided");
    }
    if(!description){
        return res.status(400).send("description not provided");
    }
    if(!horse_power){
        return res.status(400).send("horse_power cannot be 0");
    }
    if(!model_name){
        return res.status(400).send("model_name not provided");
    }
    if(!model_year){
        return res.status(400).send("model_year cannot be 0");
    }
    if(!purchase_price){
        return res.status(400).send("purchase_price cannot be 0");
    }
    if(!fuel_type){
        return res.status(400).send("fuel_type not provided");
    }
    if(typeof manufacturer_name !== 'string') {
        return res.status(400).send("manufacturer_name provided isn't a string");
    }
    if(typeof description !== 'string') {
        return res.status(400).send("description provided isn't a string");
    }
    if(typeof horse_power !== 'number') {
        return res.status(400).send("horse_power provided isn't a number");
    }
    if(typeof model_name !== 'string') {
        return res.status(400).send("model_name provided isn't a string");
    }
    if(typeof model_year !== 'number') {
        return res.status(400).send("model_year provided isn't a number");
    }
    if(typeof purchase_price !== 'number') {
        return res.status(400).send("purchase_price provided isn't a number");
    }
    if(typeof fuel_type !== 'string') {
        return res.status(400).send("fuel_type provided isn't a string");
    }
    next();
}

// This is only necessary because for some reason postgres returns numericals as a string when they should be returned as a number
const parseVehicle = vehicle => {
    vehicle.purchase_price = Number.parseFloat(vehicle.purchase_price);
    return vehicle;
};

app.get("/vehicle", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM vehicles");
        res.json(rows);
    }
    catch(err) {
        console.log(err);
        res.status(500);
        res.send("Something went wrong");
    }
});

app.get("/vehicle/:vin", async (req, res) => {
    try {
        const { vin } = req.params;
        const { rows: [vehicle] } = await pool.query("SELECT * FROM vehicles WHERE vin = $1", [vin]);
        res.json(parseVehicle(vehicle));
    }
    catch(err) {
        res.status(500);
        res.send("Something went wrong");
    }
});

app.post("/vehicle", vehicleValidation, async (req, res) => {
    try {
        const {
            manufacturer_name,
            description,
            horse_power,
            model_name,
            model_year,
            purchase_price,
            fuel_type
        } = req.body;
        const { rows: [newVehicle] } = await pool.query(
            "INSERT INTO vehicles" + 
            "(manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type)" +
            "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type]
        );
        res.status(201);
        res.json(parseVehicle(newVehicle));
    }
    catch(err) {
        console.log(err);
        res.status(500);
        res.send("Something went wrong");
    }
});

app.put("/vehicle/:vin", vehicleValidation, async (req, res) => {
    try {
        const { vin } = req.params;
        const {
            manufacturer_name,
            description,
            horse_power,
            model_name,
            model_year,
            purchase_price,
            fuel_type
        } = req.body;
        const { rows: [updatedVehicle] } = await pool.query(
            "UPDATE vehicles " + 
            "SET manufacturer_name = $1, description = $2, " + 
            "horse_power = $3, model_name = $4, model_year = $5, " + 
            "purchase_price = $6, fuel_type = $7 " + 
            "WHERE vin = $8 RETURNING *",
            [manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type, vin]
        );
        res.json(parseVehicle(updatedVehicle));
    }
    catch(err) {
        console.log(err);
        res.status(500);
        res.send("Something went wrong");
    }
});

app.delete("/vehicle/:vin", async (req, res) => {
    try {
        const { vin } = req.params;
        await pool.query("DELETE FROM vehicles WHERE vin = $1", [vin]);
        res.sendStatus(204);
    }
    catch(err) {
        res.status(500);
        res.send("Something went wrong");
    }
});

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});