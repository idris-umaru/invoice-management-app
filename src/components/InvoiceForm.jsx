import { useEffect, useState } from "react";
import {
  cloneInvoiceData,
  formatCurrency,
  generateInvoiceId,
  normalizeInvoice,
  paymentTermOptions,
  validateInvoice,
} from "../utils/invoice";

export default function InvoiceForm({ mode, initialInvoice, existingIds, onClose, onSubmit }) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setInvoice(initialInvoice);
    setErrors({});
  }, [initialInvoice]);

  function updateField(path, value) {
    setInvoice((current) => {
      const next = cloneInvoiceData(current);
      const parts = path.split(".");
      let target = next;

      while (parts.length > 1) {
        target = target[parts.shift()];
      }

      target[parts[0]] = value;
      return next;
    });
  }

  function updateItem(index, key, value) {
    setInvoice((current) => {
      const next = cloneInvoiceData(current);
      next.items[index][key] = value;
      return next;
    });
  }

  function addItem() {
    setInvoice((current) => ({
      ...current,
      items: [...current.items, { id: `item-${Date.now()}`, name: "", quantity: 1, price: 0 }],
    }));
  }

  function removeItem(index) {
    setInvoice((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleSubmit(nextStatus) {
    const draftInvoice = {
      ...invoice,
      status: nextStatus,
      id: invoice.id || generateInvoiceId(existingIds),
    };

    if (nextStatus !== "draft") {
      const validationErrors = validateInvoice(draftInvoice);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length) return;
    }

    setErrors({});
    onSubmit(normalizeInvoice(draftInvoice));
  }

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="form-drawer"
        aria-label={mode === "edit" ? `Edit invoice ${invoice.id}` : "New invoice"}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="form-drawer__back" onClick={onClose}>
          &lt;- Go back
        </button>
        <h2>{mode === "edit" ? `Edit #${invoice.id}` : "New Invoice"}</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(mode === "edit" ? invoice.status : "pending");
          }}
        >
          <fieldset className="form-section">
            <legend>Bill From</legend>
            <div className="field">
              <label htmlFor="sender-street">Street Address</label>
              <input
                id="sender-street"
                value={invoice.senderAddress.street}
                onChange={(event) => updateField("senderAddress.street", event.target.value)}
                className={errors.senderStreet ? "input-error" : ""}
              />
              {errors.senderStreet && <small>{errors.senderStreet}</small>}
            </div>
            <div className="grid-three">
              <div className="field">
                <label htmlFor="sender-city">City</label>
                <input
                  id="sender-city"
                  value={invoice.senderAddress.city}
                  onChange={(event) => updateField("senderAddress.city", event.target.value)}
                  className={errors.senderCity ? "input-error" : ""}
                />
                {errors.senderCity && <small>{errors.senderCity}</small>}
              </div>
              <div className="field">
                <label htmlFor="sender-postcode">Post Code</label>
                <input
                  id="sender-postcode"
                  value={invoice.senderAddress.postCode}
                  onChange={(event) => updateField("senderAddress.postCode", event.target.value)}
                  className={errors.senderPostCode ? "input-error" : ""}
                />
                {errors.senderPostCode && <small>{errors.senderPostCode}</small>}
              </div>
              <div className="field">
                <label htmlFor="sender-country">Country</label>
                <input
                  id="sender-country"
                  value={invoice.senderAddress.country}
                  onChange={(event) => updateField("senderAddress.country", event.target.value)}
                  className={errors.senderCountry ? "input-error" : ""}
                />
                {errors.senderCountry && <small>{errors.senderCountry}</small>}
              </div>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Bill To</legend>
            <div className="field">
              <label htmlFor="client-name">Client's Name</label>
              <input
                id="client-name"
                value={invoice.clientName}
                onChange={(event) => updateField("clientName", event.target.value)}
                className={errors.clientName ? "input-error" : ""}
              />
              {errors.clientName && <small>{errors.clientName}</small>}
            </div>
            <div className="field">
              <label htmlFor="client-email">Client's Email</label>
              <input
                id="client-email"
                type="email"
                value={invoice.clientEmail}
                onChange={(event) => updateField("clientEmail", event.target.value)}
                className={errors.clientEmail ? "input-error" : ""}
              />
              {errors.clientEmail && <small>{errors.clientEmail}</small>}
            </div>
            <div className="field">
              <label htmlFor="client-street">Street Address</label>
              <input
                id="client-street"
                value={invoice.clientAddress.street}
                onChange={(event) => updateField("clientAddress.street", event.target.value)}
                className={errors.clientStreet ? "input-error" : ""}
              />
              {errors.clientStreet && <small>{errors.clientStreet}</small>}
            </div>
            <div className="grid-three">
              <div className="field">
                <label htmlFor="client-city">City</label>
                <input
                  id="client-city"
                  value={invoice.clientAddress.city}
                  onChange={(event) => updateField("clientAddress.city", event.target.value)}
                  className={errors.clientCity ? "input-error" : ""}
                />
                {errors.clientCity && <small>{errors.clientCity}</small>}
              </div>
              <div className="field">
                <label htmlFor="client-postcode">Post Code</label>
                <input
                  id="client-postcode"
                  value={invoice.clientAddress.postCode}
                  onChange={(event) => updateField("clientAddress.postCode", event.target.value)}
                  className={errors.clientPostCode ? "input-error" : ""}
                />
                {errors.clientPostCode && <small>{errors.clientPostCode}</small>}
              </div>
              <div className="field">
                <label htmlFor="client-country">Country</label>
                <input
                  id="client-country"
                  value={invoice.clientAddress.country}
                  onChange={(event) => updateField("clientAddress.country", event.target.value)}
                  className={errors.clientCountry ? "input-error" : ""}
                />
                {errors.clientCountry && <small>{errors.clientCountry}</small>}
              </div>
            </div>

            <div className="grid-two">
              <div className="field">
                <label htmlFor="created-at">Invoice Date</label>
                <input
                  id="created-at"
                  type="date"
                  value={invoice.createdAt}
                  onChange={(event) => updateField("createdAt", event.target.value)}
                  className={errors.createdAt ? "input-error" : ""}
                />
                {errors.createdAt && <small>{errors.createdAt}</small>}
              </div>
              <div className="field">
                <label htmlFor="payment-terms">Payment Terms</label>
                <select
                  id="payment-terms"
                  value={invoice.paymentTerms}
                  onChange={(event) => updateField("paymentTerms", Number(event.target.value))}
                >
                  {paymentTermOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="description">Project Description</label>
              <input
                id="description"
                value={invoice.description}
                onChange={(event) => updateField("description", event.target.value)}
                className={errors.description ? "input-error" : ""}
              />
              {errors.description && <small>{errors.description}</small>}
            </div>
          </fieldset>

          <section className="form-section">
            <h3>Item List</h3>
            {errors.items && <small className="error-banner">{errors.items}</small>}

            {invoice.items.map((item, index) => (
              <div className="item-row" key={item.id}>
                <div className="field item-row__name">
                  <label htmlFor={`item-name-${index}`}>Item Name</label>
                  <input
                    id={`item-name-${index}`}
                    value={item.name}
                    onChange={(event) => updateItem(index, "name", event.target.value)}
                    className={errors[`itemName-${index}`] ? "input-error" : ""}
                  />
                  {errors[`itemName-${index}`] && <small>{errors[`itemName-${index}`]}</small>}
                </div>
                <div className="field">
                  <label htmlFor={`item-qty-${index}`}>Qty.</label>
                  <input
                    id={`item-qty-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, "quantity", event.target.value)}
                    className={errors[`itemQuantity-${index}`] ? "input-error" : ""}
                  />
                  {errors[`itemQuantity-${index}`] && (
                    <small>{errors[`itemQuantity-${index}`]}</small>
                  )}
                </div>
                <div className="field">
                  <label htmlFor={`item-price-${index}`}>Price</label>
                  <input
                    id={`item-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(event) => updateItem(index, "price", event.target.value)}
                    className={errors[`itemPrice-${index}`] ? "input-error" : ""}
                  />
                  {errors[`itemPrice-${index}`] && <small>{errors[`itemPrice-${index}`]}</small>}
                </div>
                <div className="field">
                  <label>Total</label>
                  <div className="item-row__total">
                    {formatCurrency(Number(item.quantity || 0) * Number(item.price || 0))}
                  </div>
                </div>
                <button
                  type="button"
                  className="item-row__delete"
                  aria-label={`Delete ${item.name || `item ${index + 1}`}`}
                  onClick={() => removeItem(index)}
                >
                  x
                </button>
              </div>
            ))}

            <button type="button" className="button button--secondary button--full" onClick={addItem}>
              + Add New Item
            </button>
          </section>

          <div className="form-actions">
            <button type="button" className="button button--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="button button--muted" onClick={() => handleSubmit("draft")}>
              Save as Draft
            </button>
            <button type="submit" className="button button--primary">
              {mode === "edit" ? "Save Changes" : "Save & Send"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
