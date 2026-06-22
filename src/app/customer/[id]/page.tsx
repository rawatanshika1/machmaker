import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getCustomerById } from '@/lib/customers';
import { CustomerDetailClient } from './CustomerDetailClient';

export default async function CustomerPage(props: any) {
  const params = props.params as { id: string };
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const customer = getCustomerById(params.id);
  if (!customer) {
    redirect('/404');
  }

  return <CustomerDetailClient customer={customer} />;
}
