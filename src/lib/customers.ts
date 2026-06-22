import { Customer } from '@/types/customer';
import customersData from '@/data/customers.json';

export function getCustomers(): Customer[] {
  return customersData as Customer[];
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((customer) => customer.id === id);
}

export function getStatusOptions() {
  return ['All', 'New', 'In Progress', 'Matched'] as const;
}

export function getCities() {
  const cities = Array.from(new Set(getCustomers().map((customer) => customer.city)));
  return ['All', ...cities.sort()];
}
