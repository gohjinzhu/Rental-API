const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

//property => rental
//https://www.carousell.sg/property-for-sale/h-377?t-id=26418562_1656898495426&t-source=top_navigation_bar
//property => rental => room rental
//https://www.carousell.sg/property-for-rent/room-rental/?searchId=yXFOuN
//property => rental => HDB
//https://www.carousell.sg/property-for-rent/hdb/?searchId=cAF8Eu

const _carousell = {
    name: 'carousell',
    address: 'https://www.carousell.sg/categories/property-102/rent-in-singapore-229/room-rentals-1587/?addRecent=false&canChangeKeyword=false&includeSuggestions=false&sc=0a0208281a0408bbe1722a170a0b636f6c6c656374696f6e7312060a043135383778013204080378013a02180742060801100118004a0620012801400150005a020801&searchId=GysMR9&sort_by=3',
    base: 'https://www.carousell.sg'
}
const _99co = {
    name: '99co',
    address: 'https://www.99.co/singapore/rent?listing_type=rent&map_bounds=1.5827095153768858%2C103.49449749970108%2C1.1090706240313446%2C104.12483807587296&page_num=1&page_size=35&property_segments=residential&query_coords=1.3039947%2C103.8298507&query_limit=radius&query_type=city&radius_max=1000&rental_type=&show_cluster_preview=true&show_description=true&show_internal_linking=true&show_meta_description=true&show_nearby=true&sort_field=recency&sort_order=desc&zoom=11',
    base: 'https://www.99.co'
}
const listing = {};

axios.get(_99co.address)
    .then(async(response) => {
        const html = response.data
        const $ = cheerio.load(html)
        const lastPage = $('ul.SearchPagination-links > li:nth-last-child(2) > a').text()
        if (parseInt(lastPage) === NaN) console.log(`${lastPage} is not a number`)

        for (i = 1; i <= lastPage; i++) {
            let currentPage = i;
            let currentListing = [];
            let title;
            let price;
            let url;
            await axios.get(`https://www.99.co/singapore/rent?listing_type=rent&map_bounds=1.5827095153768858%2C103.49449749970108%2C1.1090706240313446%2C104.12483807587296&page_num=${i}&page_size=35&property_segments=residential&query_coords=1.3039947%2C103.8298507&query_limit=radius&query_type=city&radius_max=1000&rental_type=&show_cluster_preview=true&show_description=true&show_internal_linking=true&show_meta_description=true&show_nearby=true&sort_field=recency&sort_order=desc&zoom=11`)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    $('a._3Ajbv._30I97._1vzK2').each(function () {
                        title = $(this).text();
                        url = $(this).attr('href')
                        currentListing.push({
                            title,
                            url: _99co.base + url
                        })
                        listing[currentPage] = currentListing
                    })
                    $('p._2sIc2.JlU_W._2rhE-').each(function (index) {
                        price = $(this).text();
                        listing[currentPage][index]['price'] = price;
                    })        
            })
        }
        console.log(listing)
    })



app.get('/', (req, res) => {
    res.json(`Welcome to my page`)
})

app.get('/rental', (req, res) => {
    res.json(listing)

})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))