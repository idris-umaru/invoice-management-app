import { calculateInvoiceTotal, formatCurrency, formatDate } from "../utils/invoice";
import StatusBadge from "./StatusBadge";

export default function InvoiceDetails({
  invoice,
  onEdit,
  onDelete,
  onMarkPaid,
  onBack,
}) {
  if (!invoice) {
    return (
      <section className="details-panel details-panel--placeholder">
        <p>Select an invoice to view its full details.</p>
      </section>
    );
  }

  const total = calculateInvoiceTotal(invoice.items);

  return (
    <section className="details-panel details-panel--page">
      <div className="details-top">
        <button type="button" className="details-back" onClick={onBack}>
          <span className="details-back__arrow" aria-hidden="true">
            &lt;
          </span>
          <span>Go back</span>
        </button>
      </div>

      <div className="details-toolbar">
        <div className="details-status">
          <span className="details-status__label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="details-toolbar__actions">
          <button
            type="button"
            className="button button--ghost details-action"
            onClick={() => onEdit(invoice)}
          >
            Edit
          </button>
          <button
            type="button"
            className="button button--danger details-action"
            onClick={() => onDelete(invoice)}
          >
            Delete
          </button>
          <button
            type="button"
            className="button button--primary details-action details-action--wide"
            onClick={() => onMarkPaid(invoice.id)}
            disabled={invoice.status !== "pending"}
          >
            Mark as Paid
          </button>
        </div>
      </div>

      <article className="invoice-sheet" aria-label={`Invoice ${invoice.id} details`}>
        <header className="invoice-sheet__header">
          <div>
            <h2>
              <span>#</span>
              {invoice.id}
            </h2>
            <p>{invoice.description}</p>
          </div>
          <address>
            <span>{invoice.senderAddress.street}</span>
            <span>{invoice.senderAddress.city}</span>
            <span>{invoice.senderAddress.postCode}</span>
            <span>{invoice.senderAddress.country}</span>
          </address>
        </header>

        <div className="invoice-sheet__meta">
          <div>
            <span>Invoice Date</span>
            <strong>{formatDate(invoice.createdAt)}</strong>
            <span>Payment Due</span>
            <strong>{formatDate(invoice.paymentDue)}</strong>
          </div>
          <div>
            <span>Bill To</span>
            <strong>{invoice.clientName}</strong>
            <address>
              <span>{invoice.clientAddress.street}</span>
              <span>{invoice.clientAddress.city}</span>
              <span>{invoice.clientAddress.postCode}</span>
              <span>{invoice.clientAddress.country}</span>
            </address>
          </div>
          <div>
            <span>Sent to</span>
            <strong>{invoice.clientEmail}</strong>
          </div>
        </div>

        <div className="invoice-sheet__items">
          <div className="invoice-sheet__items-head">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>
          {invoice.items.map((item) => (
            <div className="invoice-sheet__item" key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.quantity}</span>
              <span>{formatCurrency(item.price)}</span>
              <strong>{formatCurrency(item.quantity * item.price)}</strong>
            </div>
          ))}
          <div className="invoice-sheet__grand-total">
            <span>Grand Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
      </article>
    </section>
  );
}
