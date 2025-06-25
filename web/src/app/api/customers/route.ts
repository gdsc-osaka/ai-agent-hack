import { NextRequest } from 'next/server';
import { mockCustomers } from '@/lib/data';

export async function GET() {
  try {
    // In a real application, this would fetch from a database
    const customers = mockCustomers;
    
    return Response.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json();
    
    // In a real application, this would save to a database
    const newCustomer = {
      id: Date.now().toString(),
      ...customerData,
      totalVisits: 0,
      loyaltyPoints: 0,
      orders: [],
      conversationTopics: []
    };
    
    return Response.json({
      success: true,
      data: newCustomer
    }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}