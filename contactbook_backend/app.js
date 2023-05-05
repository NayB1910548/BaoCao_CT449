const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const app = express();
const contactsRouter = require("./app/routes/contact.route");
app.use(cors());
app.use(express.json());

app.get("/" , (req, res) => {
	res.json({message: "Welcome to contact book application." });
});

app.use("/api/contacts", contactsRouter);

app.use("/api/contacts",(req, res, next) => {
	return next(new ApiError(404, "Resource not found"));
});

app.use((error, req, res, next) => {
	return res.status(error.statusCode || 500).json({
		message: error.message || "Resource not found",
	});
});

module.exports = app;



