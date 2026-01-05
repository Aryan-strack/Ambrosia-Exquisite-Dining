const Reservation = require('../models/Reservation');
const User = require('../models/User');

exports.createReservation = async (req, res, next) => {
  try {
    const { reservationDate, partySize, tableNumber, specialRequests, contactPhone, duration } = req.body;

    // Check if table is already reserved for the same time
    const existingReservation = await Reservation.findOne({
      tableNumber,
      reservationDate: {
        $gte: new Date(new Date(reservationDate).getTime() - (duration || 90) * 60000),
        $lte: new Date(new Date(reservationDate).getTime() + (duration || 90) * 60000)
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'Table is already reserved for this time slot'
      });
    }

    const reservation = await Reservation.create({
      customer: req.user.id,
      reservationDate,
      partySize,
      tableNumber,
      specialRequests,
      contactPhone,
      duration
    });

    await reservation.populate('customer', 'name email');

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

exports.getReservations = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }

    const { status, date, page = 1, limit = 10 } = req.query;
    
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      query.reservationDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const reservations = await Reservation.find(query)
      .populate('customer', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ reservationDate: 1 });

    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      count: reservations.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

exports.getReservation = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };
    
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }

    const reservation = await Reservation.findOne(query)
      .populate('customer', 'name email phone address');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const { status, tableNumber, reservationDate } = req.body;
    
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (tableNumber) updateData.tableNumber = tableNumber;
    if (reservationDate) updateData.reservationDate = reservationDate;

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('customer', 'name email phone');

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      customer: req.user.id
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (reservation.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed reservation'
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

exports.getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { date, partySize } = req.query;
    
    if (!date || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'Date and party size are required'
      });
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    // Get all reservations for the day
    const reservations = await Reservation.find({
      reservationDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate available time slots (every 30 minutes from 10 AM to 10 PM)
    const timeSlots = [];
    const startTime = new Date(selectedDate);
    startTime.setHours(10, 0, 0, 0);
    const endTime = new Date(selectedDate);
    endTime.setHours(22, 0, 0, 0);

    const totalTables = 20; // Assuming 20 tables in the restaurant
    const tablesPerPartySize = Math.ceil(partySize / 4); // Assuming 4 people per table

    while (startTime < endTime) {
      const slotTime = new Date(startTime);
      const slotEndTime = new Date(slotTime.getTime() + 90 * 60000); // 90 minutes slot

      // Count reserved tables for this time slot
      const reservedTables = reservations.filter(reservation => {
        const resStart = new Date(reservation.reservationDate);
        const resEnd = new Date(resStart.getTime() + (reservation.duration || 90) * 60000);
        return resStart < slotEndTime && resEnd > slotTime;
      }).length;

      const availableTables = totalTables - reservedTables;

      if (availableTables >= tablesPerPartySize) {
        timeSlots.push({
          time: new Date(slotTime),
          available: true,
          availableTables
        });
      } else {
        timeSlots.push({
          time: new Date(slotTime),
          available: false,
          availableTables
        });
      }

      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    res.json({
      success: true,
      data: timeSlots
    });
  } catch (error) {
    next(error);
  }
};