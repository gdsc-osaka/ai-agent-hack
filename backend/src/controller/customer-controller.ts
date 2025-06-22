import { RegisterCustomer } from "../service/customer-service";
import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier } from "./error/api-error";
import { Customer } from "../domain/customer";
import { registerCustomerGlobalController } from "./shared/register-customer-global-controller";

export const registerCustomerController = (
  registerCustomerRes: ReturnType<RegisterCustomer>
): ResultAsync<Customer, HTTPErrorCarrier> =>
  registerCustomerGlobalController(registerCustomerRes);
