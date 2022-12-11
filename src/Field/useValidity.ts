import {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type HandlerName = 'onChange' | 'onBlur' | 'onInvalid';

type HandlerProps = Required<
  Pick<InputHTMLAttributes<HTMLInputElement>, HandlerName>
>;

type HandlerEvent = Parameters<HandlerProps[HandlerName]>[0];

const customValidate = (value: string, customValidation: string): string => {
  if (customValidation === 'q') {
    if (value.startsWith('q')) {
      return 'Cannot start with q';
    }
  }

  return '';
};

const runCustomValidation = (
  element: HTMLInputElement,
  customValidation: string | undefined
) => {
  if (customValidation) {
    const customError = customValidate(element.value, customValidation);
    element.setCustomValidity(customError);
  } else {
    element.setCustomValidity('');
  }
};

export const useValidity = (
  props: InputHTMLAttributes<HTMLInputElement>,
  element: HTMLInputElement | null,
  customValidation: string | undefined
): {
  validity: ValidityState | undefined;
  interacted: boolean;
  props: HandlerProps;
} => {
  const [validity, setValidity] = useState<ValidityState>();
  const [interacted, setInteracted] = useState(false);

  const isFirstUpdate = useRef(true);

  useEffect(() => {
    if (element && isFirstUpdate.current) {
      isFirstUpdate.current = false;
      return;
    }

    if (element) {
      setValidity(undefined);
      setInteracted(false);
    }
  }, [
    element,
    customValidation,
    props.type,
    props.required,
    props.pattern,
    props.minLength,
    props.maxLength,
    props.min,
    props.max,
    props.step,
  ]);

  useEffect(() => {
    if (element) {
      runCustomValidation(element, customValidation);
    }
  }, [element, customValidation]);

  const handleValidity = useCallback((event: HandlerEvent) => {
    if (event.type !== 'change') {
      setInteracted(true);
    }

    runCustomValidation(event.currentTarget, customValidation);

    const v = event.currentTarget.validity;

    setValidity({
      badInput: v.badInput,
      customError: v.customError,
      patternMismatch: v.patternMismatch,
      rangeOverflow: v.rangeOverflow,
      rangeUnderflow: v.rangeUnderflow,
      stepMismatch: v.stepMismatch,
      tooLong: v.tooLong,
      tooShort: v.tooShort,
      typeMismatch: v.typeMismatch,
      valid: v.valid,
      valueMissing: v.valueMissing,
    });
  }, []);

  return {
    validity,
    interacted,
    props: {
      onBlur: handleValidity,
      onChange: handleValidity,
      onInvalid: handleValidity,
    },
  };
};
