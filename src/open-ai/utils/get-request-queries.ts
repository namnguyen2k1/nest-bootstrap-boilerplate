import { AssistantListParams } from "openai/resources/beta";
import { RunListParams } from "openai/resources/beta/threads";
import { MessageListParams } from "openai/resources/chat/completions";

export const DEFAULT_REQUEST_QUERIES: AssistantListParams = {
  limit: 20,
  order: "desc",
};

export function getRequestQueries(
  query: AssistantListParams | RunListParams | MessageListParams = {},
): AssistantListParams | RunListParams | MessageListParams {
  const { limit, order } = DEFAULT_REQUEST_QUERIES;

  query.limit = query?.limit ?? limit;
  query.order = query?.order ?? order;

  return query;
}
