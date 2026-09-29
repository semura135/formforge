function PropertiesPanel({ selectedField, onUpdateField }) {
  if (!selectedField) {
    return <p>Select a field</p>;
  }
  return (
    <>
      <p>Selected field: {selectedField.label}</p>
      <label>Label</label>
      <input
        value={selectedField.label}
        onChange={(event) =>
          onUpdateField(selectedField.id, { label: event.target.value })
        }
      />
      <label>Placeholder</label>
      <input
        value={selectedField.placeholder}
        onChange={(event) =>
          onUpdateField(selectedField.id, { placeholder: event.target.value })
        }
      />
      <label>
        <input
          type="checkbox"
          checked={selectedField.required}
          onChange={(event) =>
            onUpdateField(selectedField.id, { required: event.target.checked })
          }
        />
        Required
      </label>
    </>
  );
}

export default PropertiesPanel;
