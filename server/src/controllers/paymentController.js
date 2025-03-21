const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Ticket = require("../models/ticketModel");
const Event = require("../models/eventModel");

// ✅ Initiate Stripe Payment
const initiatePayment = async (req, res) => {
  try {
    const { eventId, amount, userId, quantity } = req.body;

    if (!eventId || !amount || !userId || !quantity) {
      return res.status(400).json({ message: "Missing required payment details." });
    }

    // ✅ Verify Event Exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // ✅ Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires amount in cents
      currency: "usd",
      metadata: { userId, eventId, quantity },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ message: "Payment initiation failed.", error: error.message });
  }
};


// ✅ Confirm Booking After Payment Success
const confirmBooking = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { ticketType, price, quantity } = req.body;
    const userId = req.user?.id;

    console.log("Confirm Booking Request:", {
      eventId,
      userId,
      ticketType,
      price,
      quantity,
    });
console.log("Confirm Booking Request:")
    if (!userId) {
      return res.status(400).json({ message: "User authentication failed. Please login again." });
    }

    const ticket = new Ticket({
      event: eventId,
      user: userId,
      ticketType,
      price,
      quantity: quantity || 1,
    });

    await ticket.save();
    return res.status(201).json({ message: "Ticket booked successfully!", ticket });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const initiateStripeCheckout = async (req, res) => {
  const { amount, eventId, userId, quantity } = req.body;

  try {
    if (!amount || !eventId || !userId || !quantity) {
      return res.status(400).json({ success: false, message: "Missing payment data" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Event Ticket for ${eventId}`,
            },
            unit_amount: amount * 100,
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/my-tickets?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/events/${eventId}/book`,
      metadata: {
        eventId,
        userId,
      },
    });

    res.status(200).json({ success: true, paymentUrl: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error.message);
    res.status(500).json({ success: false, message: "Stripe Checkout failed", error: error.message });
  }
};




module.exports = { initiatePayment, confirmBooking, initiateStripeCheckout };
