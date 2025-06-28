import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import apiClient from '@/api';
import type { components } from '@/openapi/types';

type Customer = components["schemas"]["Customer"];

export async function GET() {
  try {
    const headersList = await headers();
    const client = apiClient(headersList);
    
    // TODO: storeIdを動的に取得する必要があります
    // 現在は仮のstoreIdを使用
    const storeId = 'default-store-id';
    
    const { data, error } = await client.GET('/api/v1/stores/{storeId}/customers', {
      params: {
        path: { storeId },
        query: { status: 'visiting' }
      }
    });
    
    if (error) {
      return Response.json(
        { success: false, error: 'Failed to fetch customers from API' },
        { status: 500 }
      );
    }
    
    return Response.json({
      success: true,
      data: data || [],
      total: data?.length || 0
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
    const newCustomer: Customer = {
      id: Date.now().toString(),
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
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