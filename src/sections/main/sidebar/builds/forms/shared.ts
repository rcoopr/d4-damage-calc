import { FieldError } from 'react-hook-form';

const errorMessages: Partial<Record<FieldError['type'], string>> = {
  required: `Build name can't be empty`,
  pattern: `Build name can't start with a number or contain symbols`,
  validate: `Build names must be unique`,
};

export function getHumanReadableErrorMessage(error?: FieldError) {
  return error && error.type in errorMessages ? errorMessages[error.type] : undefined;
}

export function isValidObjectKey(key: string) {
  const sampleObject = { [key]: 'ok' };
  return sampleObject[key] === 'ok';
}
