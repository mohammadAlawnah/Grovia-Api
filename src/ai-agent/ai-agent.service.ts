import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  buildBudgetDetectionPrompt,
  buildDecisionPrompt,
} from './prompts/agent.prompt';
import { AgentDecision } from './types/agent.type';
import { ProductService } from 'src/products/products.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class AiAgentService {
  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
  ) {}

  private async askModel(prompt: string): Promise<string> {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma3:1b',
      prompt,
      stream: false,
    });

    return response.data.response;
  }

   private async askModelAboutMissingNumber(prompt: string): Promise<number> {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma3:1b',
      prompt,
      stream: false,
    });

    console.log("I am Heare : " , response.data.response)
    return response.data.response;
  }

  private cleanJSON(text: string): string {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  }

//   private parseBudgetValue(text: string): number | null {
//     const cleaned = text.trim().toLowerCase();

//     if (cleaned === 'null') {
//       return null;
//     }

//     const value = Number(cleaned);

//     if (isNaN(value)) {
//       return null;
//     }

//     return value;
//   }

  public async parseUserMessage(userMessage: string): Promise<AgentDecision> {
    const prompt = buildDecisionPrompt(userMessage);
    const rawResponse = await this.askModel(prompt);

    console.log('Raw AI response:', rawResponse);

    try {
      const cleaned = this.cleanJSON(rawResponse);
      const parsed: AgentDecision = JSON.parse(cleaned);

      if (!parsed.intent) {
        throw new BadRequestException('Invalid AI response');
      }

      const handledData = await this.handleMissingData(parsed, userMessage);

      return handledData;
    } catch {
      throw new BadRequestException('Model did not return valid JSON');
    }
  }

  public async chat(userMessage: string, userId: number) {
    const decision = await this.parseUserMessage(userMessage);

    switch (decision.intent) {
      case 'add_product':
        return this.handleAddProduct(decision, userId);

      case 'get_cart':
        return this.handleGetCart(userId);

      case 'search_products':
        return this.handleSearchProducts(decision);

      default:
        return {
          success: false,
          message: 'This intent is not supported yet.',
          decision,
        };
    }
  }

  private async handleAddProduct(decision: AgentDecision, userId: number) {
    if (!decision.productName) {
      throw new BadRequestException('Product name is required');
    }

    const result = await this.productService.findMatchingProducts(
      decision.productName,
    );

    if (result.type === 'none') {
      return {
        success: false,
        message: `No product found with name ${decision.productName}`,
      };
    }

    if (result.type === 'multiple') {
      return {
        success: false,
        message: 'Multiple products found, please choose one',
        options: result.products,
      };
    }

    const product = result.products[0];
    const quantity =
      decision.quantity && decision.quantity > 0 ? decision.quantity : 1;

    for (let i = 0; i < quantity; i++) {
      await this.cartService.addToCart(userId, product.id);
    }

    return {
      success: true,
      message: `${quantity} x ${product.title} added to cart successfully`,
      product,
      quantity,
    };
  }

  private async handleGetCart(userId: number) {
    return this.cartService.getUserCart(userId);
  }

  private async handleSearchProducts(decision: AgentDecision) {
    const products = await this.productService.searchProductsForAi({
      category: decision.category,
      tags: decision.tags,
      minPrice: decision.minPrice,
      maxPrice: decision.maxPrice,
      isLowCalorie: decision.isLowCalorie,
      isVegan: decision.isVegan,
      isSugarFree: decision.isSugarFree,
    });

    return {
      success: true,
      count: products.length,
      products,
      decision,
    };
  }

  private async handleMissingData(
    decision: AgentDecision,
    userMessage: string,
  ): Promise<AgentDecision> {
    if (decision.budget == null) {
      console.log('No Budget');

      const prompt = buildBudgetDetectionPrompt(userMessage);
      const parsedBudget = await this.askModelAboutMissingNumber(prompt);

    //   const parsedBudget = this.parseBudgetValue(rawBudget);

      if (parsedBudget !== null) {
        decision.budget = parsedBudget;
      }
    }

    return decision;
  }
}
