const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(async () => {
  // Update or create admin user
  const hashedPassword = await bcrypt.hash('SecureAdmin123!', 10);
  const adminUser = await User.findOne({ where: { role: 'admin' } });
  if (adminUser) {
    await adminUser.update({ username: 'administrator', password: hashedPassword });
    console.log('Admin user updated to: username: administrator, password: SecureAdmin123!');
  } else {
    await User.create({
      username: 'administrator',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Default admin user created: username: administrator, password: SecureAdmin123!');
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
