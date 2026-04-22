const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

export const paymentTermOptions = [
  { label: "Net 1 Day", value: 1 },
  { label: "Net 7 Days", value: 7 },
  { label: "Net 14 Days", value: 14 },
  { label: "Net 30 Days", value: 30 },
];

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

export function cloneInvoiceData(value) {
  return JSON.parse(JSON.stringify(value));
}

export function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function generateInvoiceId(existingIds = []) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let nextId = "";

  do {
    nextId =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)] +
      Math.floor(1000 + Math.random() * 9000);
  } while (existingIds.includes(nextId));

  return nextId;
}

export function calculatePaymentDue(createdAt, paymentTerms) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  date.setDate(date.getDate() + Number(paymentTerms || 0));
  return date.toISOString().slice(0, 10);
}

export function calculateInvoiceTotal(items = []) {
  return items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );
}

export function normalizeInvoice(invoice) {
  return {
    ...invoice,
    paymentTerms: Number(invoice.paymentTerms),
    paymentDue: calculatePaymentDue(invoice.createdAt, invoice.paymentTerms),
    items: invoice.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
    })),
  };
}

export function getEmptyInvoice() {
  return {
    id: "",
    createdAt: new Date().toISOString().slice(0, 10),
    paymentDue: "",
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "pending",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [
      {
        id: `item-${Date.now()}`,
        name: "",
        quantity: 1,
        price: 0,
      },
    ],
  };
}

export function validateInvoice(invoice) {
  const errors = {};

  if (!invoice.senderAddress.street.trim()) errors.senderStreet = "Required";
  if (!invoice.senderAddress.city.trim()) errors.senderCity = "Required";
  if (!invoice.senderAddress.postCode.trim()) errors.senderPostCode = "Required";
  if (!invoice.senderAddress.country.trim()) errors.senderCountry = "Required";
  if (!invoice.clientName.trim()) errors.clientName = "Client name is required";
  if (!invoice.clientEmail.trim()) {
    errors.clientEmail = "Client email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoice.clientEmail)) {
    errors.clientEmail = "Enter a valid email address";
  }
  if (!invoice.clientAddress.street.trim()) errors.clientStreet = "Required";
  if (!invoice.clientAddress.city.trim()) errors.clientCity = "Required";
  if (!invoice.clientAddress.postCode.trim()) errors.clientPostCode = "Required";
  if (!invoice.clientAddress.country.trim()) errors.clientCountry = "Required";
  if (!invoice.createdAt) errors.createdAt = "Invoice date is required";
  if (!invoice.description.trim()) errors.description = "Project description is required";

  if (!invoice.items.length) {
    errors.items = "At least one invoice item is required";
  }

  invoice.items.forEach((item, index) => {
    if (!item.name.trim()) errors[`itemName-${index}`] = "Required";
    if (Number(item.quantity) <= 0) {
      errors[`itemQuantity-${index}`] = "Must be greater than 0";
    }
    if (Number(item.price) <= 0) {
      errors[`itemPrice-${index}`] = "Must be greater than 0";
    }
  });

  return errors;
}
