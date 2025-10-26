import { Metadata } from 'next';
import AdminDashboard from '@/components/postcode-manager/AdminDashboard';

export const metadata: Metadata = {
  title: 'Postcode Manager | Admin',
  description: 'Manage service areas and postcode validation',
};

export default function PostcodeManagerPage() {
  return <AdminDashboard />;
}
