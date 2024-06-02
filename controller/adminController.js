const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

const jwt = require('jsonwebtoken');
const verifyUser = require('../middlewares/token');

const secret = 'secret';

const updateAdminActive = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, secret);
    await Admin.findByIdAndUpdate(decoded.id, { lastActive: Date.now() });
    next();
  } catch (error) {
    next();
  }
};

router.use(updateAdminActive);

router.post('/adminRegister', async (req, res) => {
  try {
    const { userName, password,securityQuestion } = req.body;

    const existingAdmin = await Admin.findOne({ userName });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
    }
    
    const admin = new Admin({
      userName,
      password,
      securityQuestion
    });
    await admin.save();

    const token = jwt.sign({ id: admin._id }, secret, { expiresIn: '200h' });

    res.status(201).json({
      message: 'Admin kaydı başarılı.',
      admin: {
        id: admin._id,
        userName: admin.userName,
        securityQuestion:admin.securityQuestion
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/adminLogin', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const admin = await Admin.findOne({ userName });
    if (!admin) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre yanlış.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre yanlış.' });
    }

    const token = jwt.sign({ id: admin._id }, secret, { expiresIn: '200h' });

    res.status(200).json({
      message: 'Admin girişi başarılı.',
      admin: {
        id: admin._id,
        userName: admin.userName,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { userName, securityQuestion, newPassword } = req.body;

    const admin = await Admin.findOne({ userName });
    if (!admin) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (admin.securityQuestion !== securityQuestion) {
      return res.status(401).json({ message: 'Güvenlik sorusu cevabı yanlış.' });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/activeAdminCount', verifyUser, async (req, res) => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeAdminCount = await Admin.countDocuments({ lastActive: { $gte: fifteenMinutesAgo } });
    res.status(200).json({ activeAdminCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;