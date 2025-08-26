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
  componentType: z
    .string()
    .describe('所需服务器组件的类型（例如，SATA、SSD、内存、网卡）。'),
  stockLocationCriteria: z
    .string()
    .describe(
      '库存位置的标准，例如靠近服务器机架或可用性。'
    ),
  availableOptions: z
    .string()
    .describe(
      '可用库存位置及其属性（位置、容量等）的列表。'
    ),
});
export type SuggestStockLocationsInput = z.infer<typeof SuggestStockLocationsInputSchema>;

const SuggestStockLocationsOutputSchema = z.object({
  suggestedLocations: z
    .string()
    .describe(
      '建议的组件库存位置的逗号分隔列表。'
    ),
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

根据组件类型、库存位置标准和可用选项，为技术人员建议最佳的取件位置。

组件类型: {{{componentType}}}
库存位置标准: {{{stockLocationCriteria}}}
可用选项: {{{availableOptions}}}

考虑所有因素，如距离、容量和可及性，以做出最佳推荐。

仅用建议的位置（以逗号分隔的列表）和你的决策理由来回应。

建议的位置: {{{{suggestedLocations}}}}
理由: {{{{reasoning}}}}
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
