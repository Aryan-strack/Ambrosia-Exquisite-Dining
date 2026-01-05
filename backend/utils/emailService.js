const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderConfirmation = async (user, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h2>Order Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Your order has been confirmed!</p>
      <h3>Order Details:</h3>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p>Thank you for choosing our restaurant!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

exports.sendReservationConfirmation = async (user, reservation) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Reservation Confirmation',
    html: `
      <h2>Reservation Confirmed</h2>
      <p>Dear ${user.name},</p>
      <p>Your reservation has been confirmed!</p>
      <h3>Reservation Details:</h3>
      <p><strong>Date:</strong> ${reservation.reservationDate}</p>
      <p><strong>Party Size:</strong> ${reservation.partySize}</p>
      <p><strong>Table Number:</strong> ${reservation.tableNumber}</p>
      <p>We look forward to serving you!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};
