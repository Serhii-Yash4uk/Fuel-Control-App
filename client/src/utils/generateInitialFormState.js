export const generateInitialFormState = (tableHeaderItems) => {
  return tableHeaderItems.reduce((acc, item) => {
    if (item.isAddable) {
      acc[item.key] = '';
    }
    return acc;
  }, {});
};
