# VectorApi

All URIs are relative to *https://recall-you.web.app*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authenticateFace**](#authenticateface) | **POST** /v1/vector/face-auth | |
|[**registerFace**](#registerface) | **POST** /v1/vector/face | |

# **authenticateFace**
> AuthenticateFace200Response authenticateFace()

Authenticate a user using face recognition

### Example

```typescript
import {
    VectorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VectorApi(configuration);

let image: File; //Image for face authentication (default to undefined)

const { status, data } = await apiInstance.authenticateFace(
    image
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **image** | [**File**] | Image for face authentication | defaults to undefined|


### Return type

**AuthenticateFace200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful authenticated response |  -  |
|**400** | Bad Request - Invalid input or missing image |  -  |
|**403** | Forbidden - User not authenticated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerFace**
> RegisterFace201Response registerFace()

Register a user\'s face for authentication

### Example

```typescript
import {
    VectorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VectorApi(configuration);

let image: File; //Image for face registration (default to undefined)

const { status, data } = await apiInstance.registerFace(
    image
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **image** | [**File**] | Image for face registration | defaults to undefined|


### Return type

**RegisterFace201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful response |  -  |
|**400** | Bad Request - Invalid input or missing image |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

