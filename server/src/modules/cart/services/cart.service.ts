import { ApiError } from "../../../core/ApiError";
import { IProductRepository } from "../../product/repositories/product.repository";
import { Cart } from "../models/cart.model";
import { ICartRepository } from "../repositories/cart.repository";

class CartService {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    return cart;
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    // 1. Validate quantity
    if (quantity <= 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }

    // 2. Check product
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // 3. Get user's cart
    let cart = await this.cartRepository.findByUserId(userId);

    // 4. Create cart if it doesn't exist
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    // 5. Check whether product already exists in cart
    const cartItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    // 6. Calculate final quantity
    const newQuantity = cartItem ? cartItem.quantity + quantity : quantity;

    // 7. Check stock against FINAL quantity
    if (newQuantity > product.stock) {
      throw new ApiError(400, "Insufficient stock");
    }

    // 8. Update existing item OR add new item
    if (cartItem) {
      cartItem.quantity = newQuantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    // 9. Persist cart
    const updatedCart = await this.cartRepository.update(userId, cart.items);

    // 10. Repository may return null
    if (!updatedCart) {
      throw new ApiError(500, "Failed to update cart");
    }

    return updatedCart;
  }
}
