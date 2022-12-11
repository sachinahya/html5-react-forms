const getDefaultErrorMessage = (
  validity: ValidityState,
  inputElement: HTMLInputElement | null
): string => {
  // Messages based on Constraint Validation API
  // https://developer.mozilla.org/en-US/docs/Web/API/ValidityState

  if (validity.valueMissing) {
    return 'I am required';
  }

  if (validity.typeMismatch) {
    if (inputElement?.type === 'email') {
      return 'Invalid email';
    }

    if (inputElement?.type === 'url') {
      return 'Invalid URL';
    }

    return 'Invalid format';
  }

  if (validity.patternMismatch) {
    return 'Invalid pattern';
  }

  if (validity.customError && inputElement?.validationMessage) {
    return inputElement.validationMessage;
  }

  // validity.tooShort
  // validity.toolLong
  // validity.rangeOverflow
  // validity.rangeUnderflow
  // validity.stepMismatch
  // validity.badInput

  return 'Something else wrong';
};

export const getErrorMessage = (
  validity: ValidityState,
  inputElement: HTMLInputElement | null,
  customErrorMessage?: string | ((validity: ValidityState) => string)
): string => {
  let error: string;

  if (customErrorMessage) {
    error =
      typeof customErrorMessage === 'function'
        ? customErrorMessage(validity)
        : customErrorMessage;
  } else {
    error = getDefaultErrorMessage(validity, inputElement);
  }

  return error;
};
