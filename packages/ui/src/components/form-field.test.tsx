import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FormField } from './form-field';

describe('FormField', () => {
  it('renders label and children', () => {
    const { getByTestId, getByRole } = render(
      <FormField label="Name" htmlFor="name">
        <input id="name" role="textbox" />
      </FormField>
    );
    expect(getByTestId('form-field')).toBeTruthy();
    expect(getByRole('textbox')).toBeTruthy();
  });

  it('shows required asterisk', () => {
    const { getByTestId } = render(
      <FormField label="Name" required>
        <input />
      </FormField>
    );
    expect(getByTestId('form-field').textContent).toContain('*');
  });

  it('shows error message', () => {
    const { getByTestId } = render(
      <FormField label="Name" error="Name is required">
        <input />
      </FormField>
    );
    expect(getByTestId('form-field-error')).toBeTruthy();
    expect(getByTestId('form-field-error').textContent).toBe('Name is required');
  });

  it('shows hint when no error', () => {
    const { getByTestId } = render(
      <FormField label="Name" hint="Enter your full name">
        <input />
      </FormField>
    );
    expect(getByTestId('form-field-hint')).toBeTruthy();
    expect(getByTestId('form-field-hint').textContent).toBe('Enter your full name');
  });

  it('hides hint when error is present', () => {
    const { queryByTestId } = render(
      <FormField label="Name" error="Required" hint="Enter your name">
        <input />
      </FormField>
    );
    expect(queryByTestId('form-field-hint')).toBeNull();
    expect(queryByTestId('form-field-error')).toBeTruthy();
    expect(queryByTestId('form-field-error')?.textContent).toBe('Required');
  });
});
