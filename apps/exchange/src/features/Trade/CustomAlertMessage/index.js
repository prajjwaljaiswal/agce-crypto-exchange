import { createElement } from 'react';
import toast from 'react-hot-toast';

// Wrap long messages (e.g. URLs in error payloads) so the toast bubble
// contains the text instead of letting it spill outside.
const toastStyle = {
  background: '#2b313c',
  color: '#e0e0e0',
  maxWidth: '420px',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
};

const toTitleCase = (str) => {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

function alertErrorMessage(message) {
  toast.error(
    () => createElement('span', null, toTitleCase(message) || 'Network Error...Please Try Again Later'),
    { style: toastStyle }
  );
}

function alertSuccessMessage(message) {
  toast.success(
    () => createElement('span', null, toTitleCase(message) || 'Success'),
    { style: toastStyle }
  );
}

function alertWarningMessage(message) {
  toast(
    () => createElement('span', null, toTitleCase(message) || 'Oops...Something Went Wrong'),
    { icon: '⚠️', style: toastStyle }
  );
}

export { alertErrorMessage, alertSuccessMessage, alertWarningMessage };
