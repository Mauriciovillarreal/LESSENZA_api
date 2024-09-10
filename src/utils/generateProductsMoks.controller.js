const { faker } = require('@faker-js/faker')

function generateProducts() {
    return {
        _id: faker.string.uuid(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        imageUrl: faker.image.imageUrl(),
        stock: faker.number.int({ min: 0, max: 100 })
    }
}

module.exports = generateProducts
