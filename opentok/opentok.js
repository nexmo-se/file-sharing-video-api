const OpenTok = require('opentok');
const apiKey = process.env.VIDEO_API_API_KEY;
const apiSecret = process.env.VIDEO_API_API_SECRET;
console.log(apiKey);
if (!apiKey || !apiSecret) {
  throw new Error(
    'Missing config values for env params OT_API_KEY and OT_API_SECRET'
  );
}
let sessionId;

const opentok = new OpenTok(apiKey, apiSecret);

const createSessionandToken = () => {
  return new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: 'routed' }, function(error, session) {
      if (error) {
        reject(error);
      } else {
        sessionId = session.sessionId;
        const token = opentok.generateToken(sessionId);
        resolve({ sessionId: sessionId, token: token });
        //console.log("Session ID: " + sessionId);
      }
    });
  });
};

const generateToken = sessionId => {
  const token = opentok.generateToken(sessionId);
  return { token: token, apiKey: apiKey };
};

const getCredentials = async (session = null) => {
  const data = await createSessionandToken(session);
  sessionId = data.sessionId;
  const token = data.token;
  return { sessionId: sessionId, token: token, apiKey: apiKey };
};

module.exports = {
  getCredentials,
  generateToken,
  initiateArchiving,
  stopArchiving,
  listArchives
};
