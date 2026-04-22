import Modal from "./Modal";

export default function ConfirmModal({ invoice, onCancel, onConfirm }) {
  return (
    <Modal title="Confirm Deletion" onClose={onCancel}>
      <p>
        Are you sure you want to delete invoice #{invoice.id}? This action cannot be undone.
      </p>
      <div className="modal__actions">
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="button button--danger" onClick={() => onConfirm(invoice.id)}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
