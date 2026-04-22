import { calculateInvoiceTotal, formatCurrency, formatDate } from "../utils/invoice";
import StatusBadge from "./StatusBadge";

function EmptyState() {
  return (
    <section className="empty-state" aria-live="polite">
      <div className="empty-state__illustration" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <h2>There is nothing here</h2>
      <p>Create an invoice by clicking the New Invoice button and get started.</p>
    </section>
  );
}

export default function InvoiceList({ invoices, selectedId, onSelect }) {
  if (!invoices.length) {
    return <EmptyState />;
  }

  return (
    <section className="invoice-list" aria-label="Invoice list">
      {invoices.map((invoice) => (
        <button
          key={invoice.id}
          type="button"
          className={`invoice-card ${selectedId === invoice.id ? "invoice-card--selected" : ""}`}
          onClick={() => onSelect(invoice.id)}
        >
          <strong className="invoice-card__id">
            <span>#</span>
            {invoice.id}
          </strong>
          <span className="invoice-card__due">Due {formatDate(invoice.paymentDue)}</span>
          <span className="invoice-card__client">{invoice.clientName || "No client"}</span>
          <strong className="invoice-card__total">
            {formatCurrency(calculateInvoiceTotal(invoice.items))}
          </strong>
          <StatusBadge status={invoice.status} />
          <span className="invoice-card__arrow" aria-hidden="true">
            &gt;
          </span>
        </button>
      ))}
    </section>
  );
}
