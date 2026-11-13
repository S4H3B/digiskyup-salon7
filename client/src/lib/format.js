export const formatPrice = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

export const todayISO = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
};
