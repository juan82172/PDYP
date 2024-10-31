const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
//const PORT = 3000;
const PORT = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;
//const url = 'mongodb+srv://juanalvarez82172:juansantiago1.$@personas.c6bev.mongodb.net/?retryWrites=true&w=majority&appName=Personas';
const dbName = 'Usuario';
const collectionName = 'Personas';
const path = require('path');

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });



app.use(express.static('assets'));
app.use(express.static('controlador'));
app.use('/modelo', express.static(path.join(__dirname, 'modelo')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Ruta para guardar los datos en MongoDB
app.post('/guardarDatos', async (req, res) => {
    const data = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Conexión exitosa a MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(data);
        console.log('Datos guardados en MongoDB:', result.insertedId);

        res.status(200).send('Datos guardados correctamente en MongoDB.');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        res.status(500).send('Error al conectar con MongoDB. Por favor, inténtelo de nuevo.');
    } finally {
        await client.close();
    }
});

app.get('/consultarPersona/:identificacion', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Conexión exitosa a MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Obtener la identificación de la persona desde los parámetros de la solicitud
        const identificacion = req.params.identificacion;
        console.log(identificacion);

        // Consultar en la base de datos solo los datos de la persona con la identificación proporcionada
        const persona = await collection.findOne({ identificacion: identificacion });
        
        if (persona) {
            console.log('Datos de la persona consultados en MongoDB:', persona);
            // Envía los datos de la persona consultada como respuesta
            res.status(200).json(persona);
        } else {
            // Si no se encuentra ninguna persona con la identificación proporcionada, responder con un mensaje
            res.status(404).send('Persona no encontrada');
        }
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        res.status(500).send('Error al conectar con MongoDB. Por favor, inténtelo de nuevo.');
    } finally {
        await client.close();
    }
});

app.delete('/eliminarPersona/:identificacion', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Conexión exitosa a MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Obtener la identificación de la persona desde los parámetros de la solicitud
        const identificacion = req.params.identificacion;

        // Consultar si la persona existe
        const persona = await collection.findOne({ identificacion: identificacion });
        
        if (!persona) {
            // Si la persona no existe, responder con un mensaje de error
            res.status(404).send('Persona no encontrada');
            return;
        }

        // Si la persona existe, proceder con la eliminación
        const result = await collection.deleteOne({ identificacion: identificacion });

        if (result.deletedCount === 1) {
            console.log('Persona eliminada de MongoDB:', identificacion);
            res.status(200).send('Persona eliminada correctamente.');
        } else {
            // Si no se encuentra ninguna persona con la identificación proporcionada, responder con un mensaje
            res.status(404).send('Persona no encontrada');
        }
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        res.status(500).send('Error al conectar con MongoDB. Por favor, inténtelo de nuevo.');
    } finally {
        await client.close();
    }
});

app.put('/actualizarPersona/:identificacion', async (req, res) => {
    const identificacion = req.params.identificacion;
    const newData = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Conexión exitosa a MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Verificar si la persona existe antes de intentar actualizarla
        const persona = await collection.findOne({ identificacion: identificacion });
        
        if (!persona) {
            // Si la persona no existe, responder con un mensaje de error
            res.status(404).send('Persona no encontrada');
            return;
        }

        // Actualizar los datos de la persona en la base de datos
        const result = await collection.updateOne({ identificacion: identificacion }, { $set: newData });

        if (result.modifiedCount === 1) {
            console.log('Persona actualizada en MongoDB:', identificacion);
            res.status(200).send('Datos de la persona actualizados correctamente.');
        } else {
            // Si no se pudo actualizar la persona, responder con un mensaje de error
            res.status(500).send('Error al actualizar los datos de la persona');
        }
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        res.status(500).send('Error al conectar con MongoDB. Por favor, inténtelo de nuevo.');
    } finally {
        await client.close();
    }
});

// Manejar otras solicitudes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/vista/index.html');
});

app.get('/segundoFormulario', (req, res) => {
    res.sendFile(__dirname + '/vista/dtoPersonal.html');
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


