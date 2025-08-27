'use server';

/**
 * @fileOverview 一个库存位置建议 AI 代理。
 *
 * - suggestStockLocations - 一个建议库存位置的函数。
 * - SuggestStockLocationsInput - suggestStockLocations 函数的输入类型。
 * - SuggestStockLocationsOutput - suggestStockLocations 函数的返回类型。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStockLocationsInputSchema = z.object({
  components: z.array(z.object({
    partNumber: z.string().describe('组件的部件号或盒子编号。'),
    model: z.string(),
    quantity: z.number(),
  })).describe('所需服务器组件及其数量的列表。'),
  stockLocationCriteria: z
    .string()
    .describe(
      '库存位置的标准，例如靠近服务器机架或可用性。'
    ),
  availableLocations: z
    .string()
    .describe(
      '可用库存位置及其属性（位置、容量等）的列表。'
    ),
});
export type SuggestStockLocationsInput = z.infer<typeof SuggestStockLocationsInputSchema>;

const SuggestStockLocationsOutputSchema = z.object({
  suggestedLocations: z.array(z.object({
    partNumber: z.string().describe('组件的部件号/盒子编号。'),
    model: z.string().describe('组件的型号。'),
    quantity: z.number().describe('建议领取的数量。'),
    location: z.string().describe('建议的领取位置。'),
  })).describe('建议的组件库存位置列表。'),
  reasoning: z
    .string()
    .describe('AI 对位置建议的推理。'),
});
export type SuggestStockLocationsOutput = z.infer<typeof SuggestStockLocationsOutputSchema>;

export async function suggestStockLocations(
  input: SuggestStockLocationsInput
): Promise<SuggestStockLocationsOutput> {
  return suggestStockLocationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStockLocationsPrompt',
  input: {schema: SuggestStockLocationsInputSchema},
  output: {schema: SuggestStockLocationsOutputSchema},
  prompt: `你是一位专业的服务器组件物流和库存管理专家。

你的任务是根据一个工单所需的组件列表、库存位置标准以及可用的库存位置信息，为技术人员建议每个组件的最佳取件位置和数量。

**需求组件列表:**
{{#each components}}
- 型号: {{this.model}}, 部件号/盒子号: {{this.partNumber}}, 数量: {{this.quantity}}
{{/each}}

**库存位置标准:**
{{{stockLocationCriteria}}}

**可用库存位置:**
{{{availableLocations}}}

请仔细分析以上信息，特别是每个位置的库存情况，为每一个所需组件推荐一个或多个最合适的领取位置。你需要考虑所有因素，如距离、库存数量和可及性，以做出最佳推荐。

请以结构化的 JSON 格式返回你的建议。
`,
});

const suggestStockLocationsFlow = ai.defineFlow(
  {
    name: 'suggestStockLocationsFlow',
    inputSchema: SuggestStockLocationsInputSchema,
    outputSchema: SuggestStockLocationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
