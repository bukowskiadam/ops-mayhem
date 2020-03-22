export const Board = (size, initialState) => {
  const fieldsCount = size * size;
  const fields = new Array(size * size).fill(initialState);

  const getFields = () => fields;

  const setField = (fieldPosition, state) => {
    if (fieldPosition >= fieldsCount) {
      throw new Error(`Field ${ fieldPosition } is out of the board of ${ fieldsCount } total fields`);
    }

    fields[fieldPosition] = state;
  };

  const count = (state) => fields.filter(field => field === state).length;

  return {
    getFields,
    setField,
    count,
    fieldsCount,
  };
};
