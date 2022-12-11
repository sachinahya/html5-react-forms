import { Label } from '@radix-ui/react-label';
import { clsx } from 'clsx';
import {
  FC,
  HTMLAttributes,
  InputHTMLAttributes,
  useId,
  useRef,
  useState,
} from 'react';

import styles from './Field.module.css';
import { useValidity } from './useValidity';
import { getErrorMessage } from './useErrorMessage';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Name of the field to link to Formik.
   */
  name: string;

  /**
   * Label for the field.
   */
  label: string;

  helpText?: string;

  errorMessage?: string | ((validity: ValidityState) => string);

  unstable_customValidation?: string;

  /**
   * Props to pass to the wrapper div.
   */
  containerProps?: HTMLAttributes<HTMLElement>;

  /**
   * Props to pass to the label element.
   */
  labelProps?: HTMLAttributes<HTMLElement>;

  /**
   * Props to pass to the message element.
   */
  messageProps?: HTMLAttributes<HTMLElement>;
}

export const TextField: FC<TextFieldProps> = ({
  name,
  label,
  helpText,
  errorMessage,
  unstable_customValidation,
  containerProps,
  labelProps,
  messageProps,
  ...props
}) => {
  const id = useId() + (props?.id || '');
  const messageId = id + '-msg';

  const [element, setElement] = useState<HTMLInputElement | null>(null);
  const {
    validity,
    interacted,
    props: validityProps,
  } = useValidity(props, element, unstable_customValidation);

  const error =
    validity?.valid === false
      ? getErrorMessage(validity, element, errorMessage)
      : undefined;

  const isMessageVisible = !!((interacted && error) || helpText);

  return (
    <div
      {...containerProps}
      className={clsx(styles.field, containerProps?.className)}
    >
      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>
      <input
        ref={setElement}
        type="text"
        {...props}
        data-touched={interacted ? '' : undefined}
        name={name}
        id={id}
        // aria-errormessage has poor support across screen readers.
        // https://a11ysupport.io/tech/aria/aria-errormessage_attribute
        // Instead we use aria-describedby along with NOT using aria-live.
        // https://www.davidmacd.com/blog/test-aria-describedby-errormessage-aria-live.html
        aria-invalid={error ? true : undefined}
        aria-describedby={isMessageVisible ? messageId : undefined}
        onChange={(event) => {
          validityProps.onChange(event);
          props?.onChange?.(event);
        }}
        onBlur={(event) => {
          validityProps.onBlur(event);
          props?.onBlur?.(event);
        }}
        onInvalid={(event) => {
          validityProps.onInvalid(event);
          props?.onInvalid?.(event);
        }}
      />
      <div
        {...messageProps}
        className={clsx(
          styles.message,
          !isMessageVisible && styles.hidden,
          messageProps?.className
        )}
        id={messageId}
      >
        {error || helpText}
      </div>
    </div>
  );
};
