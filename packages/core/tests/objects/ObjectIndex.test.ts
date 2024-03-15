import type { ServiceContext } from "llamaindex";
import {
  FunctionTool,
  ObjectIndex,
  SimpleToolNodeMapping,
  VectorStoreIndex,
} from "llamaindex";
import { beforeAll, describe, expect, test, vi } from "vitest";

vi.mock("llamaindex/llm/open_ai", () => {
  return {
    getOpenAISession: vi.fn().mockImplementation(() => null),
  };
});

import { mockServiceContext } from "../utility/mockServiceContext.js";

describe("ObjectIndex", () => {
  let serviceContext: ServiceContext;

  beforeAll(() => {
    serviceContext = mockServiceContext();
  });

  test("test_object_with_tools", async () => {
    const tool1 = new FunctionTool((x: any) => x, {
      name: "test_tool",
      description: "test tool",
      parameters: {
        type: "object",
        properties: {
          x: {
            type: "string",
          },
        },
      },
    });

    const tool2 = new FunctionTool((x: any) => x, {
      name: "test_tool_2",
      description: "test tool 2",
      parameters: {
        type: "object",
        properties: {
          x: {
            type: "string",
          },
        },
      },
    });

    const toolMapping = SimpleToolNodeMapping.fromObjects([tool1, tool2]);

    const objectRetriever = await ObjectIndex.fromObjects(
      [tool1, tool2],
      toolMapping,
      VectorStoreIndex,
      {
        serviceContext,
      },
    );

    const retriever = await objectRetriever.asRetriever({
      serviceContext,
    });

    expect(await retriever.retrieve("test")).toStrictEqual([tool1, tool2]);
  });

  test("add a new object", async () => {
    const tool1 = new FunctionTool((x: any) => x, {
      name: "test_tool",
      description: "test tool",
      parameters: {
        type: "object",
        properties: {
          x: {
            type: "string",
          },
        },
      },
    });

    const tool2 = new FunctionTool((x: any) => x, {
      name: "test_tool_2",
      description: "test tool 2",
      parameters: {
        type: "object",
        properties: {
          x: {
            type: "string",
          },
        },
      },
    });

    const toolMapping = SimpleToolNodeMapping.fromObjects([tool1]);

    const objectRetriever = await ObjectIndex.fromObjects(
      [tool1],
      toolMapping,
      VectorStoreIndex,
      {
        serviceContext,
      },
    );

    let tools = objectRetriever.tools;

    expect(Object.keys(tools).length).toBe(1);

    objectRetriever.insertObject(tool2);

    tools = objectRetriever.tools;

    expect(Object.keys(tools).length).toBe(2);
  });
});
