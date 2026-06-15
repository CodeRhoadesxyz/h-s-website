const bcrypt = require('bcryptjs');

async function testAuth() {
  const password = '262321';
  console.log('Testing password:', password);
  
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Is valid:', isValid);
  
  const isInvalid = await bcrypt.compare('wrongpassword', hash);
  console.log('Is invalid (wrong password):', !isInvalid);
}

testAuth();
