const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "contacts.db");

let db;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database, 
    });

    app.listen(5000, () => {
      console.log("Server is Running at http://localhost:5000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDBAndServer();

//add contact api
app.post("/add-contact", async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const getPhoneQuery = `SELECT * FROM contact WHERE phone = ?;`;
    const dbContact = await db.get(getPhoneQuery, [phone]);

    if (!dbContact) {
      const insertContactQuery = `
        INSERT INTO contact (name, email, phone)
        VALUES (?, ?, ?);
      `;
      await db.run(insertContactQuery, [name, email, phone]);
      res.status(200).send({ message: "Contact added successfully" });
    } else {
      res.status(200).send({ message: "Contact already exists!" });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});


//get contacts api
app.get("/get-contacts", async (req, res) => {
  try {
    const query = `SELECT * FROM contact;`;
    const contacts = await db.all(query);
    res.send(contacts);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});


//update contact api
app.put("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const updateQuery = `
      UPDATE contact
      SET name = ?, email = ?, phone = ?
      WHERE id = ?;
    `;
    await db.run(updateQuery, [name, email, phone, id]);
    res.status(200).send({ message: "Contact updated successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// DELETE Contact api
app.post("/delete-contact", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Contact ID is required." });
  }

  const query = `DELETE FROM contact WHERE id = ?`;
  await db.run(query, [id]);
  res.send({message: "user deleted successfully"});

});
