import numeral from 'numeral';

const dollar = function(value) {
  if (!value) {
    return '$ 0';
  }

  return numeral(value).format('$ 0.00a');
};

const percent = function(value) {
  if (!value) {
    return '0%';
  }

  return `${Number(value).toFixed(2)}%`;
};

export { dollar, percent };
