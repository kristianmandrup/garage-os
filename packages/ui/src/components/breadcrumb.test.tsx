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

  it('renders breadcrumb container', () => {
    const { getByTestId } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(getByTestId('breadcrumb')).toBeTruthy();
    // Verify both links and current page render within the breadcrumb
    const nav = getByTestId('breadcrumb');
    expect(nav.textContent).toContain('Home');
    expect(nav.textContent).toContain('Current');
  });

  it('marks current page with aria-current', () => {
    const { getByTestId } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const nav = getByTestId('breadcrumb');
    const currentPage = nav.querySelector('[aria-current="page"]');
    expect(currentPage).toBeTruthy();
    expect(currentPage?.textContent).toBe('Current');
  });
});
