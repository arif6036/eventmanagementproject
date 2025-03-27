import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ✅ Full Analytics Export using exceljs
export const exportAnalyticsToExcel = async (stats) => {
  const { totalUsers, totalEvents, totalTickets, totalRevenue, topEvents } = stats;

  const workbook = new ExcelJS.Workbook();

  // 📄 Sheet 1: Summary
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 25 },
    { header: "Value", key: "value", width: 30 },
  ];
  summarySheet.addRows([
    { metric: "Total Users", value: totalUsers },
    { metric: "Total Events", value: totalEvents },
    { metric: "Total Tickets", value: totalTickets },
    { metric: "Total Revenue", value: `$${totalRevenue.toFixed(2)}` },
  ]);

  // 📄 Sheet 2: Top Events
  const eventsSheet = workbook.addWorksheet("Top Events");
  eventsSheet.columns = [
    { header: "#", key: "index", width: 10 },
    { header: "Event Title", key: "title", width: 40 },
    { header: "Total Tickets", key: "tickets", width: 20 },
  ];

  topEvents.forEach((event, idx) => {
    eventsSheet.addRow({
      index: idx + 1,
      title: event.event?.title || "Untitled",
      tickets: event.totalTickets,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Event_Analytics_${new Date().toISOString().split("T")[0]}.xlsx`);
};

// ✅ Top Events Export Only
export const exportTopEventsToExcel = async (topEvents) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Top Events");

  sheet.columns = [
    { header: "#", key: "index", width: 10 },
    { header: "Event Title", key: "title", width: 40 },
    { header: "Total Tickets", key: "tickets", width: 20 },
  ];

  topEvents.forEach((event, idx) => {
    sheet.addRow({
      index: idx + 1,
      title: event.event?.title || "Untitled",
      tickets: event.totalTickets,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Top_Events_${new Date().toISOString().split("T")[0]}.xlsx`);
};
