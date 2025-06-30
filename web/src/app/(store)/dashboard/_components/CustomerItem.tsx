import { Customer, Profile } from '@/api';

interface CustomerItemProps {
  customer: Customer;
  profiles: Profile[];
}

export default function CustomerItem({ customer, profiles }: CustomerItemProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-card/40 border border-card rounded-md">
      <div className="flex items-center space-x-4">
        {/*<img*/}
        {/*  src={customer.imageUrl || '/default-avatar.png'}*/}
        {/*  alt={customer.name}*/}
        {/*  className="w-10 h-10 rounded-full"*/}
        {/*/>*/}
        <span className="text-lg font-medium">{customer.id}</span>
      </div>
      <p className="text-sm text-muted-foreground">{JSON.stringify(profiles)}</p>
    </div>
  );

}