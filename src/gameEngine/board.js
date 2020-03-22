export const Board = (size, initialState) => {
  const fields = new Array(size * size).fill(initialState);

  const getFields = () => fields;

  const setField = (fieldPosition, state) => {fields[fieldPosition] = state; };

  const count = (state) => fields.filter(field => field === state).length;

  return {
    getFields,
    setField,
    count,
  };
};
