const isValidRFC = (rfc) => {
  if (!rfc) return true;
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcRegex.test(rfc.toUpperCase());
};

const isValidCURP = (curp) => {
  if (!curp) return true;
  const curpRegex = /^[A-Z]{4}\d{6}[HM]\d{6}[A-Z0-9]{3}$/;
  return curpRegex.test(curp.toUpperCase());
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  if (!phone) return true;
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const isValidZipCode = (zipCode) => {
  if (!zipCode) return true;
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zipCode);
};

module.exports = {
  isValidRFC,
  isValidCURP,
  isValidEmail,
  isValidPhone,
  isValidZipCode,
};