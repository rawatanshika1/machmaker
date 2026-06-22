import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getCustomerById } from '@/lib/customers';
import { CustomerDetailClient } from './CustomerDetailClient';

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const customer = getCustomerById(id);
  if (!customer) {
    redirect('/404');
  }

  return <CustomerDetailClient customer={customer} />;
}
