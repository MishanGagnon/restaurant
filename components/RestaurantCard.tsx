import React, { useState } from 'react'
import { RestaurantInfo } from './RestaurantInfo'
import Image from 'next/image'


interface CardProps {
    props: RestaurantInfo
}

function RestaurantCard({ props }: CardProps) {
    const { name, address, reviewCount, image_url, rating, categories, price, distance, location } = props;

    const priceSigns = '$'.repeat(price)

    return (
        <div>
            <Image src={image_url} alt={`Image of ${name}`} width={300} height={200} />
            <div id="restaurant-content">
                <h1 id="restuarant-name">{name} <span id='restaurant-price'>{priceSigns}</span></h1>
                <h2 id="restaurant-location">{location}</h2>
                <h3 id='restaurant-rating'>{rating} ⭐<span id="restaurant-review-count">{reviewCount} </span></h3>
                <h3 id="restaurant-address">{address}</h3>
                <p id='restaurant-distance'>{distance}</p>
                {categories.map((category) => (
                    <p id='category'>{category}</p>
                ))}
            </div>
        </div>
    )
}

export default RestaurantCard;

