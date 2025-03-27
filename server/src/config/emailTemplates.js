const loginTemplate = (name) => `
  <h3>Login Alert</h3>
  <p>Hello ${name},</p>
  <p>You have successfully logged in to your EventEase account.</p>
`;

const ticketTemplate = (ticket) => `
  <h3>🎟️ Ticket Downloaded</h3>
  <p>Event: <strong>${ticket.event.title}</strong></p>
  <p>Date: ${new Date(ticket.event.date).toDateString()}</p>
`;

const paymentTemplate = (ticket) => `
  <h3>💰 Payment Confirmation</h3>
  <p>Amount: <strong>$${ticket.price}</strong></p>
  <p>Event: <strong>${ticket.event.title}</strong></p>
`;

module.exports = {
  loginTemplate,
  ticketTemplate,
  paymentTemplate,
};
