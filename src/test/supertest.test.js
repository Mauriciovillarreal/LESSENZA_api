const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('https://lessenza.onrender.com:8080')

describe('Test avanzado de Products', () => {

    it('El endpoint POST /api/products debe crear un producto correctamente', async () => {
        const productMock = {
            brands: 'Marca1',
            name: 'Nombre1',
            description: 'Descripcion1',
            code: 'Codigo1',
            price: 520000,
            status: true,
            stock: 6,
            category: 'Categoria2',
            thumbnails: 'img_ruta',
        }
        const { _body } = await requester.post('/api/products').send(productMock)
        expect(_body).to.have.property('data')
        expect(_body.data).to.have.property('name', 'Nombre1')
    })

    it('El endpoint GET /api/products debe traer todos los productos correctamente', async () => {
        const {
            statusCode,
            ok,
        } = await requester.get('/api/products')
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
    })


    it('El endpoint GET /api/products/:pid debe traer un producto correctamente', async () => {
        const productMock = {
            brands: 'MarcaTest',
            name: 'ProductoTest',
            description: 'DescripcionTest',
            code: 'CodigoTest',
            price: 100000,
            status: true,
            stock: 10,
            category: 'CategoriaTest',
            thumbnails: 'img_test',
        }
        const { _body: postBody } = await requester.post('/api/products').send(productMock)
        const pid = postBody.data._id
        const { _body } = await requester.get(`/api/products/${pid}`)

        expect(_body).to.have.property('data');
        expect(_body.data).to.have.property('_id', pid);
    })
})

describe('Test avanzado de Carts', () => {

    it('El endpoint POST /api/carts debe crear un carrito correctamente', async () => {
        const { _body } = await requester.post('/api/carts')
        expect(_body).to.have.property('_id');
    })

    it('El endpoint POST /api/carts/:cid/product/:pid debe agregar un producto al carrito correctamente', async () => {
        const { _body: cartBody } = await requester.post('/api/carts')
        const cid = cartBody._id
        const productMock = {
            brands: 'MarcaTest',
            name: 'ProductoParaAgregar',
            description: 'DescripcionTest',
            code: 'CodigoTest2',
            price: 100000,
            status: true,
            stock: 10,
            category: 'CategoriaTest',
            thumbnails: 'img_test',
        }
        const { _body: productBody } = await requester.post('/api/products').send(productMock)
        const pid = productBody.data._id
        const { statusCode, 
                ok, 
                _body 
        } = await requester.post(`/api/carts/${cid}/product/${pid}`)  
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        expect(_body).to.have.property('_id')
        expect(_body.products).to.be.an('array').that.is.not.empty
        expect(_body.products[0]).to.have.property('product')
        expect(_body.products[0].product).to.have.property('_id', pid)
    })

    it('El endpoint DELETE /api/carts/:cid/products/:pid debe eliminar un producto', async () => {
        const { _body: cartBody } = await requester.post('/api/carts');
        const cid = cartBody._id;
        const productMock = {
            brands: 'MarcaTest',
            name: 'ProductoParaEliminar',
            description: 'DescripcionTest',
            code: 'CodigoTest3',
            price: 100000,
            status: true,
            stock: 10,
            category: 'CategoriaTest',
            thumbnails: 'img_test',
        };
        const { _body: productBody } = await requester.post('/api/products').send(productMock);
        const pid = productBody.data._id;
        await requester.post(`/api/carts/${cid}/product/${pid}`);
        const { statusCode: deleteStatus,
                ok: deleteOk, 
                _body: deleteBody 
        } = await requester.delete(`/api/carts/${cid}/products/${pid}`);
        expect(deleteOk).to.be.equal(true)
        expect(deleteStatus).to.be.equal(200)
        expect(deleteBody).to.have.property('message').that.equals('Product deleted successfully')
        const { statusCode: getStatus, _body: getBody } = await requester.get(`/api/carts/${cid}`)
        expect(getStatus).to.be.equal(200);
        expect(getBody.products).to.be.an('array').that.is.empty;
    })
})

describe('Test avanzado de Session', async () => {

    let cookie

    it('El endpoint POST /api/sessions/register debe registar un usuario correctamente', async () => {
        const userMock = {
            first_name: 'Usuario',
            last_name: 'Test',
            password: '123456',
            email: 'usuarioTest@email.com',
        }
        const { statusCode, ok } = await requester.post('/api/sessions/register').send(userMock)
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
    })

    it('El endpoint POST api/sessions/login debe loguear correctamente a un usuario y devolver una cookie', async () => {
        const userLogin = {
            email: 'usuarioTest@email.com',
            password: '123456'
        }
        const response = await requester.post('/api/sessions/login').send(userLogin)
        expect(response.statusCode).to.be.equal(200)
        const cookies = response.headers['set-cookie']
        expect(cookies).to.exist
        expect(cookies[0]).to.include('connect.sid') 
        cookie = {
            name: cookies[0].split('=')[0],
            value: cookies[0].split('=')[1].split(';')[0]
        }
    })

    it('El endpoint GET /api/sessions/current debe enviar la cookie que contiene el usuario y destructurar este correctamente', async () => {
        const response = await requester.get('/api/sessions/current').set('Cookie', `${cookie.name}=${cookie.value}`)
        expect(response.statusCode).to.be.equal(200)        
        const user = response.body.user 
        expect(user).to.have.property('first_name')
        expect(user).to.have.property('last_name')
        expect(user).to.have.property('email')
    })
})