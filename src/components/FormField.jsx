function FormField({
  field,
  onSelect,
  onDelete,
  onMove,
  value,
  onChange,
  preview = false,
}) {
  return (
    <div
      className={preview ? "field-content preview-content" : "field-content"}
      onClick={() => onSelect(field.id)}
    >
      <div className="field-main">
        <label className="field-label">{field.label}:</label>

        {field.type === "textarea" && (
          <textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(event) => onChange?.(field.id, event.target.value)}
          />
        )}

        {field.type === "select" && (
          <select
            value={value || ""}
            onChange={(event) => onChange?.(field.id, event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        )}

        {field.type === "checkbox" && (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(event) => onChange?.(field.id, event.target.checked)}
          />
        )}

        {["text", "email", "number"].includes(field.type) && (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(event) => onChange?.(field.id, event.target.value)}
          />
        )}
      </div>

      {!preview && (
        <div className="field-actions">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onDelete(field.id);
            }}
          >
            Delete
          </button>

          <button onClick={() => onMove(field.id, -1)}>↑</button>

          <button onClick={() => onMove(field.id, 1)}>↓</button>
        </div>
      )}
    </div>
  );
}

export default FormField;
