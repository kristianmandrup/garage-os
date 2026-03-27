import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb';

describe('Breadcrumb', () => {
  it('renders with aria-label', () => {
    const { getByLabelText } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(getByLabelText('breadcrumb')).toBeTruthy();
  });

  it('renders links and current page', () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Current')).toBeTruthy();
  });

  it('marks current page with aria-current', () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(getByText('Current').getAttribute('aria-current')).toBe('page');
  });
});
