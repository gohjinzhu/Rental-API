if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const PORT = process.env.PORT
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const _rentInSingapore = {
    name: 'Rent In Singapore',
    address: 'https://rentinsingapore.com.sg/properties-for-rent/newest',
    baseUrl: 'https://rentinsingapore.com.sg',
    listing: {}
}
const _99co = {
    name: '99.co',
    address: 'https://www.99.co/singapore/rent?listing_type=rent&map_bounds=1.5827095153768858%2C103.49449749970108%2C1.1090706240313446%2C104.12483807587296&page_num=1&page_size=35&property_segments=residential&query_coords=1.3039947%2C103.8298507&query_limit=radius&query_type=city&radius_max=1000&rental_type=&show_cluster_preview=true&show_description=true&show_internal_linking=true&show_meta_description=true&show_nearby=true&sort_field=recency&sort_order=desc&zoom=11',
    baseUrl: 'https://www.99.co',
    listing: {}
}
const _propertyGuru = {
    name: 'Property Guru',
    address: 'https://www.propertyguru.com.sg/property-for-rent?listing_posted=14&search=true&sort=date&order=desc',
    baseUrl: '',
    listing: {}
}

axios.get(_rentInSingapore.address)
    .then(async (response) => {
        const html = response.data
        const $ = cheerio.load(html)
        const lastPage = $('nav.pagination > a:nth-last-child(2)').text()
        if (parseInt(lastPage) === NaN) console.log(`${lastPage} is not a number`)
        console.log(lastPage)

        for (i = 1; i <= 5; i++) {
            let currentPage = i;
            let currentListing = [];
            let title;
            let price;
            let url;
            
            await axios.get(`https://rentinsingapore.com.sg/properties-for-rent/page-${currentPage}/newest`)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    $('div.listing-container__details > div.listing-container__wrapper > div.pull-left > h3.room-sublocation').each(function () {
                        title = $(this).text();
                        currentListing.push({
                            title,
                        })
                        _rentInSingapore.listing[currentPage] = currentListing
                    })

                    $('div.room__wide.listing-container > a.room-link').each(function (index) {
                        const url = _rentInSingapore.baseUrl + $(this).attr('href')
                        _rentInSingapore.listing[currentPage][index]['url'] = url;
                    })

                    $('a.room-link > figure div.visible-xs > img.lazyload').each(function (index) {
                        const image = $(this)
                        const imageUrl = (image[0].attribs['data-srcset'])
                        _rentInSingapore.listing[currentPage][index]['coverImage'] = imageUrl;
                    })

                    $('div.listing-container__details > div.listing-container__wrapper > div.pull-right > div.room-price').each(function (index) {
                        price = $(this).text();
                        _rentInSingapore.listing[currentPage][index]['price'] = price;
                    })
                })
        }
    })

// axios.get(_99co.address)
//     .then(async (response) => {
//         const html = response.data
//         const $ = cheerio.load(html)
//         const lastPage = $('ul.kiAZx > li:nth-last-child(2) > a').text()
//         if (parseInt(lastPage) === NaN) console.log(`${lastPage} is not a number`)
//         console.log(lastPage)

//         for (i = 1; i <= 1; i++) {
//             let currentPage = i;
//             let currentListing = [];
//             let title;
//             let price;
//             let url;
//             await axios.get(`https://www.99.co/singapore/rent?listing_type=rent&map_bounds=1.5827095153768858%2C103.49449749970108%2C1.1090706240313446%2C104.12483807587296&page_num=1&page_size=35&path=%2Fsingapore%2Frent&property_segments=residential&query_coords=1.3039947%2C103.8298507&query_limit=radius&query_type=city&radius_max=1000&rental_type=unit&show_cluster_preview=true&show_description=true&show_internal_linking=true&show_meta_description=true&show_nearby=true&sort_field=recency&sort_order=desc&zoom=11`)
//                 .then(response => {
//                     const html = response.data
//                     console.log(html)
//                     const $ = cheerio.load(html)
//                     $('a._3Ajbv._30I97._1vzK2').each(function () {
//                         title = $(this).text();
//                         url = $(this).attr('href')
//                         currentListing.push({
//                             title,
//                             url: _99co.base + url
//                         })
//                         _99co.listing[currentPage] = currentListing
//                     })

//                     $('div.listing-card div.gallery-container > a > ul >li:nth-child(1)>img').each(function (index) {
//                         image = $(this).attr('src');
//                         listing[currentPage][index]['coverImage'] = image;
//                     })

//                     $('p._2sIc2.JlU_W._2rhE-').each(function (index) {
//                         price = $(this).text();
//                         listing[currentPage][index]['price'] = price;
//                     })
//                 })
//         }
//         console.log(listing)
//     })

// axios.get(_propertyGuru.address)
//     .then(async (response) => {
//         const html = response.data
//         const $ = cheerio.load(html)
//         const lastPage = $('ul.pagination > li:nth-last-child(2) > a').text()
//         if (parseInt(lastPage) === NaN) console.log(`${lastPage} is not a number`)
//         console.log(html)

//         for (i = 1; i <= 1; i++) {
//             let currentPage = i;
//             let currentListing = [];
//             let title;
//             let price;
//             let url;
//             await axios.get(`https://www.propertyguru.com.sg/property-for-rent/${currentPage}?listing_posted=14&order=desc&search=true&sort=date`)
//                 .then(response => {
//                     const html = response.data
//                     console.log(html)
//                     const $ = cheerio.load(html)
//                     $('div.listing-description > .header-wrapper > .header-container > h3 > a.nav-link').each(function () {
//                         title = $(this).text();
//                         url = $(this).attr('href')
//                         currentListing.push({
//                             title,
//                             url: _99co.base + url
//                         })
//                         _propertyGuru.listing[currentPage] = currentListing
//                     })

//                     $('div.listing-card div.gallery-container > a > ul >li:nth-child(1)>img').each(function (index) {
//                         image = $(this).attr('src');
//                         _propertyGuru.listing[currentPage][index]['coverImage'] = image;
//                     })

//                     $('li.list-price > span.price').each(function (index) {
//                         price = $(this).text();
//                         _propertyGuru.listing[currentPage][index]['price'] = price;
//                     })
//                 })
//         }
//         console.log(listing)
//     })



app.get('/', (req, res) => {
    res.json(`Welcome to my page`)
})

app.get('/all', (req, res) => {
    res.json({
        _rentInSingapore: _rentInSingapore.listing,
        _99co: _99co.listing,
        _propertyGuru: _propertyGuru.listing
    })
})

app.get('/rental/rentinsingapore', (req, res) => {
    res.json(_rentInSingapore.listing)
})

app.get('/rental/99co', (req, res) => {
    res.json(_99co.listing)
})

app.get('/rental/propertyGuru', (req, res) => {
    res.json(_propertyGuru.listing)
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))