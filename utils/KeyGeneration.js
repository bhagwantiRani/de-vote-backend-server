const crypto = require("crypto");

const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return keyPair;
};
module.exports = {
  generateKeyPair,
};

// nodemailer auth ijkgqwdrptpmejte
