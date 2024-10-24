document.getElementById('guardar').addEventListener('click', async function() {
    const identificacion = document.getElementById('identificacion').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const genero = document.getElementById('genero').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const email = document.getElementById('email').value;

    const data = {
        identificacion: identificacion,
        nombres: nombres,
        apellidos: apellidos,
        genero: genero,
        fechaNacimiento: fechaNacimiento,
        email: email
    };

    try {
        // Verificar si el registro ya existe en la base de datos
        const existeRegistro = await verificarExistenciaRegistro(identificacion);
        
        if (existeRegistro) {
            alert('El registro ya existe en la base de datos.');
        } else {
            // Si el registro no existe, enviar la solicitud para guardarlo
            const response = await fetch('/guardarDatos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Registro exitoso.');
                document.getElementById('formulario').reset();
            } else {
                throw new Error('Error al guardar los datos.');
            }
        }
    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor. Por favor, inténtelo de nuevo.');
    }
});

// Función para verificar si el registro ya existe en la base de datos
async function verificarExistenciaRegistro(identificacion) {
    try {
        const response = await fetch(`/consultarPersona/${identificacion}`);
        if (response.ok) {
            // Si la consulta tiene éxito, significa que el registro existe
            return true;
        } else {
            // Si no se encuentra el registro, devuelve false
            return false;
        }
    } catch (error) {
        // Si hay algún error en la consulta, devuelve false
        return false;
    }
}

document.getElementById('consultar').addEventListener('click', async function() {
    // Obtener el valor de identificación del campo correspondiente
    const identificacion = document.getElementById('identificacion').value;

    try {
        const response = await fetch(`/consultarPersona/${identificacion}`); // Incluir identificación en la URL
        if (response.ok) {
            const data = await response.json();
            console.log('Datos consultados:', data);
            // Actualizar los campos del formulario con los datos consultados
            document.getElementById('nombres').value = data.nombres;
            document.getElementById('apellidos').value = data.apellidos;
            document.getElementById('genero').value = data.genero;
            document.getElementById('fechaNacimiento').value = data.fechaNacimiento;
            document.getElementById('email').value = data.email;

            // Bloquear los campos del formulario
            document.getElementById('identificacion').readOnly = true;
            document.getElementById('nombres').readOnly = true;
            document.getElementById('apellidos').readOnly = true;
            document.getElementById('genero').disabled = true;
            document.getElementById('fechaNacimiento').readOnly = true;
            document.getElementById('email').readOnly = true;
        } else {
            throw new Error('Error al consultar los datos.');
        }
    } catch (error) {
        console.error(error);
        alert('Persona no encontrada en la base de datos.');
    }
});

document.getElementById('eliminar').addEventListener('click', async function() {
    const identificacion = document.getElementById('identificacion').value;

    try {
        // Consultar si la persona existe antes de intentar eliminarla
        const responseConsulta = await fetch(`/consultarPersona/${identificacion}`);
        if (!responseConsulta.ok) {
            // Si la consulta falla, mostrar mensaje de error
            throw new Error('La persona no existe.');
        }

        // Si la consulta tiene éxito, proceder con la eliminación
        const responseEliminar = await fetch(`/eliminarPersona/${identificacion}`, {
            method: 'DELETE'
        });

        if (responseEliminar.ok) {
            alert('Persona eliminada correctamente.');
            document.getElementById('formulario').reset();
        } else {
            throw new Error('Error al eliminar la persona.');
        }
    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor. Por favor, inténtelo de nuevo.');
    }
});

document.getElementById('actualizar').addEventListener('click', async function() {
    const identificacion = document.getElementById('identificacion').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const genero = document.getElementById('genero').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const email = document.getElementById('email').value;

    document.getElementById('identificacion').readOnly = true;
    document.getElementById('nombres').readOnly = false;
    document.getElementById('apellidos').readOnly = false;
    document.getElementById('genero').disabled = false;
    document.getElementById('fechaNacimiento').readOnly = false;
    document.getElementById('email').readOnly = false;

    const data = {
        nombres: nombres,
        apellidos: apellidos,
        genero: genero,
        fechaNacimiento: fechaNacimiento,
        email: email
    };

    try {
        const response = await fetch(`/actualizarPersona/${identificacion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Actualización exitosa.');
            document.getElementById('formulario').reset();
        } else {
            throw new Error('Error al actualizar los datos.');
        }
    } catch (error) {
        console.error(error);
        alert('Persona no encontrada en la base de datos');
    }
});
