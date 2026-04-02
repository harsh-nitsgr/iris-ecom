const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (name, password, addresses)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update name
    if (req.body.name) user.name = req.body.name;

    // Update password
    if (req.body.password) user.password = req.body.password;

    // Add a new address
    if (req.body.addAddress) {
      user.addresses.push(req.body.addAddress);
      // If it's first address, make it default
      if (user.addresses.length === 1) {
        user.addresses[0].isDefault = true;
      }
    }

    // Delete an address by index
    if (req.body.deleteAddressIndex !== undefined) {
      user.addresses.splice(req.body.deleteAddressIndex, 1);
    }

    // Set default address by index
    if (req.body.setDefaultIndex !== undefined) {
      user.addresses.forEach((a, i) => {
        a.isDefault = i === req.body.setDefaultIndex;
      });
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      addresses: updated.addresses,
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request password reset email
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether the email exists
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    // Generate a random 32-byte hex token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash it before saving to DB (store hashed, send raw token in email)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px; background: #0a0a0a; color: #fff;">
        <h1 style="font-size: 28px; font-weight: 400; letter-spacing: 2px; margin-bottom: 8px;">IRIS</h1>
        <p style="color: #888; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px;">Password Reset</p>
        
        <p style="color: #ccc; line-height: 1.7; margin-bottom: 24px;">
          You requested a password reset. Click the button below to set a new password. 
          This link expires in <strong style="color: #fff;">30 minutes</strong>.
        </p>
        
        <a href="${resetUrl}" 
           style="display: inline-block; background: #fff; color: #000; padding: 14px 32px; 
                  text-decoration: none; font-size: 11px; letter-spacing: 3px; 
                  text-transform: uppercase; margin-bottom: 32px;">
          Reset Password
        </a>
        
        <p style="color: #555; font-size: 12px; line-height: 1.7; margin-top: 32px; border-top: 1px solid #222; padding-top: 24px;">
          If you didn't request this, you can safely ignore this email. Your password will not change.<br><br>
          Or copy this link: <span style="color: #888;">${resetUrl}</span>
        </p>
      </div>
    `;

    try {
      await sendEmail({ to: user.email, subject: 'Iris — Password Reset', html });
      res.json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch (emailError) {
      // If email fails, clear the token so they can try again
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Email error:', emailError.message);
      res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password using token
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
