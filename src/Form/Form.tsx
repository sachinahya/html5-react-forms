import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { FC, FormEventHandler, FormHTMLAttributes, useState } from 'react';
import { flushSync } from 'react-dom';
import { getErrorMessage } from '../Field/useErrorMessage';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

export const Form: FC<FormProps> = ({
  children,
  noValidate = true,
  onSubmit,
  ...props
}) => {
  const [announceErrors, setAnnounceErrors] = useState<[string, string][]>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    // Make sure we remove and re-add the announce element to repeat the error each time a
    // submission is attempted.
    flushSync(() => {
      setAnnounceErrors(undefined);
    });

    const form = event.currentTarget;
    const isValid = form.checkValidity();

    if (isValid) {
      onSubmit?.(event);
    } else {
      // Abort the submit.
      event.preventDefault();

      const errorsToAnnounce: [string, string][] = [];

      for (const el of form) {
        if (el instanceof HTMLInputElement && !el.validity.valid) {
          // useId on the fields guarantees unique IDs so this should be safe.
          const label =
            form.querySelector(`label[for="${el.id}"]`)?.textContent || el.name;

          errorsToAnnounce.push([label, getErrorMessage(el.validity, el)]);
        }
      }

      if (errorsToAnnounce.length > 0) {
        setAnnounceErrors(errorsToAnnounce);
      }
    }
  };

  return (
    <form {...props} noValidate={noValidate} onSubmit={handleSubmit}>
      {children}
      {!!announceErrors?.length ? (
        <VisuallyHidden aria-live="polite">
          {announceErrors.map((err) => err.join(': ')).join('. ')}
        </VisuallyHidden>
      ) : null}
    </form>
  );
};
