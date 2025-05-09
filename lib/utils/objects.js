const subclassResponsibility = () => {
  throw new Error('subclass responsibility');
};

const asFloat = number =>
  Number.parseFloat(number);

export {
  subclassResponsibility,
  asFloat,
};
