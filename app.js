const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "covid19India.db");

let db = null;

const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log(`Server Running at http://localhost:3000`);
    });
  } catch (e) {
    console.log(`Db Error ${e.message}`);
    process.exit(1);
  }
};

initializeDatabaseAndServer();

//Get all states API

app.get("/states/", async (request, response) => {
  const getStatesQuery = `
      SELECT * 
      FROM state
    `;
  const stateArray = await db.all(getStatesQuery);
  response.send(stateArray);
});

//GET state API

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateQuery = `
       SELECT *
       FROM state
       WHERE state_id = ${stateId};
    `;
  const state = await db.run(getStateQuery);
  response.send(state);
});

// POST district API

app.post("/districts/", async (request, response) => {
  const getDetails = request.body;
  const { districtName, stateId, cases, cured, active, deaths } = getDetails;
  const addDistrictQuery = `
  INSERT INTO 
      district (district_name, state_id, cases, cured, active, deaths)
  VALUES(
    ${districtName},
    ${districtName},
    ${cases},
    ${cured},
    ${active},
    ${deaths}
  );`;
  await db.run(addDistrictQuery);
  response.send("District Successfully Added");
});

//GET district districts  API

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrictQuery = `
       SELECT *
       FROM district 
       WHERE district_id = ${districtId};
    `;
  const district = await db.run(getDistrictQuery);
  response.send(district);
});

//Delete district districtId API

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deleteDistrictsQuery = `
    DELETE
      FROM district
    WHERE
      district_id = ${districtId};`;
  await db.run(deleteDistrictsQuery);
  response.send("District Remove");
});

//update district districtId API

app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getBody = request.body;
  const { districtName, stateId, cases, cured, active, deaths } = getBody;
  const updateDistrictsQuery = `
  UPDATE
    district
  SET 
    district_name:${districtName},
    state_id: ${stateId},
    cases: ${cases},
    cured: ${cured},
    active: ${active},
    deaths: ${deaths},
  WHERE
    district_id = ${districtId} ;`;
  await db.run(updateDistrictsQuery);
  response.send("District Details Updated");
});

//GET state states  API

app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const getStatesStatsQuery = `
       SELECT SUM(cases),
               SUM(cured), 
               SUM(active),
               SUM(deaths)
       FROM district 
       WHERE state_id = ${stateId};
    `;
  const stats = await db.run(getStatesStatsQuery);
  console.log(stats);
  response.send({
    totalCases: stats["SUM(cases)"],
    totalCured: stats["SUM(cured)"],
    totalActive: stats["SUM(active)"],
    totalDeaths: stats["SUM(deaths)"],
  });
});

//GET districts details API

app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrictsDetailsQuery = `
       SELECT state_name as stateName FROM state
       WHERE state_id = ${getDistrictsDetailsQuery.state_id};
    `; //With this we will get state_name as stateName using the state_id
  const getStateNameQueryResponse = await database.get(
    getDistrictsDetailsQuery
  );
  response.send(getStateNameQueryResponse);
});

module.exports = app;
