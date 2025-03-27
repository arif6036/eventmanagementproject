import html2pdf from "html2pdf.js";

export const downloadTicketPDF = (ticket, qrCodeUrl) => {
  const element = document.createElement("div");
  element.innerHTML = `
    <div style="
      padding: 30px;
      font-family: 'Segoe UI', sans-serif;
      max-width: 600px;
      margin: auto;
      border: 1px solid #dee2e6;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    ">
      <div style="background-color: #198754; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; color: white;">
        <h2 style="margin: 0;">🎟️ Event Ticket</h2>
      </div>

      <div style="padding: 20px;">
        <p><strong style="color:#343a40;">Ticket ID:</strong> ${ticket._id}</p>
        <p><strong style="color:#343a40;">Event:</strong> ${ticket.event?.title || "Untitled"}</p>
        <p><strong style="color:#343a40;">Date:</strong> ${new Date(ticket.event?.date).toDateString()}</p>
        <p><strong style="color:#343a40;">Venue:</strong> ${ticket.event?.venue}</p>
        <hr/>
        <p><strong style="color:#343a40;">User:</strong> ${ticket.user?.name || "Guest"}</p>
        <p><strong style="color:#343a40;">Email:</strong> ${ticket.user?.email || "-"}</p>
        <hr/>
        <p><strong style="color:#343a40;">Type:</strong> ${ticket.ticketType}</p>
        <p><strong style="color:#343a40;">Price:</strong> $${ticket.price}</p>

        <div style="text-align: center; margin-top: 25px;">
          <img src="${qrCodeUrl}" alt="QR Code" width="160" height="160" style="border: 1px solid #ccc; padding: 5px; background: #f8f9fa; border-radius: 6px;" />
          <p style="margin-top: 10px; color: #6c757d;">Scan this QR code at the event entrance.</p>
        </div>
      </div>
    </div>
  `;

  const opt = {
    margin: 0.5,
    filename: `Ticket_${ticket._id}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
};
