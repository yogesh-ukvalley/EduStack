const Contact = require('../models/Contact');

// POST /api/contact - Create a new contact submission
const createContact = async (req, res) => {
  try {
    const { name, email, mobileNo, courses } = req.body;

    // Validate required fields
    if (!name || !email || !mobileNo || !courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, mobileNo, courses'
      });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      mobileNo,
      courses
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// GET /api/admin/contacts - Get all contact submissions
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email role');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// PATCH /api/admin/contacts/:id/status - Update lead status
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, statusNote, followUpDate } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Update status
    if (status) {
      const validStatuses = [
        'New Lead', 'Connected', 'Interested',
        'Follow-up Required', 'Follow-up Set', 'Qualified', 'Not Interested', 'Other'
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      contact.status = status;
    }

    // Update status note (for "Other" status or general notes)
    if (statusNote !== undefined) {
      contact.statusNote = statusNote;
    }

    // Update follow-up date
    if (followUpDate !== undefined) {
      contact.followUpDate = followUpDate || null;
    }

    contact.updatedAt = Date.now();

    await contact.save();

    const updatedContact = await Contact.findById(contact._id)
      .populate('assignedTo', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: updatedContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// GET /api/admin/contacts/follow-ups - Get contacts with follow-up dates
const getFollowUps = async (req, res) => {
  try {
    const { date } = req.query;

    let query = { followUpDate: { $exists: true, $ne: null } };

    // Filter by specific date (today) if provided
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.followUpDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const contacts = await Contact.find(query)
      .sort({ followUpDate: 1 })
      .populate('assignedTo', 'name email role');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
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
  createContact,
  getAllContacts,
  updateContactStatus,
  getFollowUps
};