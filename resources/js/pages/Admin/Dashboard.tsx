import { Card } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { usePage  } from '@inertiajs/react';
import { Props } from 'recharts/types/container/Surface';

export default function AdminDashboardPage() {
    const { user } = usePage<PageProps<{ user:{totalUser: number} }>>().props;

    return (
        <DashboardLayout title="Admin Dashboard">
            <Card>                
            <div>
                Total Users: {user.totalUser}
            </div>
            </Card>
        </DashboardLayout>
    );
}
