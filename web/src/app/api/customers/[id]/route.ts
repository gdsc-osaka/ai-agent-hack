import { NextRequest } from "next/server";
import { mockCustomers } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = mockCustomers.find((c) => c.id === id);

    if (!customer) {
      return Response.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: customer,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerData = await request.json();
    const customerIndex = mockCustomers.findIndex((c) => c.id === id);

    if (customerIndex === -1) {
      return Response.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // In a real application, this would update the database
    const updatedCustomer = {
      ...mockCustomers[customerIndex],
      ...customerData,
    };

    return Response.json({
      success: true,
      data: updatedCustomer,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerIndex = mockCustomers.findIndex((c) => c.id === id);

    if (customerIndex === -1) {
      return Response.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // In a real application, this would delete from the database

    return Response.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
