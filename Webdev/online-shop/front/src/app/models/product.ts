export interface Product {
  id?: number; // Optional property for id, as it may not be present in some cases
  name: string; // Name of the product
  description: string; // Description of the product
  price: number; // Price of the product
  category: number; // Category ID of the product
  main_image: string; // URL of the main image of the product
  type_sport: string; // Type of sport associated with the product
  images: string[]; // Array of image URLs associated with the product
  quantity: number; // Quantity available for the product
  is_active: boolean; // Indicates if the product is active or not
}
