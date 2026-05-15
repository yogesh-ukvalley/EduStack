const Admin = require('../models/Admin');

// GET /api/admin/staff - List all admin users (super-admin only)
const getStaff = async (req, res) => {
  try {
    const staff = await Admin.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// POST /api/admin/staff - Create a new staff user (super-admin only)
const createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Validate role
    const assignedRole = role || 'staff';
    if (!['super-admin', 'staff'].includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "super-admin" or "staff"'
      });
    }

    const staff = new Admin({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      isActive: true
    });

    await staff.save();

    // Return without password
    const staffData = staff.toJSON();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: staffData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// PUT /api/admin/staff/:id - Update a staff user (super-admin only)
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    // Prevent updating yourself to deactivate
    if (id === req.admin._id.toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot disable your own account'
      });
    }

    // Find the staff member
    const staff = await Admin.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing role of the last super-admin
    if (staff.role === 'super-admin' && role === 'staff') {
      const superAdminCount = await Admin.countDocuments({ role: 'super-admin', isActive: true });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change role. There must be at least one active super-admin.'
        });
      }
    }

    // Update fields
    if (name) staff.name = name;
    if (email) staff.email = email.toLowerCase();
    if (role) {
      if (!['super-admin', 'staff'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
      }
      staff.role = role;
    }
    if (typeof isActive === 'boolean') {
      // Prevent disabling the last active super-admin
      if (isActive === false && staff.role === 'super-admin') {
        const activeSuperAdmins = await Admin.countDocuments({ role: 'super-admin', isActive: true });
        if (activeSuperAdmins <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Cannot disable the last active super-admin'
          });
        }
      }
      staff.isActive = isActive;
    }

    await staff.save();

    const staffData = staff.toJSON();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: staffData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// DELETE /api/admin/staff/:id - Delete a staff user (super-admin only)
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const staff = await Admin.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the last super-admin
    if (staff.role === 'super-admin') {
      const superAdminCount = await Admin.countDocuments({ role: 'super-admin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last super-admin'
        });
      }
    }

    await Admin.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
};