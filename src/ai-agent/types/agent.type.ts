export type AgentIntent =
  | 'add_product'
  | 'get_cart'
  | 'search_products'
  | 'build_cart'
  | 'unknown';

export interface AgentDecision {
  intent: AgentIntent;
  productName?: string;
  quantity?: number;
  budget?: number;
  category?: string;
  tags?: string[];
  maxPrice?: number;
  minPrice?: number;
  isLowCalorie?: boolean;
  isVegan?: boolean;
  isSugarFree?: boolean;
}
