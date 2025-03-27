const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Ticket = require("../models/ticketModel");

const getDashboardStats = async (req, res) => {
  try {

    const { from, to } = req.query;

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const filterQuery = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const totalUsers = await User.countDocuments(filterQuery);
    const totalEvents = await Event.countDocuments(filterQuery);
    const totalTickets = await Ticket.countDocuments(filterQuery);
    const totalRevenue = await Ticket.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const topEvents = await Ticket.aggregate([
      { $group: { _id: "$event", totalTickets: { $sum: 1 } } },
      { $sort: { totalTickets: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalTickets,
      totalRevenue: totalRevenue[0]?.total || 0,
      topEvents,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
};

const getFullAnalyticsData = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    const events = await Event.find().select("title description date time venue createdAt");
    const tickets = await Ticket.find().populate("event").populate("user");

    res.json({
      users,
      events,
      tickets,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch full export data", error: error.message });
  }
};


module.exports = { getDashboardStats,getFullAnalyticsData };
