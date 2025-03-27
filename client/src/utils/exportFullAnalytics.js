import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportFullAnalyticsToExcel = (data) => {
  const { users, events, tickets } = data;

  const userSheet = users.map((u, i) => ({
    "#": i + 1,
    Name: u.name,
    Email: u.email,
    Role: u.role,
    Registered: new Date(u.createdAt).toLocaleDateString(),
  }));

  const eventSheet = events.map((e, i) => ({
    "#": i + 1,
    Title: e.title,
    Date: new Date(e.date).toLocaleDateString(),
    Time: e.time,
    Venue: e.venue,
    Created: new Date(e.createdAt).toLocaleDateString(),
  }));

  const ticketSheet = tickets.map((t, i) => ({
    "#": i + 1,
    "Event": t.event?.title || "Unknown",
    "User": t.user?.name || "Guest",
    "Type": t.ticketType,
    "Price": t.price,
    "Date Booked": new Date(t.createdAt).toLocaleDateString(),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(userSheet), "Users");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(eventSheet), "Events");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ticketSheet), "Tickets");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Full_Analytics_${new Date().toISOString().split("T")[0]}.xlsx`);
};
