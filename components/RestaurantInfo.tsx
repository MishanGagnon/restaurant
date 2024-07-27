//this is a struct that has info for a specific Restaurant
//should be used throughout program same way

export interface RestaurantInfo {

    restaurant_id: number;
    name: string;
    address: string;
    reviewCount: number;
    image_url: string;
    rating: number;
    categories: string[];
    price: number;
    distance: number;
    location: string;

}