const statusOptions = ["all", "draft", "pending", "paid"];

export default function Header({
  count,
  filter,
  onFilterChange,
  onNewInvoice,
  mobileMenuOpen,
  onToggleMobileMenu,
}) {
  const filterLabel = filter === "all" ? "All invoices" : `${filter} invoices`;

  return (
    <div className="page-header">
      <div>
        <h1>Invoices</h1>
        <p>
          {count === 0
            ? "No invoices"
            : `There ${count === 1 ? "is" : "are"} ${count} ${filterLabel}`}
        </p>
      </div>

      <div className="page-header__actions">
        <div className={`filter ${mobileMenuOpen ? "filter--open" : ""}`}>
          <button
            type="button"
            className="filter__trigger"
            aria-haspopup="listbox"
            aria-expanded={mobileMenuOpen}
            onClick={onToggleMobileMenu}
          >
            <span>Filter</span>
            <strong>by status</strong>
          </button>
          <div className="filter__menu" role="listbox" aria-label="Invoice status filter">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter__option ${filter === option ? "filter__option--active" : ""}`}
                onClick={() => {
                  onFilterChange(option);
                  onToggleMobileMenu(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="button button--primary" onClick={onNewInvoice}>
          <span className="button__plus">+</span>
          <span className="button__label-desktop">New Invoice</span>
          <span className="button__label-mobile">New</span>
        </button>
      </div>
    </div>
  );
}
