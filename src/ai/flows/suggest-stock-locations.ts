'use server';

/**
 * @fileOverview A stock location suggestion AI agent.
 *
 * - suggestStockLocations - A function that suggests stock locations.
 * - SuggestStockLocationsInput - The input type for the suggestStockLocations function.
 * - SuggestStockLocationsOutput - The return type for the suggestStockLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStockLocationsInputSchema = z.object({
  componentType: z
    .string()
    .describe('The type of server component needed (e.g., SATA, SSD, memory, network card).'),
  stockLocationCriteria: z
    .string()
    .describe(
      'Criteria for stock location, such as proximity to the server rack or availability.'
    ),
  availableOptions: z
    .string()
    .describe(
      'The list of available stock locations with their attributes (location, capacity, etc.)'
    ),
});
export type SuggestStockLocationsInput = z.infer<typeof SuggestStockLocationsInputSchema>;

const SuggestStockLocationsOutputSchema = z.object({
  suggestedLocations: z
    .string()
    .describe(
      'A comma separated list of the suggested stock locations for the component.'
    ),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the location suggestions.'),
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
  prompt: `You are an expert in server component logistics and stock management.

Based on the component type, stock location criteria, and available options, suggest the optimal stock locations for the technician to retrieve the parts from.

Component Type: {{{componentType}}}
Stock Location Criteria: {{{stockLocationCriteria}}}
Available Options: {{{availableOptions}}}

Consider all factors, such as proximity, capacity, and accessibility, to make the best recommendation.

Respond with only the suggested locations as a comma separated list and the reasoning for your decision.

Suggested Locations: {{{{suggestedLocations}}}}
Reasoning: {{{{reasoning}}}}
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

