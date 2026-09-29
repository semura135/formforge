import "./App.css";
import { useEffect, useReducer, useState } from "react";
import fieldReducer from "./reducers/fieldReducer";
import FormField from "./components/FormField";
import PropertiesPanel from "./components/PropertiesPanel";

const initialState = {
  title: "Customer Feedback",
  description: "We'd love to hear your feedback.",
  fields: [
    {
      id: 1,
      type: "text",
      label: "Name",
      placeholder: "Enter your name",
      required: false,
    },
    {
      id: 2,
      type: "email",
      label: "Email",
      placeholder: "you@example.com",
      required: false,
    },
  ],
};

function getInitialState() {
  const savedForm = localStorage.getItem("formforge-form");

  return savedForm ? JSON.parse(savedForm) : initialState;
}

function App() {
  const [form, dispatch] = useReducer(fieldReducer, undefined, getInitialState);

  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem("formforge-form", JSON.stringify(form));
  }, [form]);

  function addField(type) {
    const field = {
      id: Date.now(),
      type: type,
      label: `New ${type} field`,
      placeholder: "Enter value",
      required: false,
      options: type === "select" ? ["Option 1", "Option 2"] : [],
    };

    dispatch({
      type: "ADD_FIELD",
      field: field,
    });
  }

  const selectedField = form.fields.find(
    (field) => field.id === selectedFieldId,
  );

  function updateField(id, updates) {
    dispatch({
      type: "UPDATE_FIELD",
      id: id,
      updates: updates,
    });
  }

  function deleteField(id) {
    dispatch({
      type: "DELETE_FIELD",
      id: id,
    });

    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  }

  function moveField(id, direction) {
    dispatch({
      type: "MOVE_FIELD",
      id: id,
      direction: direction,
    });
  }

  function updateForm(updates) {
    dispatch({
      type: "UPDATE_FORM",
      updates: updates,
    });
  }

  function handleAnswerChange(fieldId, value) {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldId]: "",
    }));
  }

  function handleSubmit() {
    const newErrors = {};

    form.fields.forEach((field) => {
      const value = answers[field.id];

      if (field.required && !value) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);

    console.log("Submitted answers:", answers);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>FormForge</h1>
          <p>Build forms visually.</p>
        </div>

        <button
          className="preview-button"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? "Back to Builder" : "Preview"}
        </button>
      </header>

      {isPreview ? (
        <main className="preview-page">
          <div className="preview-card">
            <h2>{form.title}</h2>
            <p className="form-description">{form.description}</p>

            {form.fields.map((field) => (
              <div className="preview-field" key={field.id}>
                <FormField
                  field={field}
                  value={answers[field.id] || ""}
                  onChange={handleAnswerChange}
                  onSelect={() => {}}
                  onDelete={() => {}}
                  onMove={() => {}}
                  preview={true}
                />

                {errors[field.id] && (
                  <p className="error">{errors[field.id]}</p>
                )}
              </div>
            ))}

            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>

            {submitted && (
              <p className="success">Form submitted successfully!</p>
            )}
          </div>
        </main>
      ) : (
        <main className="builder">
          <aside className="sidebar">
            <h2>Fields</h2>
            <p className="panel-description">Add a field to your form.</p>

            <button onClick={() => addField("text")}>Text</button>
            <button onClick={() => addField("email")}>Email</button>
            <button onClick={() => addField("number")}>Number</button>
            <button onClick={() => addField("textarea")}>Textarea</button>
            <button onClick={() => addField("select")}>Select</button>
            <button onClick={() => addField("checkbox")}>Checkbox</button>
          </aside>

          <section className="canvas">
            <div className="form-header">
              <input
                className="title-input"
                value={form.title}
                onChange={(event) => updateForm({ title: event.target.value })}
              />

              <textarea
                className="description-input"
                value={form.description}
                onChange={(event) =>
                  updateForm({ description: event.target.value })
                }
              />
            </div>

            <div className="fields-container">
              {form.fields.length === 0 ? (
                <div className="empty-state">
                  <h3>Your form is empty</h3>
                  <p>Choose a field from the left to get started.</p>
                </div>
              ) : (
                form.fields.map((field) => (
                  <div
                    className={`builder-field ${
                      selectedFieldId === field.id ? "selected" : ""
                    }`}
                    key={field.id}
                  >
                    <FormField
                      field={field}
                      onSelect={(id) => setSelectedFieldId(id)}
                      onDelete={deleteField}
                      onMove={moveField}
                    />
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="properties">
            <h2>Properties</h2>

            <PropertiesPanel
              selectedField={selectedField}
              onUpdateField={updateField}
            />
          </aside>
        </main>
      )}
    </div>
  );
}

export default App;
