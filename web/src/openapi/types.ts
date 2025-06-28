export interface paths {
    "/api/v1/stores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Create a new store */
        post: operations["createStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/stores/{storeId}/invite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Invite a staff member to a store */
        post: operations["inviteStaffToStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/stores/{storeId}/customers/authenticate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Authenticate a user using face recognition */
        post: operations["authenticateCustomer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/stores/{storeId}/customers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get customers for a store */
        get: operations["getCustomersByStore"];
        put?: never;
        /** @description Register a user's face for authentication */
        post: operations["registerCustomer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/stores/{storeId}/customers/:customerId/checkout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Checkout a customer from the store */
        post: operations["checkoutCustomer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/stores/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get store by X-Api-Key */
        get: operations["getStoreByMe"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/stores/{storeId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get store by ID */
        get: operations["getStoreById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/stores/{storeId}/api-keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Create an API key for the store */
        post: operations["createStoreApiKey"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/staffs/me/stores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Fetch stores for staff */
        get: operations["fetchStoresForStaff"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/invitations/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Accept a staff invitation */
        post: operations["acceptInvitation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/invitations/decline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Decline a staff invitation */
        post: operations["declineInvitation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/customers/{customerId}/accept-tos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Accept the Terms of Service for a customer. */
        post: operations["acceptCustomerTos"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/customers/{customerId}/decline-tos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Decline the Terms of Service for a customer and delete their data. */
        post: operations["declineCustomerTos"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/profiles/generate-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Generate profile data using Gemini */
        post: operations["generateProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Timestamp: {
            seconds: number;
            nanoseconds: number;
        };
        Store: {
            id: string;
            createdAt: components["schemas"]["Timestamp"];
            updatedAt: components["schemas"]["Timestamp"];
        };
        /** @enum {string} */
        ApiErrorCode: "internal/database_error" | "internal/firestore_error" | "authorization/invalid_session" | "authorization/invalid_api_key" | "store/not_found" | "store/already_exists" | "store/invalid_store_id" | "store/invalid" | "store/wrong_store_id" | "customer/already_exists" | "customer/not_found" | "customer/invalid" | "customer/not_belongs_to_store" | "customer/tos_already_accepted" | "customer/face_auth_error" | "face_embedding/error" | "staff/not_found" | "staff/invalid" | "staff/invalid_role" | "staff/already_exists_in_store" | "staff/is_not_admin" | "staff_invitation/not_found" | "staff_invitation/already_exists" | "staff_invitation/duplicate" | "staff_invitation/permission_error" | "staff_invitation/expired" | "staff_invitation/not_pending" | "staff_invitation/wrong_email" | "staff_invitation/invalid" | "visit/not_found" | "store_api_key/already_exists" | "profile/invalid" | "cloud_function/error" | "cloud_function/upload_audio_error";
        ApiError: {
            message: string;
            code: components["schemas"]["ApiErrorCode"];
            /** @default [] */
            details: unknown[];
        };
        /** @enum {string} */
        StaffInvitationStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
        /** @enum {string} */
        StaffRole: "ADMIN" | "STAFF";
        StaffInvitation: {
            status: components["schemas"]["StaffInvitationStatus"];
            role: components["schemas"]["StaffRole"];
            storeId: string;
            /**
             * Format: email
             * @description Email of the staff member to invite
             */
            targetEmail: string;
            invitedBy: string;
            /** @description Unique token for the invitation */
            token: string;
            expiredAt: components["schemas"]["Timestamp"];
            createdAt: components["schemas"]["Timestamp"];
            updatedAt: components["schemas"]["Timestamp"];
        };
        Customer: {
            id: string;
            tosAcceptedAt?: components["schemas"]["Timestamp"];
            createdAt: components["schemas"]["Timestamp"];
            updatedAt: components["schemas"]["Timestamp"];
        };
        /** @description API key for the store */
        StoreApiKey: {
            apiKey: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    createStore: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Unique identifier for the store */
                    id: string;
                };
            };
        };
        responses: {
            /** @description Create store response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Store"];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    inviteStaffToStore: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the store to invite staff to */
                storeId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * Format: email
                     * @description Email of the staff member to invite
                     */
                    email: string;
                    role: components["schemas"]["StaffRole"];
                };
            };
        };
        responses: {
            /** @description Staff invitation sent successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffInvitation"];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    authenticateCustomer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the store to invite staff to */
                storeId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Image for face authentication
                     */
                    image: Blob;
                };
            };
        };
        responses: {
            /** @description Successful authenticated response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Customer"];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
            /** @description Forbidden - User not authenticated */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    getCustomersByStore: {
        parameters: {
            query: {
                status: "visiting";
            };
            header?: never;
            path: {
                /** @description ID of the store to invite staff to */
                storeId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Customer"][];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    registerCustomer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the store to invite staff to */
                storeId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Image for face authentication
                     */
                    image: Blob;
                };
            };
        };
        responses: {
            /** @description Successful response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Customer"];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    checkoutCustomer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the store to invite staff to */
                storeId: string;
                /** @description ID of the customer to checkout */
                customerId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    getStoreByMe: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Store"] & unknown;
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    getStoreById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the store to invite staff to */
                storeId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Store"] & unknown;
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    createStoreApiKey: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the store to invite staff to */
                storeId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StoreApiKey"];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    fetchStoresForStaff: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        stores: components["schemas"]["Store"][];
                    };
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    acceptInvitation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Unique token for the invitation */
                    token: string;
                };
            };
        };
        responses: {
            /** @description Staff invitation sent successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffInvitation"];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    declineInvitation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Unique token for the invitation */
                    token: string;
                };
            };
        };
        responses: {
            /** @description Staff invitation sent successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffInvitation"];
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    acceptCustomerTos: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                customerId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully accepted the Terms of Service. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    declineCustomerTos: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                customerId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully declined the Terms of Service and deleted customer data. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    generateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Audio file
                     */
                    file: Blob;
                };
            };
        };
        responses: {
            /** @description Successfully generated profile data */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Success message */
                        message: string;
                        /** @description Task ID for tracking the profile generation */
                        taskId: string;
                    };
                };
            };
            /** @description Bad Request - Invalid input or missing image */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
}
