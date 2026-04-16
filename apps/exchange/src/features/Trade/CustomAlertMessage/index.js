import { createElement, Fragment } from 'react';
import toast from 'react-hot-toast';

const toastStyle = {
  background: '#2b313c',
  color: '#e0e0e0',
  paddingRight: '32px',
};

const closeCss = {
  cursor: 'pointer',
  paddingLeft: '5px',
  fontSize: '18px',
};

const toTitleCase = (str) => {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

function alertErrorMessage(message) {
  toast.error(
    (t) => createElement(Fragment, null,
      createElement('span', null, toTitleCase(message) || 'Network Error...Please Try Again Later'),
      // createElement('span', { style: closeCss, onClick: () => toast.dismiss(t.id) },
      //   createElement('i', { className: 'ri-close-circle-line' })
      // )
    ),
    { position: 'bottom-center', style: toastStyle }
  );
}

function alertSuccessMessage(message) {
  toast.success(
    (t) => createElement(Fragment, null,
      createElement('span', null, toTitleCase(message) || 'Success'),
      // createElement('span', { style: closeCss, onClick: () => toast.dismiss(t.id) },
      //   createElement('i', { className: 'ri-close-circle-line' })
      // )
    ),
    { position: 'bottom-center', style: toastStyle }
  );
}

function alertWarningMessage(message) {
  toast(
    (t) => createElement(Fragment, null,
      createElement('span', null, toTitleCase(message) || 'Oops...Something Went Wrong'),
      // createElement('span', { style: closeCss, onClick: () => toast.dismiss(t.id) },
      //   createElement('i', { className: 'ri-close-circle-line' })
      // )
    ),
    { position: 'bottom-center', icon: '⚠️', style: toastStyle }
  );
}

export { alertErrorMessage, alertSuccessMessage, alertWarningMessage };
