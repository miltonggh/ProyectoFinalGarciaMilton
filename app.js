
//------------------------------------PRE ENTREGA 3-----------------------------------------
//FORMULARIO CLIENTE

// Constantes carga form cliente
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const dni = document.getElementById("dni");
const tipoCliente = document.getElementById("inlineRadio1");



// Constantes para imprimir Datos Cliente y Btn enviar formulario.
const seleccionCliente = document.getElementById("seleccionCliente");
const btnEnviarForm = document.getElementById("btnEnviarForm");

// Evento para imprimir Datos.    
const InfoCliente = btnEnviarForm.addEventListener("submit", function (e) {
    e.preventDefault();
    seleccionCliente.innerHTML= ` 
    Cliente ${nombre.value} ${apellido.value}  con DNI ${dni.value}
    `;
});


//Array Carrito de Compra
const carritoCompra = [];
const carritoCompraServicio = []

// Funcion para crear Items Carrito de Servicios

const contenedorServicios = document.getElementById("contenedorServicios");
const montoCarrito= document.getElementById("montoCarrito")

const carritoServicios = () => {
    //Catpuro datos de archivo data.Json
    const pedirPosts = async () => {
        const res = await fetch("./data.json");
        const servicios = await res.json();

            //Creo Div con servicios del carrito
            servicios.forEach( servicio => {
                const producto = document.createElement("div"); 
                producto.innerHTML = `
                        <div class="card" style="width: 18rem; padding: 20px; margin: 5px; border: solid rgb(53, 25, 25) 3px">
                            <img src="${servicio.img}" class="card-img-top" alt="imagen del serivicio: ${servicio.servicio}">
                            <div class="card-body">
                                <h3 class="card-title">${servicio.servicio}</h3>
                                <p class="card-text">$${servicio.precio}</p>
                                <button class="btn btn-primary" id="btn${servicio.id}">Agregar al carrito</button>
                            </div>
                        </div>
                                    `
                
                contenedorServicios.appendChild(producto);
                
                //Evento en btn Carrito Servicios
                const btnCarrito = document.getElementById(`btn${servicio.id}`);
                btnCarrito.addEventListener("click", () => {
                    carritoCompra.push(servicio.precio)
                    carritoCompraServicio.push(servicio.servicio)

                    //Servicio adquirido a JSON
                    const servicioAdquiridoJson = JSON.stringify(carritoCompraServicio)
                    //Almacena JSON en LocalStorage
                    localStorage.setItem("servicio", servicioAdquiridoJson)

                    //Suma de monto a pagar
                    const totalPagar= carritoCompra.reduce((acumulador, elemento) => acumulador + elemento, 0)
                    
                    //Imprime monto a pagar en cliente común
                    montoCarrito.innerHTML= `
                                <h4>Deberá pagar $${totalPagar}</h4>
                                            `
                    //Imprime monto a pagar en cliente Habitualista. Checkbox
                    var checkbox = document.getElementById('inlineRadio1');
                    checkbox.addEventListener( 'change', function() {
                    if(this.checked) {
                        montoCarrito.innerHTML= `
                        <h4>Deberá pagar $${totalPagar*.8}</h4>
                        <p>Se le aplicó un descuento del 20% por ser cliente Habitualista</p>
                                    `
                        }

                    });

                    //Activa funciones para limpiar carrito.
                    btnCarrito.remove();
                    limpiarCarrito();

                
                })
            })
        }
    pedirPosts() 
    }
    


//Funcion para limpiar Carrito

const btnLimpiarCarrito = document.getElementById("btnLimpiarCarrito")

const limpiarCarrito = () => {
    limpiarHTML2();

    const btnClose = document.createElement("div")
    btnClose.innerHTML = `
                <h3 class="card-title">Limpiar Carrito</h3>
                <button type="button" class="btn-close" aria-label="Close" id="btnCloseCarrito"></button>
                        `
    btnLimpiarCarrito.appendChild(btnClose);

    const btnCloseCarrito = document.getElementById("btnCloseCarrito");
         btnCloseCarrito.addEventListener("click", () => {
            limpiarHTML2()
            limpiarHTML1()
            carritoServicios();   
            carritoCompra = []
         }
         )
}

//Funcion limpiarHTML LimpiarCarrito
const limpiarHTML1 = () => {
    contenedorServicios.innerHTML = "";
    montoCarrito.innerHTML= "";
}

//Funcion limpiarHTML btnLimpiarCarrito
const limpiarHTML2 = () => {
    btnLimpiarCarrito.innerHTML = "";
}

//funcion botón comprar
    //recupero Servicio adquirido del LocalStorage
    const servicioAquiridoAnterior = localStorage.getItem("servicio")
    //convierto JSON a OBJ
    const servicioAnteriorObj = JSON.parse(servicioAquiridoAnterior)
    //Asigna evto con alert para imprimir servicios en LocalStorage
    const btnComprar = document.getElementById("btnComprar")
    btnComprar.addEventListener("click", () => {
    if (carritoCompra.length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...Carrito vacio',
            text: '¡Completá tu compra!',
          })
    } else{

    
        alert(`Adquiriste el/los servicio/s de ${carritoCompraServicio}. \nAnteriormente adquiriste el/los siguiente/s servicio/s: ${servicioAnteriorObj}`)

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Compra confirmada ',
            showConfirmButton: false,
            timer: 1500
            })
        setTimeout(() => {
            location.reload()
        }, 1500);    
    }
})



carritoServicios();