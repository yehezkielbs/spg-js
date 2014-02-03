//= require jquery
//= require webtoolkit.md5
//= require bignumber.js

function toDecimal(numberInString, symbols) {
  var result = new BigNumber('0'),
    base = symbols.length,
    power = 0,
    value, multiplier, i;

  for (i = numberInString.length - 1; i >= 0; i--) {
    value = new BigNumber(symbols.indexOf(numberInString.charAt(i)));
    multiplier = (new BigNumber(base)).pow(power);
    result = result.add(value.multiply(multiplier));

    power = power + 1;
  }

  return result;
}

function fromDecimal(number, symbols) {
  var numberInDec = new BigNumber(number),
    base = symbols.length,
    result = '',
    index;

  if (numberInDec.compare(0) === 0) {
    result = symbols.charAt(0);
  } else {
    while (numberInDec.compare(0) === 1) {
      index = numberInDec.mod(base);
      result = (symbols.charAt(index)) + result;

      numberInDec = numberInDec.subtract(index).divide(base);
    }
  }

  return result;
}

function generatePassword(privatePassword, domain, username, options) {
  var raw = privatePassword + domain + (username || ''),
    hexString = MD5(raw),
    baseXSymbols = '',
    result = '';

  if (!options || options.useAlphabet) {
    result = result + fromDecimal(toDecimal(hexString.substring(0, 1), '0123456789abcdef'), 'ABCDEFGHIJKLMNOP');
    hexString = hexString.slice(1);

    result = result + fromDecimal(toDecimal(hexString.substring(0, 1), '0123456789abcdef'), 'abcdefghijklmnop');
    hexString = hexString.slice(1);
  }

  if (!options || options.useNumber) {
    result = result + toDecimal(hexString.substring(0, 1), '0123456789abcdef').toString();
    hexString = hexString.slice(1);
  }

  if (!options || options.useSymbol) {
    result = result + fromDecimal(toDecimal(hexString.substring(0, 1), '0123456789abcdef'), '~!@#$%^&*()_+-={');
    hexString = hexString.slice(1);
  }

  if (!options || options.useAlphabet) baseXSymbols = baseXSymbols + 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (!options || options.useNumber)  baseXSymbols = baseXSymbols + '0123456789';
  if (!options || options.useSymbol)  baseXSymbols = baseXSymbols + '~!@#$%^&*()_+-={}|[]\\;\':"<>?,./';

  result = result + fromDecimal(toDecimal(hexString, '0123456789abcdef'), baseXSymbols);

  if (options && options.lengthLimit) {
    result = result.substring(0, options.lengthLimit);
  }

  return result;
}

$(function () {
  $('form').on('submit', function (event) {
    var $form = $(this),
      password = $form.find('#input-password').val(),
      password_retype = $form.find('#input-password-retype').val(),
      domain = $form.find('#input-domain').val(),
      username = $form.find('#input-username').val(),
      lengthLimit = $form.find('#input-length-limit').val(),
      useAlphabet = $form.find('#input-use-alphabet').is(':checked'),
      useNumber = $form.find('#input-use-number').is(':checked'),
      useSymbol = $form.find('#input-use-symbol').is(':checked'),
      $resContainer = $('#result-container'),
      result;

    $form.find('.has-error').removeClass('has-error');
    $form.find('.alert-danger').remove();

    if (password === password_retype) {

      result = generatePassword(password, domain, username, {
        lengthLimit: lengthLimit,
        useAlphabet: useAlphabet,
        useNumber: useNumber,
        useSymbol: useSymbol
      });

      $resContainer.css('display', 'block');
      $resContainer.find('#generated-password').text(result);

    } else {

      $form.find('#input-password-retype').closest('.form-group').addClass('has-error');
      $form.prepend('<div class="alert alert-danger">Re-typed password doesn\'t match the password.</div>')

    }

    event.stopPropagation();
    event.preventDefault();
  });
});