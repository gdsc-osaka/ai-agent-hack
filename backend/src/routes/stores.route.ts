import { Store, StoreId } from "../domain/store";
import { z } from "zod";
import { ApiError } from "../controller/error/api-error";
import { createDefaultRoute } from "./shared/default-route";
import { Customer, CustomerId } from "../domain/customer";
import tags from "./shared/tags";
import { StaffRole } from "../domain/store-staff";
import { StaffInvitation } from "../domain/staff-invitation";
import { StoreApiKey } from "../domain/store-api-key";

const createStore = createDefaultRoute({
  method: "post",
  path: "/",
  tags: tags.stores,
  operationId: "createStore",
  description: "Create a new store",
  security: [
    {
      session: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string().describe("Unique identifier for the store"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: Store,
        },
      },
      description: "Create store response",
    },
    400: {
      description: "Bad Request - Invalid input or missing image",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

const inviteStaffToStore = createDefaultRoute({
  method: "post",
  path: "/{storeId}/invite",
  tags: tags.invitations,
  operationId: "inviteStaffToStore",
  description: "Invite a staff member to a store",
  security: [
    {
      session: [],
    },
  ],
  request: {
    params: z.object({
      storeId: z.string().describe("ID of the store to invite staff to"),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z
              .string()
              .email()
              .describe("Email of the staff member to invite"),
            role: StaffRole,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Staff invitation sent successfully",
      content: {
        "application/json": {
          schema: StaffInvitation,
        },
      },
    },
  },
});

const authenticateCustomer = createDefaultRoute({
  method: "post",
  path: "/{storeId}/customers/authenticate",
  tags: tags.customers,
  validateResponse: true,
  operationId: "authenticateCustomer",
  description: "Authenticate a user using face recognition",
  request: {
    params: z.object({
      storeId: z.string().describe("ID of the store to invite staff to"),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            image: z
              .instanceof(File)
              .openapi({ type: "string", format: "binary" })
              .describe("Image for face authentication"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful authenticated response",
      content: {
        "application/json": {
          schema: Customer,
        },
      },
    },
    403: {
      description: "Forbidden - User not authenticated",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
    400: {
      description: "Bad Request - Invalid input or missing image",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

const registerCustomer = createDefaultRoute({
  method: "post",
  path: "/{storeId}/customers",
  tags: tags.customers,
  operationId: "registerCustomer",
  description: "Register a user's face for authentication",
  request: {
    params: z.object({
      storeId: z.string().describe("ID of the store to invite staff to"),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            image: z
              .instanceof(File)
              .openapi({ type: "string", format: "binary" })
              .describe("Image for face authentication"),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: Customer,
        },
      },
    },
    400: {
      description: "Bad Request - Invalid input or missing image",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

const checkoutCustomer = createDefaultRoute({
  method: "post",
  path: "/{storeId}/customers/:customerId/checkout",
  tags: tags.customers,
  operationId: "checkoutCustomer",
  description: "Checkout a customer from the store",
  request: {
    params: z.object({
      storeId: StoreId.describe("ID of the store to invite staff to"),
      customerId: CustomerId.describe("ID of the customer to checkout"),
    }),
    // TODO: 音声ファイルを送信してプロフィールデータ生成の firebase function を呼び出す
    // body: {
    //   content: {
    //     "multipart/form-data": {
    //       schema: z.object({
    //         image: z.instanceof(File).describe("Image for face authentication"),
    //       }),
    //     },
    //   },
    // },
  },
  responses: {
    200: {
      description: "Successful response",
    },
  },
});

const getCustomersByStore = createDefaultRoute({
  method: "get",
  path: "/{storeId}/customers",
  tags: tags.customers,
  operationId: "getCustomersByStore",
  description: "Get customers for a store",
  request: {
    params: z.object({
      storeId: StoreId.describe("ID of the store to invite staff to"),
    }),
    query: z.object({
      status: z.enum(["visiting"]),
    }),
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.array(Customer).describe("List of customers for the store"),
        },
      },
    },
  },
});

const getStoreById = createDefaultRoute({
  method: "get",
  path: "/{storeId}",
  tags: tags.stores,
  operationId: "getStoreById",
  description: "Get store by ID",
  request: {
    params: z.object({
      storeId: StoreId.describe("ID of the store to invite staff to"),
    }),
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: Store.describe("Store details by ID"),
        },
      },
    },
  },
});

const getStoreByMe = createDefaultRoute({
  method: "get",
  path: "/me",
  tags: tags.stores,
  operationId: "getStoreByMe",
  description: "Get store by X-Api-Key",
  request: {},
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: Store.describe("Store details by X-Api-Key"),
        },
      },
    },
  },
});

const createStoreApiKey = createDefaultRoute({
  method: "post",
  path: "/{storeId}/api-keys",
  tags: tags.stores,
  operationId: "createStoreApiKey",
  description: "Create an API key for the store",
  request: {
    params: z.object({
      storeId: StoreId.describe("ID of the store to invite staff to"),
    }),
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: StoreApiKey.describe("API key for the store"),
        },
      },
    },
  },
});

export default {
  createStore,
  inviteStaffToStore,
  authenticateCustomer,
  registerCustomer,
  checkoutCustomer,
  getCustomersByStore,
  createStoreApiKey,
  getStoreById,
  getStoreByMe,
};
