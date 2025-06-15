# StoresApi

All URIs are relative to *https://recall-you.web.app*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createStore**](#createstore) | **GET** /api/v1/stores | |

# **createStore**
> Store createStore()

Create a new store

### Example

```typescript
import {
    StoresApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoresApi(configuration);

const { status, data } = await apiInstance.createStore();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Store**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

