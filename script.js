let container = document.querySelector('.container')
let carrito = JSON.parse(localStorage.getItem('carrito')) ?? []
let total = document.getElementById('total')
let contadorCarrito = document.getElementById('contadorCarrito')
let contador = carrito.reduce((acc, ite) => acc + ite.cantidad, 0)
let btnVaciarCarrito = document.getElementById('vaciarCarrito')

let categorias = document.querySelector('.btn-group-vertical')

let botonCarrito = document.querySelector('boton-carrito')
let btnComprar = document.querySelector('#btn-comprar')
let compra = document.querySelector('#finalizar-compra')


//Muestro los productos en el html
fetch("./productos.json")
    .then((response) => response.json())
    .then((menu) => {
        mostrarProductos(menu)
        mostrarEnCarrito()
        seleccionarCategoria(menu)
        buscador(menu)
    })


//Función para verificar si hay productos en el carrito. 
//De no haber deshabilita el boton para finalizar la compra
const existeProducto = () => {
    if (carrito.length >= 1){
        contadorCarrito.textContent = contador
        document.querySelector('#btn-comprar').removeAttribute('disabled')
    }else{
        document.querySelector('#btn-comprar').setAttribute('disabled','true')
    }
}


//Funcion que muestra las cards de productos en el html
const mostrarProductos = (lista) => {
    mostrarEnCarrito()
    lista.forEach(producto => {
        container.innerHTML += `
        <div class="card text-white bg-secondary m-3" id="comida${producto.id}">
        <div>
            <img class="imgComida" src="${producto.imagen}">
        </div>
        <div class="card-header">
            <h5 class="card-title mb-3">${producto.nombre}</h5>
        </div>
        <div class="card-body">
            <h6>Precio: $${producto.precio}</h6>
            <button type="button" class="btn btn-primary" id="agregar${producto.id}">Agregar al carrito</button>
        </div>
    </div>
    `
    })
    agregarProducto(lista)
    existeProducto()
}


//Función para agregar los productos al carrito (localStorage)
const agregarProducto = (lista) => {
    lista.forEach(producto => {
        document.getElementById(`agregar${producto.id}`).addEventListener('click', () => {
            let productoCarrito = carrito.find(prodCarrito => prodCarrito.id == producto.id)

            if (productoCarrito) {
                productoCarrito.cantidad++
                contador++
                contadorCarrito.textContent = contador
                mostrarEnCarrito()
            } else {
                carrito.push(producto)
                contador++
                contadorCarrito.textContent = contador
                mostrarEnCarrito()
            }
            localStorage.setItem("carrito", JSON.stringify(carrito))
            existeProducto()
        })
    })
}


//Función para mostrar las cards por categoria en el html
const seleccionarCategoria = (lista) => {
    document.querySelectorAll('.boton-categoria').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('id')
            if (id === "todos") {
                container.innerHTML = ""
                mostrarProductos(lista)
            } else {
                let filtrado = lista.filter(producto => id === producto.categoria)
                container.innerHTML = ""
                mostrarProductos(filtrado)
            }
        })
    })
}


//Función del buscador de productos (input) y muestro cards en html
const buscador = (lista) => {
    document.querySelector('.buscador').addEventListener('input', () => {
        let stringIngresado = document.querySelector('.buscador').value
        let filtrado = lista.filter(producto => producto.nombre.includes(stringIngresado.toLowerCase()))
        container.innerHTML = ""
        mostrarProductos(filtrado)
        agregarProducto(filtrado)
    })
}


//Función para mostrar los productos en el carrito
const mostrarEnCarrito = () => {
    modal.innerHTML = `
    <div class="encabezado">
    <p> </p>    
    <p>PRODUCTO</p>
        <p>CANTIDAD</p>
        <p>PRECIO</p>
        <p>SUBTOTAL</p>
    </div>
    `
    carrito.forEach(producto => {
        modal.innerHTML += `
        <div class="card-shop" id="comida${producto.id}">
                <div><img class="img-shop" src="${producto.imagen}"></div>   
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">
                    <button id="${producto.id}" class="aumentar">+</button>
                    <span class="cantidad">${producto.cantidad}</span>
                    <button id="${producto.id}"class="disminuir">-</button>
                </p>    
                <p class="card-text">$${producto.precio * producto.cantidad}</p>
                <p class="card-text">$${producto.precio}</p>
                <button id="${producto.id}" type="button" class="botonEliminar btn-secondary disabled" aria-label="Close">X</button>
                </div>
        
        `
        document.querySelectorAll('.botonEliminar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const botonId = e.target.getAttribute('id')
                eliminarProducto(botonId)
            })
        })

        document.querySelectorAll('.aumentar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const aumentarId = e.target.getAttribute('id')
                aumentar(aumentarId)
            })
        })

        document.querySelectorAll('.disminuir').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const disminuirId = e.target.getAttribute('id')
                disminuir(disminuirId)
            })
        })
    })
    total.innerText = `TOTAL $${calcularTotal()}`
    vaciarCarrito()
    comprar()
}

//Función para aumentar la cantidad de productos
const aumentar = (id) => {
    elemento = carrito.find(prod => prod.id == id)
    elemento.cantidad++
    contador++
    contadorCarrito.textContent = contador
    localStorage.setItem('carrito', JSON.stringify(carrito))
    mostrarEnCarrito()
}

//Función para disminuir la cantidad de productos
const disminuir = (id) => {
    elemento = carrito.find(prod => prod.id == id)
    if (elemento.cantidad > 1) {
        elemento.cantidad--
        contador--
        contadorCarrito.textContent = contador
        localStorage.setItem('carrito', JSON.stringify(carrito))
        mostrarEnCarrito()
    } else {
        if(carrito.length == 1 && elemento.cantidad == 1){
            contador = ""
            contadorCarrito.textContent = contador
            eliminarProducto(id)
            document.querySelector('#btn-comprar').setAttribute('disabled','true')
        }else {
            contador--
            contadorCarrito.textContent = contador
            eliminarProducto(id)
        }
    }
    existeProducto()
}

//Función para eliminar producto del carrito
const eliminarProducto = (id) => {
    indice = carrito.findIndex(prod => prod.id == id)
    carrito.splice(indice, 1)
    localStorage.setItem('carrito', JSON.stringify(carrito))
    mostrarEnCarrito()
    if(carrito.length == 0){
        contador = ""
        contadorCarrito.textContent = contador
        document.querySelector('#btn-comprar').setAttribute('disabled','true')
    }else{
        contador--
        contadorCarrito.textContent = contador
    }
    existeProducto()
}


//Función para calcular el total
const calcularTotal = () => {
    return carrito.reduce((acc, ite) => acc + ite.precio * ite.cantidad, 0)
}


//Función para finalizar la compra
const comprar = () => {
    document.querySelector('#btn-comprar').addEventListener('click', () => {
        Swal.fire(
            '¡Su compra fue efectuada exitosamente!',
            'Gracias por su compra',
            'success'
        )
        carrito.splice(0, carrito.length)
        mostrarEnCarrito()
        contador = ""
        contadorCarrito.textContent = contador
        localStorage.setItem("carrito", JSON.stringify(carrito))
        existeProducto()
    })
    
}


//Función para vaciar el carrito. Hago uso  de la libreria Sweet Alert
const vaciarCarrito = () => {
    btnVaciarCarrito.addEventListener('click', () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: '¿Estas seguro que queres vaciar el carrito?',
            text: "Perderas todos tus productos elegidos",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, quiero vaciarlo',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Has vaciado el carrito',
                    'Ya no tienes productos en el carrito',
                    'success'
                )
                //Vacio el carrito
                modal.innerHTML = ""
                let num = carrito.length
                carrito.splice(0, num)
                localStorage.setItem("carrito", JSON.stringify(carrito))
                mostrarEnCarrito()
                contador = ""
                contadorCarrito.textContent = contador
                existeProducto()
            }
        })
    })
}