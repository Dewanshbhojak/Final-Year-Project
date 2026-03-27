const http = require('http');

const data = JSON.stringify({
  name: 'Test',
  email: 'testtest@example.com',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => { body += d; });
  res.on('end', () => {
    console.log('Register Response:', body);
    
    // Now test login
    const loginData = JSON.stringify({ email: 'testtest@example.com', password: 'password123' });
    const loginReq = http.request({ ...options, path: '/api/auth/login', headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length } }, res2 => {
      let body2 = '';
      res2.on('data', d => { body2 += d; });
      res2.on('end', () => {
        console.log('Login Response:', body2);
        const { token } = JSON.parse(body2);
        
        // Test protected route
        const protectedReq = http.request({
          hostname: 'localhost', port: 5000, path: '/api/protected', method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        }, res3 => {
          let body3 = '';
          res3.on('data', d => { body3 += d; });
          res3.on('end', () => {
            console.log('Protected Route Response:', body3);
          });
        });
        protectedReq.end();
      });
    });
    loginReq.write(loginData);
    loginReq.end();
  });
});

req.on('error', error => { console.error(error); });
req.write(data);
req.end();
