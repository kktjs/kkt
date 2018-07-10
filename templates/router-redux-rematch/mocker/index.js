const proxy = {
  'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
  'POST /api/login': (req, res) => {
    const { password, username } = req.body;
    if (password === 'KKT' && username === 'KKT') {
      return res.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        username: 'KKT',
      });
    }
    return res.status(401).json({
      error: 'bad username/password, access denied',
    });
  },
  'GET /api/user/list': [
    { id: 1, username: 'kenny', sex: 6 },
    { id: 2, username: 'kenny', sex: 6 },
  ],
};

module.exports = proxy;
