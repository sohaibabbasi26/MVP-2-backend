const { adminassignedservice } = require("../services/adminassignedservice");

async function adminassignedhandler(req, res) {
  try {
    const data = req.body;
    const result = await adminassignedservice(data);
    res.send(result);
  } catch (error) {
    console.error("Error in admin-assigned-handler:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { adminassignedhandler };
