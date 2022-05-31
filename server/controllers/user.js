const uuid = require("uuid");
const { createCompany, getConnections } = require("../clients/codat");
const { userIdMap, getUserStorage } = require("../storage/user");

const userLogin = async (req, res) => {
  const userName = req.body.username;
  
  if (!userName) {
    res.status(400).send({error: "username is a required field"});
  }

  // Try to get user ID for an existing user
  const userId = userIdMap.getItem(userName) ?? uuid.v4();
  // Set the userIdMap value
  userIdMap.setItem(userName, userId);

  const userStorage = getUserStorage(userId);
  if(!userStorage.getItem("codat-company-id")) {
    // Codat company has not been created
    // So we will create it by posting to the Codat API
    const resultBody = await createCompany(userName);
    const codatCompanyId = resultBody.id;
    if (codatCompanyId) {
      console.log("Setting codat company ID as", codatCompanyId, "for user", userId);
      userStorage.setItem("codat-company-id", codatCompanyId);
    }
  }

  res.json({ userName, userId });
};

const getUserConnections = async(req, res) => {
  const userId = req.params.userId;
  
  if (!userId) {
    res.status(400).send({error: "userId is a required field"});
  }
  
  const userStorage = getUserStorage(userId);
  
  if (!userStorage) {
    res.status(400).send({error: "Unknown user id"});
  }

  const codatCompanyId = userStorage.getItem("codat-company-id");
  // const codatCompanyId = 'a3493abc-7768-4847-a72a-8eb0326a5fa5';
  
  if (!codatCompanyId) {
    res.status(400).send({error: "User ID has not been set up with codat"});
  }

  console.log("Getting connections for user", userId, "codat company ID", codatCompanyId);
  
  const results = await getConnections(codatCompanyId);

  res.json(results);
}

exports.userLogin = userLogin;
exports.getUserConnections = getUserConnections;
