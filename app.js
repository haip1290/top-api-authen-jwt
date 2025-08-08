import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// TOKEN FORMAT
// Authorization :Bearer <>access_token

// Verify token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"]; // get auth header value
  if (typeof bearerHeader === "undefined") {
    return res.sendStatus(403);
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.SECRET, (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.data = authData;
  });
  next();
};

app.use((req, res, next) => {
  // Mock user
  req.context = {
    user: { id: 1, username: "brad", email: "brad@egmail.com" },
  };
  next();
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.post("/api/posts", verifyToken, (req, res) => {
  res.json({ message: "post was created", data: req.data });
});

app.post("/api/login", (req, res) => {
  const { user } = req.context;
  jwt.sign({ user }, process.env.SECRET, { expiresIn: "30s" }, (err, token) => {
    res.json({ token });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
