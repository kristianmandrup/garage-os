import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FormField } from './form-field';

describe('FormField', () => {
  it('renders label and children', () => {
    const { getByText, getByRole } = render(
      <FormField label="Name" htmlFor="name">
        <input id="name" role="textbox" />
      </FormField>
    );
    expect(getByText('Name')).toBeTruthy();
    expect(getByRole('textbox')).toBeTruthy();
  });

  it('shows required asterisk', () => {
    const { container } = render(
      <FormField label="Name" required>
        <input />
      </FormField>
    );
    expect(container.textContent).toContain('*');
  });

  it('shows error message', () => {
    const { getByText } = render(
      <FormField label="Name" error="Name is required">
        <input />
      </FormField>
    );
    expect(getByText('Name is required')).toBeTruthy();
  });

  it('shows hint when no error', () => {
    const { getByText } = render(
      <FormField label="Name" hint="Enter your full name">
        <input />
      </FormField>
    );
    expect(getByText('Enter your full name')).toBeTruthy();
  });

  it('hides hint when error is present', () => {
    const { queryByText } = render(
      <FormField label="Name" error="Required" hint="Enter your name">
        <input />
      </FormField>
    );
    expect(queryByText('Enter your name')).toBeNull();
    expect(queryByText('Required')).toBeTruthy();
  });
});
