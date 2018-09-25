const proxy = {
  'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
  'POST /api/login': (req, res) => {
    const { password, username } = req.body;
    if (password === 'KKT' && username === 'KKT') {
      return res.json({
        updated_at: '2018/09/23 15:59:52',
        created_at: '2018/09/23 15:59:52',
        id: 1,
        username: 'admin',
        name: 'admin',
        admin: true,
        bio: '',
        location: '',
        organization: '',
        preferred_language: '',
        email: 'admin@admin.com',
        public_email: null,
        avatar: '',
        linkedin: '',
        web_url: null,
        skype: '',
        state: 'active',
        token: '5c2d6d45-ec94-319c-a9c8-cae43e192b65',
      });
    }
    return res.status(401).json({
      error: 'bad username/password, access denied',
    });
  },
  'GET /api/user/verify': (req, res) => {
    return res.json({
      updated_at: '2018/09/23 15:59:52',
      created_at: '2018/09/23 15:59:52',
      id: 1,
      username: 'admin',
      name: 'admin',
      admin: true,
      bio: '',
      location: '',
      organization: '',
      preferred_language: '',
      email: 'admin@admin.com',
      public_email: null,
      avatar: '',
      linkedin: '',
      web_url: null,
      skype: '',
      state: 'active',
      token: '5c2d6d45-ec94-319c-a9c8-cae43e192b65',
    });
  },
  'GET /api/user/list': [
    { id: 1, username: 'kenny', sex: 6 },
    { id: 2, username: 'kenny', sex: 6 },
  ],
};

module.exports = proxy;
