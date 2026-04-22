export default function Sidebar({ theme, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand" aria-label="Invoice app logo">
        <div className="sidebar__brand-shape" />
      </div>
      <div className="sidebar__bottom">
        <button
          className="icon-button"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span
            className={`theme-icon theme-icon--${theme === "dark" ? "sun" : "moon"}`}
            aria-hidden="true"
          />
        </button>
        <div className="avatar" aria-hidden="true">
          IA
        </div>
      </div>
    </aside>
  );
}
