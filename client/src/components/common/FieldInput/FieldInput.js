import { Field, Input } from '@chakra-ui/react';

export const FieldInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  invalid,
  errorText,
  required = false,
}) => (
  <Field.Root label={label} invalid={invalid} required={required}>
    <Field.Label>
      {label}
      <Field.RequiredIndicator />
    </Field.Label>
    <Input
      name={name}
      type={type || 'text'}
      inputMode={type || 'text'}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
    {invalid && <Field.ErrorText>{errorText}</Field.ErrorText>}
  </Field.Root>
);
