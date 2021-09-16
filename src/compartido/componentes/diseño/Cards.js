import React from 'react';
import CardItem from './CardItem';
import './Cards.css';

function Cards() {
    return (
        <div className="cards">
            <h1>Conoce que es EASY</h1>
            <div className="cards__container">
                <div className="cards__wrapper">
                    <ul className="cards__items">
                        <CardItem 
                            srcs="/images/img-9.jpg"
                            text="Explore the hidden waterfall deep inside the Amazon Jungle"
                            label="Adventure"
                            path="/services"
                            alts="Facturacion"
                        />

                        <CardItem 
                            srcs="/images/img-2.jpg"
                            text="Travel through the Island of Bali in a Private Cruise"
                            label="Luxury"
                            path="/services"
                            alts="Inventario"
                        />
                    </ul>
                    <ul className='cards__items'>
                        <CardItem
                            srcs='images/img-3.jpg'
                            text='Set Sail in the Atlantic Ocean visiting Uncharted Waters'
                            label='Mystery'
                            path='/services'
                            alts="Informes"
                        />
                        <CardItem
                            srcs='images/img-4.jpg'
                            text='Experience Football on Top of the Himilayan Mountains'
                            label='Adventure'
                            path='/products'
                            alts="Clientes"
                        />
                        <CardItem
                            srcs='images/img-8.jpg'
                            text='Ride through the Sahara Desert on a guided camel tour'
                            label='Adrenaline'
                            path='/sign-up'
                            alts="Productos"
                        />
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Cards
