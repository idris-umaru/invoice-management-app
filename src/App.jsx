import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "./components/ConfirmModal";
import Header from "./components/Header";
import InvoiceDetails from "./components/InvoiceDetails";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import Sidebar from "./components/Sidebar";
import { seedInvoices } from "./data/seed";
import useMediaQuery from "./hooks/useMediaQuery";
import { getEmptyInvoice } from "./utils/invoice";

const STORAGE_KEY = "invoice-app-data";
const THEME_KEY = "invoice-app-theme";

function getInitialTheme() {
  const storedTheme = window.localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialInvoices() {
  const storedInvoices = window.localStorage.getItem(STORAGE_KEY);
  if (!storedInvoices) return seedInvoices;

  try {
    return JSON.parse(storedInvoices);
  } catch {
    return seedInvoices;
  }
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [invoices, setInvoices] = useState(getInitialInvoices);
  const [selectedId, setSelectedId] = useState(() => getInitialInvoices()[0]?.id ?? null);
  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [formState, setFormState] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState("list");
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    if (!isMobile && currentPage === "detail" && !selectedId) {
      setCurrentPage("list");
    }
  }, [isMobile]);

  const filteredInvoices = useMemo(() => {
    if (filter === "all") return invoices;
    return invoices.filter((invoice) => invoice.status === filter);
  }, [filter, invoices]);

  const selectedInvoice = useMemo(
    () => invoices.find((invoice) => invoice.id === selectedId) ?? null,
    [invoices, selectedId]
  );

  useEffect(() => {
    if (!invoices.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedInvoice) {
      setSelectedId(invoices[0].id);
    }
  }, [invoices, selectedInvoice]);

  function handleSelectInvoice(id) {
    setSelectedId(id);
    setCurrentPage("detail");
  }

  function handleSaveInvoice(nextInvoice) {
    setInvoices((current) => {
      const exists = current.some((invoice) => invoice.id === nextInvoice.id);
      if (exists) {
        return current.map((invoice) => (invoice.id === nextInvoice.id ? nextInvoice : invoice));
      }
      return [nextInvoice, ...current];
    });
    setSelectedId(nextInvoice.id);
    setCurrentPage("detail");
    setFormState(null);
  }

  function handleDeleteInvoice(id) {
    setInvoices((current) => current.filter((invoice) => invoice.id !== id));
    setDeleteTarget(null);
    setCurrentPage("list");
  }

  function handleMarkPaid(id) {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id && invoice.status === "pending"
          ? { ...invoice, status: "paid" }
          : invoice
      )
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />

      <main className="app-main">
        {currentPage === "list" ? (
          <>
            <Header
              count={filteredInvoices.length}
              filter={filter}
              onFilterChange={setFilter}
              onNewInvoice={() =>
                setFormState({
                  mode: "create",
                  invoice: getEmptyInvoice(),
                })
              }
              mobileMenuOpen={filterOpen}
              onToggleMobileMenu={(next) =>
                setFilterOpen(typeof next === "boolean" ? next : !filterOpen)
              }
            />

            <div className="content-grid content-grid--list-page">
              <div className="list-column list-column--full">
                <InvoiceList
                  invoices={filteredInvoices}
                  selectedId={selectedId}
                  onSelect={handleSelectInvoice}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="detail-page">
            <InvoiceDetails
              invoice={selectedInvoice}
              onEdit={(invoice) => setFormState({ mode: "edit", invoice })}
              onDelete={setDeleteTarget}
              onMarkPaid={handleMarkPaid}
              onBack={() => setCurrentPage("list")}
            />
          </div>
        )}
      </main>

      {formState && (
        <InvoiceForm
          mode={formState.mode}
          initialInvoice={formState.invoice}
          existingIds={invoices.map((invoice) => invoice.id)}
          onClose={() => setFormState(null)}
          onSubmit={handleSaveInvoice}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          invoice={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteInvoice}
        />
      )}
    </div>
  );
}
