function fieldReducer(state, action) {
  switch (action.type) {
    case "ADD_FIELD":
      return {
        ...state,
        fields: [...state.fields, action.field],
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.id ? { ...field, ...action.updates } : field,
        ),
      };

    case "DELETE_FIELD":
      return {
        ...state,
        fields: state.fields.filter((field) => field.id !== action.id),
      };

    case "MOVE_FIELD": {
      const index = state.fields.findIndex((field) => field.id === action.id);
      const newIndex = index + action.direction;

      if (newIndex < 0 || newIndex >= state.fields.length) {
        return state;
      }

      const newFields = [...state.fields];

      [newFields[index], newFields[newIndex]] = [
        newFields[newIndex],
        newFields[index],
      ];

      return {
        ...state,
        fields: newFields,
      };
    }
    case "UPDATE_FORM":
      return {
        ...state,
        ...action.updates,
      };

    default:
      return state;
  }
}

export default fieldReducer;
