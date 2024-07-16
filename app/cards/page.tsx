import React from 'react';
import RestaurantCard from '@/components/RestaurantCard';
import { RestaurantInfo } from '@/components/RestaurantInfo';

const sampleRestaurantInfo: RestaurantInfo[] = [
  {
    restaurant_id: 1,
    name: "asdasdasd",
    address: "dick and balls",
    reviewCount: 6969,
    image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/iA1PwGvQDUDqA6aLG4npsg/o.jpg",
    rating: 4.0,
    categories: ["Dick", "Balls"],
    price: 4,
    distance: 1.123123,
    location: "Eatery"
  },
  {
    restaurant_id: 2,
    name: "asd",
    address: "dasda",
    reviewCount: 123123,
    image_url: "https://s3-media1.fl.yelpcdn.com/bphoto/PFIMSXBQ6Yc2-nc5bHfxTA/o.jpg",
    rating: 3.0,
    categories: ["Dick", "Balls"],
    price: 3,
    distance: 1.23,
    location: "Eatery"
  }


];

function TestRestaurantCard() {
  return (
    <div style={{ padding: '20px' }}>
      {sampleRestaurantInfo.map((e) => (
        <RestaurantCard props={e} />
      ))}
    </div>
  );
}

export default TestRestaurantCard;
