// ==UserScript==
// @name         Remove Spelled Items Listings on Backpack.tf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove listings that are made for spelled items (works for buy orders only)
// @author       Viridian
// @match        *://backpack.tf/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to check for keywords in a string
    const containsKeyword = (str, keywords) => keywords.some(keyword => str.includes(keyword));

    // Function to create a DOM element with options
    const createElement = (type, options = {}) => {
        const element = document.createElement(type);
        Object.assign(element, options);
        return element;
    };

    // Function to toggle display for a listing
    const toggleDisplay = (listing, displayStatus) => listing.style.display = displayStatus;

    // Function to check if all listings are hidden
    const areAllListingsHidden = (mediaList, index) => {
        const lists = document.querySelectorAll(mediaList);
        if (lists.length > index) {
            const liElements = lists[index].querySelectorAll('li');
            return liElements.length === 0 || Array.from(liElements).every(li => li.style.display === 'none');
        }
        return false;
    };

    const keywords = ["Horseshoes/Rotten Orange", "CC/SS", "Only HH", "RO FP", "HEADLESS HORSESHOES", "SPECTRAL SPECTRUM", "𝗛𝗲𝗮𝗱𝗹𝗲𝘀𝘀 𝗛𝗼𝗿𝘀𝗲", "𝐬𝐩𝐞𝐥𝐥𝐞𝐝", "SPELLS", "𝗦𝗽𝗲𝗹𝗹", "SPELL"];
    const listings = document.querySelectorAll('li.listing');
    const removedListings = [];

    // Loop through and hide listings that match keywords
    listings.forEach(listing => {
        const commentElement = listing.querySelector('[data-listing_comment]');
        if (commentElement) {
            const comment = commentElement.getAttribute('data-listing_comment');
            if (containsKeyword(comment, keywords)) {
                toggleDisplay(listing, 'none');
                removedListings.push(listing);
            }
        }
    });

    // If no listings were removed, exit the function
    if (removedListings.length === 0) return;

    // Create UI for removed listings
    const flexContainer = createElement('div');
    flexContainer.style.display = 'flex';
    flexContainer.style.justifyContent = 'space-between';

    const removedText = createElement('p');
    removedText.textContent = `${removedListings.length} spelled items were hidden.`;
    removedText.style.fontWeight = 'bold';

    const toggleButton = createElement('button');
    toggleButton.textContent = 'Toggle Spelled Items';

    toggleButton.onclick = () => removedListings.forEach(listing => toggleDisplay(listing, listing.style.display === 'none' ? 'flex' : 'none'));

    flexContainer.append(removedText, toggleButton);

    const mediaLists = Array.from(document.querySelectorAll('.media-list'));
    const secondMediaList = mediaLists[1];

    if (areAllListingsHidden('.media-list', 1)) {
        const noItemsLeftText = createElement('p', { textContent: 'All of the items on this page were spelled. :(' });
        secondMediaList.appendChild(noItemsLeftText);
    }

    secondMediaList.insertBefore(flexContainer, secondMediaList.firstChild);
})();
