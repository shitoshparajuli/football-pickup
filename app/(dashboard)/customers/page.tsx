import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

// This ensures the page is rendered at request time
export const dynamic = 'force-dynamic';

export default function CustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>View all customers and their orders.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
