import {
  createImmutableHook,
  createInfiniteHook,
  createMutateHook,
  createQueryHook,
} from "swr-openapi";
import { isMatch } from "lodash-es";
import { Api } from "@/api";

const prefix = "recall-api";

export const useQuery = (api: Api) => createQueryHook(api, prefix);
export const useImmutable = (api: Api) => createImmutableHook(api, prefix);
export const useInfinite = (api: Api) => createInfiniteHook(api, prefix);
export const useMutate = (api: Api) =>
  createMutateHook(
    api,
    prefix,
    isMatch // Or any comparision function
  );
