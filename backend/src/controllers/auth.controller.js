const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Mock users database (replace with actual database in production)
const users = [
  {
    id: '1',
    email: 'operator@demo.com',
    password: bcrypt.hashSync('demo123', 10),
    name: 'Alex Operator',
    role: 'operator',
    department: 'Operations',
    title: 'Operations Specialist',
    isVerified: true,
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    email: 'manager@demo.com',
    password: bcrypt.hashSync('demo123', 10),
    name: 'Sarah Manager',
    role: 'manager',
    department: 'Management',
    title: 'Team Manager',
    isVerified: true,
    createdAt: new Date('2024-01-10').toISOString()
  },
  {
    id: '3',
    email: 'director@demo.com',
    password: bcrypt.hashSync('demo123', 10),
    name: 'James Director',
    role: 'director',
    department: 'Executive',
    title: 'Director of Operations',
    isVerified: true,
    createdAt: new Date('2024-01-01').toISOString()
  }
];

// Pending verifications store (replace with database in production)
const pendingVerifications = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '24h';

/**
 * Generate verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Send verification email (mock implementation)
 * In production, use nodemailer, SendGrid, or similar
 */
const sendVerificationEmail = async (email, token, name) => {
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?token=${token}&email=${encodeURIComponent(email)}`;
  
  console.log('='.repeat(60));
  console.log('📧 VERIFICATION EMAIL (Mock)');
  console.log('='.repeat(60));
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your FlowDash account`);
  console.log(`\nHello ${name},\n`);
  console.log('Welcome to FlowDash! Please verify your email address by clicking the link below:\n');
  console.log(`🔗 ${verificationLink}\n`);
  console.log('This link will expire in 24 hours.');
  console.log('='.repeat(60));
  
  return true;
};

/**
 * User Registration/Signup
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = users.find(u => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: normalizedEmail,
      password: hashedPassword,
      name: name.trim(),
      role: 'operator', // Default role for new users
      department: 'General',
      title: 'Team Member',
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    // Store pending verification
    pendingVerifications.set(normalizedEmail, {
      token: verificationToken,
      expiry: tokenExpiry,
      userId: newUser.id
    });

    // Add user to mock database
    users.push(newUser);

    // Send verification email
    await sendVerificationEmail(normalizedEmail, verificationToken, name.trim());

    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      requiresVerification: true
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * Email Verification
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;

    // Validate input
    if (!email || !token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and token are required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check pending verification
    const pending = pendingVerifications.get(normalizedEmail);
    if (!pending) {
      return res.status(400).json({ 
        success: false, 
        message: 'Verification link is invalid or has expired' 
      });
    }

    // Validate token
    if (pending.token !== token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification token' 
      });
    }

    // Check expiry
    if (Date.now() > pending.expiry) {
      pendingVerifications.delete(normalizedEmail);
      return res.status(400).json({ 
        success: false, 
        message: 'Verification link has expired. Please sign up again.' 
      });
    }

    // Mark user as verified
    const user = users.find(u => u.email === normalizedEmail);
    if (user) {
      user.isVerified = true;
    }

    // Remove pending verification
    pendingVerifications.delete(normalizedEmail);

    res.json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * Resend verification email
 */
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email === normalizedEmail);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already verified' 
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    pendingVerifications.set(normalizedEmail, {
      token: verificationToken,
      expiry: tokenExpiry,
      userId: user.id
    });

    // Send verification email
    await sendVerificationEmail(normalizedEmail, verificationToken, user.name);

    res.json({
      success: true,
      message: 'Verification email sent! Please check your inbox.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * User Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'No account found with this email' 
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before logging in',
        requiresVerification: true
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (exclude password)
    const { password: _, ...userData } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * User Logout
 */
exports.logout = (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};

/**
 * Get current user
 */
exports.getMe = (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  const { password: _, ...userData } = user;
  res.json({ 
    success: true, 
    user: userData 
  });
};

/**
 * Verify session
 */
exports.verifySession = (req, res) => {
  res.json({ 
    success: true, 
    message: 'Session is valid',
    user: req.user 
  });
};

/**
 * Request password reset
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email === normalizedEmail);

    if (!user) {
      // For security, don't reveal if email exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a reset link.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    // Store reset token (in production, store in database)
    pendingVerifications.set(`reset_${normalizedEmail}`, {
      token: resetToken,
      expiry: tokenExpiry,
      userId: user.id
    });

    // Send password reset email (mock)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;
    
    console.log('='.repeat(60));
    console.log('📧 PASSWORD RESET EMAIL (Mock)');
    console.log('='.repeat(60));
    console.log(`To: ${normalizedEmail}`);
    console.log(`Subject: Reset your FlowDash password`);
    console.log(`\nHello ${user.name},\n`);
    console.log('You requested to reset your password. Click the link below:\n');
    console.log(`🔗 ${resetLink}\n`);
    console.log('This link will expire in 1 hour.');
    console.log('If you did not request this, please ignore this email.');
    console.log('='.repeat(60));

    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a reset link.'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * Validate password reset token
 */
exports.validateResetToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and token are required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const pending = pendingVerifications.get(`reset_${normalizedEmail}`);

    if (!pending) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset link' 
      });
    }

    if (pending.token !== token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset token' 
      });
    }

    if (Date.now() > pending.expiry) {
      pendingVerifications.delete(`reset_${normalizedEmail}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Reset link has expired' 
      });
    }

    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Validate reset token error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * Reset password with token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, token and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const pending = pendingVerifications.get(`reset_${normalizedEmail}`);

    if (!pending) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset link' 
      });
    }

    if (pending.token !== token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset token' 
      });
    }

    if (Date.now() > pending.expiry) {
      pendingVerifications.delete(`reset_${normalizedEmail}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Reset link has expired' 
      });
    }

    // Update user password
    const user = users.find(u => u.email === normalizedEmail);
    if (user) {
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // Remove used token
    pendingVerifications.delete(`reset_${normalizedEmail}`);

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
