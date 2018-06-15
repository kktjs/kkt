const proxy = {
  'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
  'POST /api/login': (req, res) => {
    const { password, username } = req.body;
    if (password === 'KKT' && username === 'KKT') {
      return res.json({
        code: 0,
        message: '登录成功！',
        data: {
          id: 1,
          username: 'admin',
          email: 'admin@admin.com',
          create_at: '2018-06-13T18:57:41.958Z',
          update_at: '2018-06-13T18:57:41.958Z',
        },
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
